import { CreditCard } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import PaymentModal from './PaymentModal'

function VirtualCard({ fullName, unit, complex, hasUnitAccess }) {
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [selectedBillForPayment, setSelectedBillForPayment] = useState(null)

    // --- 1. Calculation Logic ---
    // We isolate the numbers here so the JSX stays clean
    const { totalRent, currentBalance, isPaid } = useMemo(() => {
        const total = parseFloat(unit?.monthlyRent || 0)
        const balance = parseFloat(unit?.rentBalance || 0)
        return {
            totalRent: total,
            currentBalance: balance,
            isPaid: balance <= 0 && total > 0
        }
    }, [unit])

    // --- 2. Action Handler ---
    const handlePayClick = () => {
        if (!hasUnitAccess) return

        // We pass 'rent' as the ID so the system knows to update 
        // the rentBalance path in the DB and the Rent stat in the complex
        setSelectedBillForPayment([{
            id: 'rent',
            description: 'Monthly Rent',
            category: 'Rent',
            amount: totalRent,
            current: currentBalance
        }])
        setPaymentModalOpen(true)
    }

    return (
        <div className="bg-linear-to-br from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <CreditCard size={20} className="opacity-90" />
                    <span className="text-xs font-medium tracking-widest uppercase opacity-70">Resident Card</span>
                </div>
                {isPaid && (
                    <span className="bg-green-400/20 text-green-300 text-[10px] px-2 py-1 rounded font-bold border border-green-400/30">
                        PAID
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mb-6">
                <h2 className="text-xl font-bold">{fullName || 'Tenant'}</h2>
                <p className="text-xs opacity-70">
                    {hasUnitAccess ? `${complex?.name} · Unit ${unit?.unitNumber}` : 'Pending Authentication'}
                </p>
            </div>

            {/* Balance Section */}
            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${currentBalance.toLocaleString()}</span>
                    <span className="text-lg opacity-50 font-light">/ ${totalRent.toLocaleString()}</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider opacity-60 mt-1">Current Rent Balance</p>
            </div>

            {/* Action */}
            <button
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-md
                    ${hasUnitAccess 
                        ? 'bg-white text-blue-600 hover:bg-blue-50 active:scale-[0.98]' 
                        : 'bg-white/20 text-white/60 cursor-not-allowed'}`}
                disabled={!hasUnitAccess || isPaid}
                onClick={handlePayClick}
            >
                {!hasUnitAccess ? 'Enter Access Code' : isPaid ? 'Rent Fully Paid' : 'Pay Monthly Rent'}
            </button>

            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => {
                    setPaymentModalOpen(false)
                    setSelectedBillForPayment(null)
                }}
                bills={selectedBillForPayment}
                onPaymentComplete={(transaction) => console.log('Rent Payment Processed')}
            />
        </div>
    )
}

export default VirtualCard