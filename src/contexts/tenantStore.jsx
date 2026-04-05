import { create } from 'zustand'
import { db } from '../../firebase.config'
import { ref, get as dbGet, set as setDB, onValue, off } from 'firebase/database'

export const useTenantStore = create((set, get) => ({
  accessCode: '',
  complexId: null,
  unitId: null,
  complex: null,
  unit: null,
  recentBill: null,
  allBills: [],
  hasUnitAccess: false,
  loading: false,
  error: null,
  unsubscribeComplex: null,

  fetchUnitByAccessCode: async (code, tenantUid) => {
    const normalizedCode = code?.trim()

    if (!normalizedCode) {
      set({ error: 'Please enter an access code' })
      return { success: false }
    }

    if (!tenantUid) {
      set({ error: 'Tenant must be logged in to claim unit' })
      return { success: false }
    }

    set({ loading: true, error: null })

    try {
      const accessSnapshot = await dbGet(ref(db, `accessCodes/${normalizedCode}`))
      if (!accessSnapshot.exists()) {
        set({ loading: false, error: 'Access code not found' })
        return { success: false }
      }

      const accessData = accessSnapshot.val()
      const complexId = accessData.complexId
      const unitId = accessData.unitId

      if (!complexId || !unitId) {
        set({ loading: false, error: 'Invalid access code mapping' })
        return { success: false }
      }

      const complexSnapshot = await dbGet(ref(db, `complexes/${complexId}`))
      if (!complexSnapshot.exists()) {
        set({ loading: false, error: 'Complex not found' })
        return { success: false }
      }

      const complex = complexSnapshot.val()
      const unit = complex.units?.[unitId] ?? null

      if (!unit) {
        set({ loading: false, error: 'Unit not found for this access code' })
        return { success: false }
      }

      if (unit.currentTenantUID && unit.currentTenantUID !== tenantUid) {
        set({ loading: false, error: 'This unit is already assigned to another tenant' })
        return { success: false }
      }

      // Claim the unit by setting currentTenantUID
      await setDB(ref(db, `complexes/${complexId}/units/${unitId}/currentTenantUID`), tenantUid)
      const updatedUnit = {
        ...unit,
        currentTenantUID: tenantUid,
        rentBalance: unit.rentBalance || unit.monthlyRent || 0, // Initialize rent balance
      }
      const updatedComplex = {
        ...complex,
        units: {
          ...complex.units,
          [unitId]: updatedUnit,
        },
      }

      let recentBill = null
      const unitBills = updatedUnit.bills ?? {}
      const complexBills = updatedComplex.bills ?? {}

      const getRecentBillFromList = (bills) => {
        const list = Object.values(bills || {}).filter(b => b.amount > 0)
        if (list.length === 0) return null
        return list
          .filter(Boolean)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
      }

      recentBill = getRecentBillFromList(unitBills) || getRecentBillFromList(
        Object.values(complexBills).filter((bill) => !bill.unitId || bill.unitId === unitId)
      )

      if (!recentBill && updatedUnit.monthlyRent) {
        recentBill = {
          amount: updatedUnit.rentBalance,
          description: `Monthly rent for unit ${updatedUnit.unitNumber || unitId}`,
          dueDate: 'Next billing cycle',
        }
      }

      const allBills = [
        ...Object.values(unitBills).filter(Boolean).filter(b => b.amount > 0),
        ...Object.values(complexBills).filter((bill) => !bill.unitId || bill.unitId === unitId).filter(Boolean).filter(b => b.amount > 0)
      ].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))

      set({
        accessCode: normalizedCode,
        complexId,
        unitId,
        complex: updatedComplex,
        unit: updatedUnit,
        recentBill,
        allBills,
        hasUnitAccess: true,
        loading: false,
        error: null,
      })

      // Set up real-time listener for complex
      const complexRef = ref(db, `complexes/${complexId}`)
      const unsubscribe = onValue(complexRef, (snapshot) => {
        if (snapshot.exists()) {
          const updatedComplex = snapshot.val()
          const updatedUnit = updatedComplex.units?.[unitId]
          if (updatedUnit) {
            // Recalculate recentBill
            let recentBill = null
            const unitBills = updatedUnit.bills ?? {}
            const complexBills = updatedComplex.bills ?? {}
            const getRecentBillFromList = (bills) => {
              const list = Object.values(bills || {}).filter(b => b.amount > 0)
              if (list.length === 0) return null
              return list
                .filter(Boolean)
                .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
            }
            recentBill = getRecentBillFromList(unitBills) || getRecentBillFromList(
              Object.values(complexBills).filter((bill) => !bill.unitId || bill.unitId === unitId)
            )
            if (!recentBill && updatedUnit.monthlyRent) {
              recentBill = {
                amount: updatedUnit.monthlyRent,
                description: `Monthly rent for unit ${updatedUnit.unitNumber || unitId}`,
                dueDate: 'Next billing cycle',
              }
            }
            const allBills = [
              ...Object.values(unitBills).filter(Boolean).filter(b => b.amount > 0),
              ...Object.values(complexBills).filter((bill) => !bill.unitId || bill.unitId === unitId).filter(Boolean).filter(b => b.amount > 0)
            ].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            set({
              complex: updatedComplex,
              unit: updatedUnit,
              recentBill,
              allBills,
            })
          }
        }
      })
      set({ unsubscribeComplex: unsubscribe })

      return { success: true }
    } catch (err) {
      console.error('Tenant access fetch error:', err)
      set({ loading: false, error: err.message || 'Unable to fetch unit information' })
      return { success: false }
    }
  },

  clearTenantAccess: () => {
    const { unsubscribeComplex } = get()
    if (unsubscribeComplex) {
      unsubscribeComplex()
    }
    set({
      accessCode: '',
      complexId: null,
      unitId: null,
      complex: null,
      unit: null,
      recentBill: null,
      allBills: [],
      hasUnitAccess: false,
      loading: false,
      error: null,
      unsubscribeComplex: null,
    })
  },

  fetchAllBills: async () => {
    const { complexId, unitId, complex, unit } = get()

    if (!complexId || !unitId || !complex || !unit) {
      set({ error: 'Unit access required to fetch bills', allBills: [] })
      return { success: false }
    }

    try {
      const unitBills = complex.units?.[unitId]?.bills ?? {}
      const complexBills = complex.bills ?? {}

      const rentBill = unit.rentBalace != null ? {
        id: 'rent-bill',
        description: `Rent for unit ${unit.unitNumber || unitId}`,
        category: 'Rent',
        amount: unit.monthlyRent,
        dueDate: 'Next billing cycle',
        paid: false,
        createdAt: unit.updatedAt || complex.updatedAt || Date.now(),
      } : null

      const combinedBills = [
        ...(rentBill ? [rentBill] : []),
        ...Object.values(unitBills).filter(Boolean),
        ...Object.values(complexBills)
          .filter(Boolean)
          .filter((bill) => !bill.unitId || bill.unitId === unitId),
      ]

      const sortedBills = combinedBills.sort((a, b) => {
        const aIsRent = a.category?.toLowerCase() === 'rent' || a.description?.toLowerCase().includes('rent')
        const bIsRent = b.category?.toLowerCase() === 'rent' || b.description?.toLowerCase().includes('rent')

        if (aIsRent && !bIsRent) return -1
        if (!aIsRent && bIsRent) return 1

        return (b.createdAt || 0) - (a.createdAt || 0)
      })

      set({ allBills: sortedBills, error: null })
      return { success: true, bills: sortedBills }
    } catch (err) {
      console.error('Error fetching all bills:', err)
      set({ error: err.message || 'Failed to fetch bills', allBills: [] })
      return { success: false }
    }
  },
}))

