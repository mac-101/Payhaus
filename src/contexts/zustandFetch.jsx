import { create } from 'zustand'
import { db } from '../../firebase.config'
import { ref, get as dbGet, set as setDB, push, serverTimestamp, remove, update } from 'firebase/database'

export const usePropertyStore = create((set, get) => ({
  complexes: [],
  loading: false,
  error: null,

  fetchUserComplexes: async (uid) => {
    if (!uid) {
      set({ complexes: [], loading: false, error: 'No user ID provided' })
      return
    }

    set({ loading: true, error: null })

    try {
      // Get list of complex IDs from user's complexes (just references)
      const userComplexesSnapshot = await dbGet(ref(db, `users/${uid}/complexes`))
      const userComplexesData = userComplexesSnapshot.val()

      if (!userComplexesData || typeof userComplexesData !== 'object') {
        set({ complexes: [], loading: false })
        return
      }

      const complexIds = Object.keys(userComplexesData)
      if (complexIds.length === 0) {
        set({ complexes: [], loading: false })
        return
      }

      // Fetch full complex data from complexes collection
      const complexesData = await Promise.all(
        complexIds.map(async (complexId) => {
          const complexRef = ref(db, `complexes/${complexId}`)
          const complexSnapshot = await dbGet(complexRef)

          if (complexSnapshot.exists()) {
            return {
              id: complexId,
              ...complexSnapshot.val()
            }
          }

          return null
        })
      )

      set({ complexes: complexesData.filter(Boolean), loading: false })
    } catch (err) {
      console.error('Error fetching complexes:', err)
      set({ error: err.message, loading: false })
    }
  },

  getComplexById: (complexId) => {
    const { complexes } = get()
    return complexes.find(c => c.id === complexId)
  },

  deleteUnit: async (complexId, unitId) => {
    try {
      // Get the unit to find the access code
      const complexRef = ref(db, `complexes/${complexId}`)
      const complexSnapshot = await dbGet(complexRef)
      const complex = complexSnapshot.val()
      const unitToDelete = complex.units[unitId]

      if (unitToDelete?.accessCode) {
        // Delete the access code entry
        await remove(ref(db, `accessCodes/${unitToDelete.accessCode}`))
      }

      // Delete the unit
      await remove(ref(db, `complexes/${complexId}/units/${unitId}`))

      // Update local state
      set((state) => ({
        complexes: state.complexes.map((c) =>
          c.id === complexId
            ? {
                ...c,
                units: Object.fromEntries(
                  Object.entries(c.units || {}).filter(([id]) => id !== unitId)
                ),
              }
            : c
        ),
      }))

      return { success: true }
    } catch (err) {
      console.error('Error deleting unit:', err)
      throw err
    }
  },

  updateUnitBilling: async (complexId, unitId, newBillingAmount) => {
    try {
      await update(ref(db, `complexes/${complexId}/units/${unitId}`), {
        monthlyRent: parseFloat(newBillingAmount),
        updatedAt: serverTimestamp(),
      })

      // Update local state
      set((state) => ({
        complexes: state.complexes.map((c) =>
          c.id === complexId
            ? {
                ...c,
                units: {
                  ...c.units,
                  [unitId]: {
                    ...c.units[unitId],
                    monthlyRent: parseFloat(newBillingAmount),
                  },
                },
              }
            : c
        ),
      }))

      return { success: true }
    } catch (err) {
      console.error('Error updating billing:', err)
      throw err
    }
  },

  endTenancy: async (complexId, unitId) => {
    try {
      // Get current unit data
      const complexRef = ref(db, `complexes/${complexId}`)
      const complexSnapshot = await dbGet(complexRef)
      const complex = complexSnapshot.val()
      const unit = complex.units[unitId]
      const oldAccessCode = unit.accessCode

      // Generate new access code
      const generateAccessCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 4; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
      }

      const newAccessCode = `${complex.name.substring(0, 3).toUpperCase()}-${unit.unitNumber}-${generateAccessCode()}`

      // Remove old access code
      if (oldAccessCode) {
        await remove(ref(db, `accessCodes/${oldAccessCode}`))
      }

      // Create new access code mapping
      await setDB(ref(db, `accessCodes/${newAccessCode}`), {
        landlordUID: complex.landlordUID,
        complexId: complexId,
        unitId: unitId,
      })

      // Update unit: clear tenant, update access code
      await update(ref(db, `complexes/${complexId}/units/${unitId}`), {
        currentTenantUID: null,
        currentAccessCodeId: newAccessCode,
        accessCode: newAccessCode,
        updatedAt: serverTimestamp(),
      })

      // Update local state
      set((state) => ({
        complexes: state.complexes.map((c) =>
          c.id === complexId
            ? {
                ...c,
                units: {
                  ...c.units,
                  [unitId]: {
                    ...c.units[unitId],
                    currentTenantUID: null,
                    currentAccessCodeId: newAccessCode,
                    accessCode: newAccessCode,
                  },
                },
              }
            : c
        ),
      }))

      return { success: true, newAccessCode }
    } catch (err) {
      console.error('Error ending tenancy:', err)
      throw err
    }
  },

  addBillToComplex: async (complexId, billData) => {
    try {
      if (!complexId) {
        throw new Error('Complex ID is required')
      }

      // Generate a unique bill ID
      const billId = push(ref(db, `complexes/${complexId}/bills`)).key
      const now = new Date().toISOString()

      // Prepare bill object for Firebase
      const billObjectFirebase = {
        id: billId,
        ...billData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Prepare bill object for local state (use actual timestamps)
      const billObjectLocal = {
        id: billId,
        ...billData,
        createdAt: now,
        updatedAt: now,
      }

      // Write to Firebase
      await setDB(ref(db, `complexes/${complexId}/bills/${billId}`), billObjectFirebase)

      // Update local state to reflect the change immediately
      set((state) => ({
        complexes: state.complexes.map((c) =>
          c.id === complexId
            ? {
                ...c,
                bills: {
                  ...(c.bills || {}),
                  [billId]: billObjectLocal,
                },
              }
            : c
        ),
      }))

      return { success: true, billId, bill: billObjectLocal }
    } catch (err) {
      console.error('Error adding bill:', err)
      return { success: false, error: err.message }
    }
  },
}))
