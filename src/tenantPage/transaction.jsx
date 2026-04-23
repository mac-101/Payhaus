import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTransactionStore } from "../contexts/transactionStore";
import { TransactionCard } from "../components/transactionCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReceiptView } from "../components/ReceiptView";

export default function TenantTransactionsPage() {
    const { uid } = useAuth();
    const navigate = useNavigate();
    const { transactions, loading, fetchUserTransactions } = useTransactionStore();
    const [selectedTx, setSelectedTx] = useState(null);

    useEffect(() => {
        if (uid) fetchUserTransactions(uid);
    }, [uid, fetchUserTransactions]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-sm font-bold text-blue-600 tracking-widest uppercase animate-pulse">
                    Updating Ledger...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            {/* Header Section */}
            <header className="mb-10">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider">Back to Dashboard</span>
                </button>
                
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    Transactions
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Your complete history of payments and settlements.
                </p>
            </header>

            {selectedTx && (
                <ReceiptView tx={selectedTx} onClose={() => setSelectedTx(null)} />
            )}

            {/* List Section */}
            <div className="space-y-1">
                {transactions.length > 0 ? (
                   transactions.map(tx => (
                    <div key={tx.id} onClick={() => setSelectedTx(tx)} className="cursor-pointer">
                        <TransactionCard tx={tx} />
                    </div>
                ))
                ) : (
                    <div className="py-24 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-400 font-medium">No records found in the ledger.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
