import React, { useState, useEffect } from 'react'
import { X, CreditCard, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTenantStore } from '../contexts/tenantStore'
import { db } from '../../firebase.config'
import { ref, push, set , update as updateDB } from 'firebase/database'

function PaymentModal({ isOpen, onClose, bills, onPaymentComplete }) {
    const { user } = useAuth()
    const { unit, complex, unitId } = useTenantStore()
    const [paymentAmount, setPaymentAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const billsArray = Array.isArray(bills) ? bills : [bills].filter(Boolean)
    const totalDue = billsArray.reduce((sum, b) => sum + (b.amount || 0), 0)

    useEffect(() => {
        if (billsArray.length > 0 && isOpen) {
            setPaymentAmount(totalDue.toFixed(2))
            setError('')
        }
    }, [billsArray, isOpen, totalDue])

    // Guard clause
    if (!isOpen || billsArray.length === 0) return null

    const handleInstallmentChange = (numInstallments) => {
        setSelectedInstallments(numInstallments)
        setPaymentAmount((installmentAmount * numInstallments).toFixed(2))
    }

    const handleAmountChange = (amount) => {
        setPaymentAmount(amount)
    }

    const handlePayment = async () => {
        if (!billsArray.length || !user || !unit || !complex) return

        const amount = parseFloat(paymentAmount)
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid payment amount')
            return
        }

        if (amount > totalDue) {
            setError('Payment amount cannot exceed total due')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Distribute payment
            let remaining = amount
            const billsPaid = billsArray.map(b => ({ id: b.id, amountPaid: 0, isRent: b.category?.toLowerCase() === 'rent' || b.description?.toLowerCase().includes('rent') }))
            for (let i = 0; i < billsArray.length && remaining > 0; i++) {
                const bill = billsArray[i]
                const pay = Math.min(remaining, bill.amount)
                billsPaid[i].amountPaid = pay
                remaining -= pay
                bill.amount -= pay
            }

            // Create transaction record
            const transactionRef = push(ref(db, 'transactions'))
            const transactionId = transactionRef.key

            const transaction = {
                id: transactionId,
                tenantId: user.uid,
                landlordId: complex.landlordId || 'landlord-1',
                unitId: unitId,
                complexId: complex.id,
                billId: billsPaid[0]?.id || '',
                amount: amount,
                type: 'bill',
                description: `Payment for bills`,
                billsPaid,
                timestamp: Date.now(),
                status: 'completed'
            }

            // Save transaction
            await set(transactionRef, transaction)

            // Update each bill
            for (let i = 0; i < billsArray.length; i++) {
                const bill = billsArray[i]
                const billPath = unit.bills && unit.bills[bill.id] ? `complexes/${complex.id}/units/${unitId}/bills/${bill.id}` : `complexes/${complex.id}/bills/${bill.id}`
                const updateData = { amount: bill.amount }
                if (bill.amount <= 0) updateData.paid = true
                await updateDB(ref(db, billPath), updateData)

                if (billsPaid[i].isRent) {
                    await updateDB(ref(db, `complexes/${complex.id}/units/${unitId}`), { rentBalance: bill.amount })
                }
            }

            onPaymentComplete?.(transaction)
            onClose()
        } catch (err) {
            console.error('Payment error:', err)
            setError(err.message || 'Payment failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !billsArray) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard size={24} className="text-blue-600" />
                            Pay Bill
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Bill Details */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Total Amount Due</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Amount Due:</span>
                            <span className="font-semibold text-gray-900">${totalDue.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Bills List */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Bills to Pay</h3>
                        <div className="space-y-2">
                            {billsArray.map((bill, index) => (
                                <div key={bill.id || index} className="flex justify-between text-sm">
                                    <span>{bill.description}</span>
                                    <span>${bill.amount?.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    

                    {/* Payment Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Amount
                        </label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-500`}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                max={bills.amount}
                            />
                        </div>
                        
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-600" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={loading || !paymentAmount || parseFloat(paymentAmount) <= 0}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    Pay ${paymentAmount || '0.00'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal