import { create } from 'zustand';
import { db } from '../../firebase.config';
import { ref, get as dbGet } from 'firebase/database';

export const useTenantDirectoryStore = create((set) => ({
  tenantList: [], // Array of { uid, complexId, unitId }
  loading: false,
  error: null,

  fetchLandlordTenants: async (landlordUid) => {
    set({ loading: true, error: null });
    try {
      const snapshot = await dbGet(ref(db, `users/${landlordUid}/tenants`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Transform { uid: {details} } into an array
        const list = Object.entries(data).map(([uid, info]) => ({
          uid,
          ...info
        }));
        set({ tenantList: list, loading: false });
      } else {
        set({ tenantList: [], loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));