import { Receipt, Building2, ChevronRight } from "lucide-react";

export function TransactionCard({ tx }) {
    const date = tx.timestamp 
        ? new Date(tx.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
        : '...';

    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl mb-3">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 text-gray-400 rounded-xl">
                    <Receipt size={20} />
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {tx.description}
                    </h4>
                    
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        {tx.tenantName} to {tx.landlordName}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-gray-400">
                            <Building2 size={10} />
                            <span className="text-[10px] font-medium uppercase tracking-wider">
                                {tx.complexName} · Unit {tx.unitId}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-400 font-medium">{date}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                         ₦{Number(tx.amount).toLocaleString()}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${
                        tx.status === 'Paid' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                        {tx.status}
                    </p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
            </div>
        </div>
    );
}