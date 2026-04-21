import { Receipt, Building2, ChevronRight } from "lucide-react";

export function TransactionCard({ tx }) {
    const date = new Date(tx.timestamp).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-sm hover:border-blue-400 hover:shadow-md transition-all mb-3">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Receipt size={22} />
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">
                        {tx.description}
                    </h4>
                    {/* Displaying names here */}
                    <p className="text-[12px] text-gray-600 mt-0.5">
                        <span className="font-semibold text-blue-600">{tx.tenantName}</span> → {tx.landlordName}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1">
                            <Building2 size={12} /> Unit {tx.unitId}
                        </span>
                        <span>•</span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-base font-black text-gray-900">
                         ₦{Number(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">
                        {tx.status}
                    </p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
        </div>
    );
}