import { create } from 'zustand';
import { db } from '../../firebase.config';
import { ref, get } from 'firebase/database';

export const useTransactionStore = create((set) => ({
    transactions: [],
    loading: false,

    fetchUserTransactions: async (uid) => {
        if (!uid) return;
        set({ loading: true });

        try {
            const userTxRef = ref(db, `users/${uid}/transactions`);
            const snapshot = await get(userTxRef);

            if (snapshot.exists()) {
                const txIds = Object.keys(snapshot.val());

                const fetchPromises = txIds.map(async (txId) => {
                    const txSnap = await get(ref(db, `transactions/${txId}`));
                    
                    if (txSnap.exists()) {
                        const txData = txSnap.val();

                        // --- NEW: Fetch Names ---
                        // Fetch Tenant Name
                        const tenantSnap = await get(ref(db, `users/${txData.tenantId}/fullName`));
                        // Fetch Landlord Name
                        const landlordSnap = await get(ref(db, `users/${txData.landlordId}/fullName`));
                        // Fetch Complex Name
                        const complexSnap = await get(ref(db, `complexes/${txData.complexId}/name`));

                        return { 
                            id: txId, 
                            ...txData,
                            tenantName: tenantSnap.exists() ? tenantSnap.val() : "Unknown Tenant",
                            landlordName: landlordSnap.exists() ? landlordSnap.val() : "Unknown Landlord",
                            complexName: complexSnap.exists() ? complexSnap.val() : "Unknown Complex"
                        };
                    }
                    return null;
                });

                const results = await Promise.all(fetchPromises);
                const validTxs = results
                    .filter(t => t !== null)
                    .sort((a, b) => b.timestamp - a.timestamp);

                set({ transactions: validTxs, loading: false });
            } else {
                set({ transactions: [], loading: false });
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            set({ loading: false });
        }
    }
}));