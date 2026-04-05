import { CreditCard, DollarSign } from 'lucide-react'
import React from 'react'

function VirtualCard({ fullName }) {
    const upcomingBill = 2500; // Mock data
    const billText = "Rent for April 2026";

    return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <CreditCard size={24} />
                <span className="text-sm opacity-80">Virtual Card</span>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Hello, {fullName || 'Tenant'}</h2>
            </div>
            <div className="mb-4">
                <p className="text-sm opacity-80 mb-1">Upcoming Bill</p>
                <p className="text-2xl font-bold">${upcomingBill.toLocaleString()}</p>
                <p className="text-sm opacity-80">{billText}</p>
            </div>
            <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Pay Bills
            </button>
        </div>
    )
}

export default VirtualCard