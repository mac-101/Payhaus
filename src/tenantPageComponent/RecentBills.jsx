import { FileText, AlertCircle, CreditCard } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useTenantStore } from '../contexts/tenantStore'
import PaymentModal from './PaymentModal'

function RecentBills() {
    const { allBills, hasUnitAccess, fetchAllBills } = useTenantStore()
    const [selectedBills, setSelectedBills] = useState([])
    const [loading, setLoading] = useState(true)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [selectedBillForPayment, setSelectedBillForPayment] = useState(null)

    useEffect(() => {
        if (hasUnitAccess) {
            const loadBills = async () => {
                setLoading(true)
                await fetchAllBills()
                setLoading(false)
            }
            loadBills()
        } else {
            setLoading(false)
        }
    }, [hasUnitAccess, fetchAllBills])

    // Show all bills, sorted by priority (rent first)
    // Show only unpaid bills (amount > 0), sorted by priority (rent first)
    const displayBills = allBills
        .filter(bill => (bill.amount || 0) > 0) // <--- Add this line
        .sort((a, b) => {
            const aIsRent = a.description?.toLowerCase().includes('rent') || a.category?.toLowerCase() === 'rent'
            const bIsRent = b.description?.toLowerCase().includes('rent') || b.category?.toLowerCase() === 'rent'
            if (aIsRent && !bIsRent) return -1
            if (!aIsRent && bIsRent) return 1
            return 0
        })

    const handleBillSelect = (billId) => {
        setSelectedBills(prev =>
            prev.includes(billId)
                ? prev.filter(id => id !== billId)
                : [...prev, billId]
        )
    }

    const handleSelectAll = () => {
        if (selectedBills.length === displayBills.length) {
            setSelectedBills([])
        } else {
            setSelectedBills(displayBills.map(bill => bill.id))
        }
    }

    const handlePaySelected = () => {
        if (selectedBills.length === 1) {
            const bill = displayBills.find(b => b.id === selectedBills[0])
            if (bill) {
                setSelectedBillForPayment(bill)
                setPaymentModalOpen(true)
            }
        } else {
            // Handle multiple bill payments - for now, open modal for first selected bill
            const bill = displayBills.find(b => b.id === selectedBills[0])
            if (bill) {
                setSelectedBillForPayment(bill)
                setPaymentModalOpen(true)
            }
        }
    }

    const handlePayAll = () => {
        // For now, pay the first bill. In future, could implement bulk payment
        const firstBill = displayBills[0]
        if (firstBill) {
            setSelectedBillForPayment(firstBill)
            setPaymentModalOpen(true)
        }
    }

    const handlePaymentComplete = (transaction) => {
        // Refresh bills after payment
        fetchAllBills()
        // Clear selections
        setSelectedBills([])
        setSelectedBillForPayment(null)
    }

    const totalSelectedAmount = displayBills
        .filter(bill => selectedBills.includes(bill.id))
        .reduce((sum, bill) => sum + (bill.amount || 0), 0)

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bills</h3>
                {displayBills.length > 0 && !loading && (
                    <button
                        onClick={handleSelectAll}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        {selectedBills.length === displayBills.length ? 'Deselect All' : 'Select All'}
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading bills...</p>
                    </div>
                ) : displayBills.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No bills yet</p>
                    </div>
                ) : (
                    <>
                        {displayBills.map((bill) => {
                            const isRent = bill.description?.toLowerCase().includes('rent') ||
                                bill.category?.toLowerCase() === 'rent'
                            const amount = bill.amount || 0
                            const isSelected = selectedBills.includes(bill.id)

                            return (
                                <div
                                    key={bill.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-gray-50 border-gray-200 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleBillSelect(bill.id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <div className={`p-2 rounded-full ${isRent ? 'bg-red-100' : 'bg-blue-100'}`}>
                                            {isRent ? (
                                                <AlertCircle size={16} className="text-red-600" />
                                            ) : (
                                                <FileText size={16} className="text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{bill.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {bill.dueDate ? `Due: ${new Date(bill.dueDate).toLocaleDateString()}` : bill.category || 'Bill'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${isRent ? 'text-red-600' : 'text-gray-900'}`}>
                                        ${amount.toLocaleString()}
                                    </span>
                                </div>
                            )
                        })}

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-2">
                            {selectedBills.length > 0 && (
                                <button
                                    onClick={handlePaySelected}
                                    className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} />
                                    Pay Selected Bills (${totalSelectedAmount.toLocaleString()})
                                </button>
                            )}
                            {displayBills.length > 1 && (
                                <button
                                    onClick={handlePayAll}
                                    className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} />
                                    Pay All Bills
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => {
                    setPaymentModalOpen(false)
                    setSelectedBillForPayment(null)
                }}
                bills={selectedBillForPayment}
                onPaymentComplete={handlePaymentComplete}
            />
        </div>
    )
}

export default RecentBills