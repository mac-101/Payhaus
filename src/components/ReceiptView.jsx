export function ReceiptView({ tx, onClose }) {
    if (!tx) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center overflow-y-auto z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-y-auto border-t-4 border-blue-600">
                {/* Receipt Header */}
                <div className="p-8 text-center border-b border-dashed border-gray-200">
                    <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">
                        {tx.complexName}
                    </h3>
                    <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
                        Official Receipt
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                        ID: {tx.id}
                    </p>
                </div>

                {/* Receipt Body */}
                <div className="p-8 space-y-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Date</span>
                        <span className="text-gray-900 font-bold">{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Tenant</span>
                        <span className="text-gray-900 font-bold">{tx.tenantName || 'Tenant'}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Landlord/Manager</span>
                        <span className="text-gray-900 font-bold">{tx.landlordName || 'Management'}</span>
                    </div>

                    <div className="pt-4  border-t border-gray-100 space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bill Breakdown</p>
                        {tx.billsPaid.map((bill, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{bill.isRent ? "Monthly Rent" : "Other Bill"}</span>
                                <span className="text-gray-900 font-semibold">₦{bill.amountPaid.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    {/* <div className="py-4 border-y border-gray-100 space-y-3">
                        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Description</p>
                        <span className="text-gray-900 font-semibold">{tx.description}</span>
                    </div> */}

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-black text-gray-900">TOTAL</span>
                        <span className="text-2xl font-black text-blue-600">₦{tx.amount.toLocaleString()}</span>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-sm text-center">
                        <p className="text-[11px] font-bold text-blue-700 uppercase">{tx.status}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 bg-gray-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white border border-gray-200 text-gray-500 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}