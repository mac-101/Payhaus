import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import React from 'react'

function RecentTransactions() {
    const transactions = [
        { id: 1, type: 'payment', description: 'Rent Payment', amount: -2500, date: '2026-04-01' },
        { id: 2, type: 'payment', description: 'Utility Bill', amount: -150, date: '2026-03-28' },
        { id: 3, type: 'credit', description: 'Security Deposit Refund', amount: 1000, date: '2026-03-15' },
        { id: 4, type: 'payment', description: 'Maintenance Fee', amount: -200, date: '2026-03-10' },
    ]

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                {transaction.amount > 0 ? (
                                    <ArrowDownLeft size={16} className="text-green-600" />
                                ) : (
                                    <ArrowUpRight size={16} className="text-red-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                <p className="text-sm text-gray-500">{transaction.date}</p>
                            </div>
                        </div>
                        <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions