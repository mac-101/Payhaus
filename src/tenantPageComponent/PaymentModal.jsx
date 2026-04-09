import React, { useState, useEffect } from 'react'
import { X, CreditCard, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTenantStore } from '../contexts/tenantStore'
import { db } from '../../firebase.config'
import { ref, push, set, update as updateDB, increment } from 'firebase/database'

function PaymentModal({ isOpen, onClose, bills, onPaymentComplete }) {
    const { user } = useAuth()
    const { unit, complex, unitId } = useTenantStore()
    const [paymentAmount, setPaymentAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // 1. Convert bills to a stable array immediately
    const billsArray = React.useMemo(() => {
        if (!bills) return [];
        return Array.isArray(bills) ? bills : [bills];
    }, [bills]);

    // 2. Calculate total based on 'current' balance
    const totalDue = React.useMemo(() => {
        return billsArray.reduce((sum, b) => sum + (parseFloat(b.current || b.amount || 0)), 0);
    }, [billsArray]);

    // 3. Set the input value when the modal opens
    useEffect(() => {
        if (isOpen && billsArray.length > 0) {
            setPaymentAmount(totalDue.toFixed(2));
            setError('');
        }
    }, [isOpen, totalDue, billsArray]);

    // 4. THE GUARD: Only block if the modal is closed. 
    // Do NOT block based on billsArray length here, do it inside the return.
    if (!isOpen) return null;

    const handleAmountChange = (val) => {
        // Convert input to a number for comparison
        const enteredAmount = parseFloat(val);
        const limit = totalDue;

        // If the user types a number higher than the limit, force it back to the limit
        if (enteredAmount > limit) {
            setPaymentAmount(limit.toFixed(2));
            setError(`Amount cannot exceed the balance of $${limit.toFixed(2)}`);
        } else {
            setPaymentAmount(val);
            setError(''); // Clear error if they fix the amount
        }
    }

    const handlePayment = async () => {
        if (billsArray.length === 0 || !user || !unit || !complex) return;

        const amount = parseFloat(paymentAmount);

        if (amount > (totalDue + 0.01)) {
            setError('Payment amount cannot exceed total due');
            setLoading(false); // Make sure loading stops
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid payment amount');
            return;
        }

        if (amount > (totalDue + 0.01)) {
            setError('Payment amount cannot exceed total due');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let remaining = amount;
            const billsPaid = billsArray.map(b => ({
                id: b.id,
                amountPaid: 0,
                isRent: b.description?.toLowerCase().includes('rent') || b.id === 'rent'
            }));

            // Logic to deduct from bills
            for (let i = 0; i < billsArray.length && remaining > 0; i++) {
                const bill = billsArray[i];
                const billVal = parseFloat(bill.current || 0);
                const pay = Math.min(remaining, billVal);
                billsPaid[i].amountPaid = pay;
                remaining -= pay;
                bill.current = billVal - pay;
            }

            const transactionRef = push(ref(db, 'transactions'));
            const transaction = {
                id: transactionRef.key,
                tenantId: user.uid,
                landlordId: complex.landlordId || 'landlord-1',
                unitId: unitId,
                complexId: complex.id,
                amount: amount,
                type: 'bill',
                description: `Payment for bills`,
                billsPaid,
                timestamp: Date.now(),
                status: 'completed'
            };

            await set(transactionRef, transaction);

            // Update Database
            for (let i = 0; i < billsArray.length; i++) {
                const bill = billsArray[i];
                const paymentApplied = billsPaid[i].amountPaid;

                if (paymentApplied <= 0) continue; // Skip if no money went to this bill

                const billPath = unit.bills?.[bill.id]
                    ? `complexes/${complex.id}/units/${unitId}/bills/${bill.id}`
                    : `complexes/${complex.id}/bills/${bill.id}`;

                const updateData = { current: bill.current };
                if (bill.current <= 0) updateData.paid = true;

                // A) Update the specific bill in the unit
                await updateDB(ref(db, billPath), updateData);

                // B) Update the MASTER STATS for the landlord
                const statsPath = `complexes/${complex.id}/stats/${bill.id}`;
                const statsUpdate = {
                    [`${statsPath}/totalPaid`]: increment(paymentApplied),
                    [`${statsPath}/unpaid`]: increment(-paymentApplied),
                    [`${statsPath}/lastUpdated`]: Date.now()
                };

                await updateDB(ref(db), statsUpdate);

                // C) Update rentBalance if applicable
                if (billsPaid[i].isRent) {
                    await updateDB(ref(db, `complexes/${complex.id}/units/${unitId}`), {
                        rentBalance: bill.current
                    });
                }
            }

            onPaymentComplete?.(transaction);
            onClose();
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard size={24} className="text-blue-600" />
                            Pay Bill
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {billsArray.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">No bill data found.</div>
                    ) : (
                        <>
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Total Amount Due</h3>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <span>Balance:</span>
                                    <span className="font-bold text-gray-900 text-lg">${totalDue.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2 border-b pb-1">Items</h3>
                                <div className="space-y-2 mt-2">
                                    {billsArray.map((bill, index) => (
                                        <div key={bill?.id || index} className="flex justify-between text-sm text-gray-800">
                                            <span>{bill?.description || 'Monthly Rent'}</span>
                                            <span className="font-medium">${parseFloat(bill?.current || 0).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        onBlur={() => {
                                            // Optional: clean up the formatting when they click away
                                            if (paymentAmount) setPaymentAmount(parseFloat(paymentAmount).toFixed(2));
                                        }}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-black font-semibold"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        max={totalDue}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={loading || !paymentAmount}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                                >
                                    {loading ? "Processing..." : `Confirm Payment`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentModal