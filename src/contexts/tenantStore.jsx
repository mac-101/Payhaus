import { create } from 'zustand'
import { db } from '../../firebase.config'
import { ref, get as dbGet, set as setDB, onValue, off, serverTimestamp } from 'firebase/database'

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

    // Clean up existing listener if one exists
    const currentUnsubscribe = get().unsubscribeComplex
    if (currentUnsubscribe) currentUnsubscribe()

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

      // Initial check to see if complex exists and get Landlord ID
      const complexSnapshot = await dbGet(ref(db, `complexes/${complexId}`))
      if (!complexSnapshot.exists()) {
        set({ loading: false, error: 'Complex not found' })
        return { success: false }
      }

      const initialComplex = complexSnapshot.val()
      const landlordId = initialComplex.landlordUID || initialComplex.ownerId; 
      const unit = initialComplex.units?.[unitId] ?? null

      if (!unit) {
        set({ loading: false, error: 'Unit not found' })
        return { success: false }
      }

      if (unit.currentTenantUID && unit.currentTenantUID !== tenantUid) {
        set({ loading: false, error: 'Unit already assigned' })
        return { success: false }
      }

      // 1. Link Tenant to Landlord
      if (landlordId) {
        await setDB(ref(db, `users/${landlordId}/tenants/${tenantUid}`), {
          joinedAt: serverTimestamp(),
          activeUnit: unitId,
          complexId: complexId
        })
      }

      // 2. Claim the unit
      await setDB(ref(db, `complexes/${complexId}/units/${unitId}/currentTenantUID`), tenantUid)

      // 3. Setup Real-time Listener (onValue)
      const complexRef = ref(db, `complexes/${complexId}`)
      const unsubscribe = onValue(complexRef, (snapshot) => {
        if (snapshot.exists()) {
          const updatedComplex = snapshot.val()
          const updatedUnit = updatedComplex.units?.[unitId]

          if (updatedUnit) {
            // Helper to find the most recent bill
            const getRecentBillFromList = (bills) => {
              const list = Object.values(bills || {}).filter(b => b.amount > 0)
              if (list.length === 0) return null
              return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
            }

            const unitBills = updatedUnit.bills ?? {}
            const complexBills = updatedComplex.bills ?? {}
            
            let recent = getRecentBillFromList(unitBills) || 
                         getRecentBillFromList(Object.values(complexBills).filter(b => !b.unitId || b.unitId === unitId))

            if (!recent && updatedUnit.monthlyRent) {
              recent = {
                amount: updatedUnit.rentBalance || updatedUnit.monthlyRent,
                description: `Monthly rent for unit ${updatedUnit.unitNumber || unitId}`,
                dueDate: 'Next billing cycle',
              }
            }

            set({
              complex: updatedComplex,
              unit: {
                ...updatedUnit,
                rentBalance: updatedUnit.rentBalance ?? updatedUnit.monthlyRent ?? 0
              },
              recentBill: recent,
              complexId,
              unitId,
              accessCode: normalizedCode,
              hasUnitAccess: true,
              loading: false
            })
          }
        }
      })

      set({ unsubscribeComplex: unsubscribe })
      return { success: true }

    } catch (err) {
      console.error('Tenant access fetch error:', err)
      set({ loading: false, error: err.message })
      return { success: false }
    }
  },

  clearTenantAccess: () => {
    const { unsubscribeComplex } = get()
    if (unsubscribeComplex) unsubscribeComplex()
    
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
      set({ error: 'Unit access required', allBills: [] })
      return { success: false }
    }

    try {
      const unitBills = complex.units?.[unitId]?.bills ?? {}
      const complexBills = complex.bills ?? {}

      // Corrected spelling from rentBalace to rentBalance
      const rentBill = unit.rentBalance != null ? {
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
      set({ error: err.message, allBills: [] })
      return { success: false }
    }
  },
}))