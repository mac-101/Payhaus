import { create } from 'zustand'
import { db } from '../../firebase.config'
import { ref, onValue, off, set as setDB, push, serverTimestamp, remove, update, get as dbGet } from 'firebase/database'

export const usePropertyStore = create((set, get) => ({
  complexes: [],
  loading: false,
  error: null,
  unsubscribeComplexes: null, // Store cleanup function

  fetchUserComplexes: (uid) => {
    if (!uid) {
      set({ complexes: [], loading: false, error: 'No user ID provided' })
      return
    }

    // Clean up any existing listener before starting a new one
    const existingUnsubscribe = get().unsubscribeComplexes
    if (existingUnsubscribe) existingUnsubscribe()

    set({ loading: true, error: null })

    const userComplexesRef = ref(db, `users/${uid}/complexes`)

    // Set up real-time listener on the user's complex list
    const unsubscribe = onValue(userComplexesRef, async (snapshot) => {
      try {
        const userComplexesData = snapshot.val()

        if (!userComplexesData || typeof userComplexesData !== 'object') {
          set({ complexes: [], loading: false })
          return
        }

        const complexIds = Object.keys(userComplexesData)
        
        // Fetch full complex data for each ID
        // Note: For absolute real-time on every property, you could nest listeners, 
        // but fetching all at once when the list changes is usually sufficient and more performant.
        const complexesData = await Promise.all(
          complexIds.map(async (complexId) => {
            const complexSnapshot = await dbGet(ref(db, `complexes/${complexId}`))
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
        console.error('Error in real-time complexes listener:', err)
        set({ error: err.message, loading: false })
      }
    }, (err) => {
      set({ error: err.message, loading: false })
    })

    set({ unsubscribeComplexes: unsubscribe })
  },

  // IMPORTANT: Call this when logging out
  stopListening: () => {
    const unsubscribe = get().unsubscribeComplexes
    if (unsubscribe) {
      unsubscribe()
      set({ unsubscribeComplexes: null })
    }
  },

  getComplexById: (complexId) => {
    const { complexes } = get()
    return complexes.find(c => c.id === complexId)
  },

  deleteUnit: async (complexId, unitId) => {
    try {
      const complexRef = ref(db, `complexes/${complexId}`)
      const complexSnapshot = await dbGet(complexRef)
      const complex = complexSnapshot.val()
      const unitToDelete = complex.units[unitId]

      if (unitToDelete?.accessCode) {
        await remove(ref(db, `accessCodes/${unitToDelete.accessCode}`))
      }

      await remove(ref(db, `complexes/${complexId}/units/${unitId}`))
      // Local state will auto-update via the onValue listener in fetchUserComplexes
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
      return { success: true }
    } catch (err) {
      console.error('Error updating billing:', err)
      throw err
    }
  },

  endTenancy: async (complexId, unitId) => {
    try {
      const complexSnapshot = await dbGet(ref(db, `complexes/${complexId}`))
      const complex = complexSnapshot.val()
      const unit = complex.units[unitId]
      const oldAccessCode = unit.accessCode
      const tenantUid = unit.currentTenantUID

      const generateAccessCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''
        for (let i = 0; i < 4; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
      }

      const newAccessCode = `${complex.name.substring(0, 3).toUpperCase()}-${unit.unitNumber}-${generateAccessCode()}`

      if (oldAccessCode) {
        await remove(ref(db, `accessCodes/${oldAccessCode}`))
      }

      // If there's a tenant, remove this unit from their profile too
      if (tenantUid) {
          await remove(ref(db, `users/${complex.landlordUID}/tenants/${tenantUid}`))
      }

      await setDB(ref(db, `accessCodes/${newAccessCode}`), {
        landlordUID: complex.landlordUID,
        complexId: complexId,
        unitId: unitId,
      })

      await update(ref(db, `complexes/${complexId}/units/${unitId}`), {
        currentTenantUID: null,
        currentAccessCodeId: newAccessCode,
        accessCode: newAccessCode,
        updatedAt: serverTimestamp(),
      })

      return { success: true, newAccessCode }
    } catch (err) {
      console.error('Error ending tenancy:', err)
      throw err
    }
  },

  addBillToComplex: async (complexId, billData) => {
    try {
      if (!complexId) throw new Error('Complex ID is required')

      const billId = push(ref(db, `complexes/${complexId}/bills`)).key

      const billObjectFirebase = {
        id: billId,
        ...billData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDB(ref(db, `complexes/${complexId}/bills/${billId}`), billObjectFirebase)
      return { success: true, billId }
    } catch (err) {
      console.error('Error adding bill:', err)
      return { success: false, error: err.message }
    }
  },
}))