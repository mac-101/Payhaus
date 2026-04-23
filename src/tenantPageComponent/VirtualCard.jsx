import { CreditCard, User, LogOut, MapPin, Home, UserCircle, ChevronDown } from 'lucide-react'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import PaymentModal from './PaymentModal'
import { db } from '../../firebase.config' // Adjust path as needed
import { ref, get } from 'firebase/database'

function VirtualCard({ fullName, unit, complex, hasUnitAccess, onShowAccessModal, onLogout }) {
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [selectedBillForPayment, setSelectedBillForPayment] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [landlordName, setLandlordName] = useState('Loading...')
    const menuRef = useRef(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Fetch Landlord Name
    useEffect(() => {
        const fetchLandlord = async () => {
            const lId = complex?.landlordUID || complex?.ownerId
            if (!lId) return setLandlordName('N/A')
            const snap = await get(ref(db, `users/${lId}/fullName`))
            setLandlordName(snap.exists() ? snap.val() : 'Unknown Landlord')
        }
        fetchLandlord()
    }, [complex])

    const { totalRent, currentBalance, isPaid } = useMemo(() => {
        const total = parseFloat(unit?.monthlyRent || 0)
        const balance = parseFloat(unit?.rentBalance || 0)
        return { totalRent: total, currentBalance: balance, isPaid: balance <= 0 && total > 0 }
    }, [unit])

    const handleActionClick = () => {
        if (!hasUnitAccess) {
            onShowAccessModal(true) // Trigger Access Modal
            return
        }
        setSelectedBillForPayment([{
            id: 'rent', description: 'Monthly Rent', category: 'Rent',
            amount: totalRent, current: currentBalance
        }])
        setPaymentModalOpen(true)
    }

    return (
        <div className="bg-linear-to-br from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full" />

            {/* Header with Dropdown Menu */}
            <div className="flex items-center justify-between mb-8 relative z-20">
                <div className="flex items-center gap-2">
                    <CreditCard size={18} className="opacity-90" />
                    <span className="text-[10px] font-medium tracking-widest uppercase opacity-70">Resident Card</span>
                </div>
                
                <div className="flex items-center gap-3" ref={menuRef}>
                    {isPaid && <span className="bg-green-400/20 text-green-300 text-[10px] px-2 py-1 rounded font-bold border border-green-400/30">PAID</span>}
                    
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:bg-white/10 rounded-full transition-all flex items-center">
                        <User size={18} />
                        <ChevronDown size={12} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Card */}
                    {menuOpen && (
                        <div className="absolute right-0 top-8 w-56 bg-white rounded-xl shadow-2xl text-gray-800 p-4 animate-in fade-in zoom-in duration-150">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Resident Details</p>
                                    <p className="text-xs font-bold">{fullName}</p>
                                    <p className="text-[10px] text-gray-500">{complex?.name} · {unit?.unitNumber || 'N/A'}</p>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px]"><MapPin size={12} className="text-gray-400"/> {complex?.location || 'No Location'}</div>
                                    <div className="flex items-center gap-2 text-[10px]"><UserCircle size={12} className="text-gray-400"/> <span className="font-medium text-gray-500">Landlord:</span> {landlordName}</div>
                                    <div className="flex justify-between text-[10px] pt-1">
                                        <span className="text-gray-400">Rent Cost:</span> <span className="font-bold">${totalRent.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-400">Balance:</span> <span className="font-black text-red-500">${currentBalance.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={onLogout} className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors">
                                    <LogOut size={12} /> Logout Session
                                </button>
                            </div>
                        </div>
                    )}
                </div>
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

            {/* Action Button */}
            <button
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-md
                    ${(hasUnitAccess && !isPaid) || !hasUnitAccess 
                        ? 'bg-white text-blue-600 hover:bg-blue-50 active:scale-[0.98]' 
                        : 'bg-white/20 text-white/60 cursor-not-allowed'}`}
                disabled={hasUnitAccess && isPaid}
                onClick={handleActionClick}
            >
                {!hasUnitAccess ? 'Enter Access Code' : isPaid ? 'Rent Fully Paid' : 'Pay Monthly Rent'}
            </button>

            <PaymentModal
                isOpen={paymentModalOpen}
                onClose={() => { setPaymentModalOpen(false); setSelectedBillForPayment(null); }}
                bills={selectedBillForPayment}
                onPaymentComplete={(transaction) => console.log('Rent Payment Processed')}
            />
        </div>
    )
}

export default VirtualCard