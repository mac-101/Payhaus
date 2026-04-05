import { CreditCard } from 'lucide-react'
import React from 'react'

function VirtualCard({ fullName, unit, complex, recentBill, hasUnitAccess }) {
    const amount = unit?.rentBalance ?? 0
    const displayAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0
    const description = 'Rent Balance'
    // const subText = unit ? `Complex: ${complex?.name || 'Unknown'}` : 'Access code required'

    return (
        <div className="bg-linear-to-br from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <CreditCard size={24} />
                <span className="text-sm opacity-80">Virtual Card</span>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Hello, {fullName || 'Tenant'}</h2>
                {unit && (
                    <p className="text-sm opacity-80 mt-1">{complex?.name} · Unit {unit.unitNumber || unit.unitId}</p>
                )}
            </div>
            <div className="mb-4">
                <p className="text-3xl font-bold">${displayAmount.toLocaleString()}</p>
                <p className="text-sm opacity-80">{description}</p>
            </div>
            <button
                className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-white/40"
                disabled={!hasUnitAccess}
            >
                {hasUnitAccess ? 'Pay Bills' : 'Enter Access Code'}
            </button>
        </div>
    )
}

export default VirtualCard