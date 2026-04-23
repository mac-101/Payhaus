import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { ref, get } from 'firebase/database';
import { User, MapPin, Home, ArrowRight, X, Phone, Mail, Calendar, Hash, AlertCircle, MessageCircle } from 'lucide-react';

export default function TenantCard({ tenantData }) {
    const [details, setDetails] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchFullDetails = async () => {
            const [uSnap, cSnap] = await Promise.all([
                get(ref(db, `users/${tenantData.uid}`)),
                get(ref(db, `complexes/${tenantData.complexId}`))
            ]);

            if (uSnap.exists() && cSnap.exists()) {
                const complex = cSnap.val();
                const unit = complex.units?.[tenantData.activeUnit];

                setDetails({
                    user: uSnap.val(),
                    complexName: complex.name,
                    unitNumber: unit?.unitNumber || 'N/A',
                    rent: unit?.monthlyRent || 0,
                    balance: unit?.rentBalance || 0,
                    billingTime: unit?.billingTime, // Timestamp from when they entered
                    billingDuration: unit?.billingDuration || 'Monthly' // Monthly, Quarterly, etc.
                });
            }
        };
        fetchFullDetails();
    }, [tenantData]);

    // --- Logic for Overdue Alert ---
    const checkIsDue = () => {
        if (!details?.billingTime || !details?.balance || details.balance <= 0) return false;

        const startTime = details.billingTime;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        let durationDays = 30; // Default 30 days for Monthly
        const durationText = details.billingDuration.toLowerCase();

        if (durationText.includes('quarterly')) durationDays = 90;
        else if (durationText.includes('semi')) durationDays = 182;
        else if (durationText.includes('annual') || durationText.includes('anual')) durationDays = 365;

        // Returns true if current time has passed the billing start time + the cycle period
        return now > (startTime + (durationDays * oneDay));
    };

    const isDue = checkIsDue();

    if (!details) return <div className="h-48 animate-pulse bg-gray-50 rounded-xl" />;

    const handleWhatsApp = (e) => {
        e.stopPropagation();

        // 1. Get the phone from details
        const rawPhone = details.user.phone || "";

        // 2. Remove +, spaces, and dashes (WhatsApp wa.me needs digits only)
        const cleanPhone = rawPhone.replace(/\D/g, '');

        // 3. Create the message
        const msg = `Hi ${details.user.fullName}, this is a reminder for your rent at ${details.complexName} (Unit ${details.unitNumber}). Current balance: ₦${Number(details.balance).toLocaleString()}.`;

        // 4. Open the link
        if (cleanPhone) {
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
        } else {
            alert("No phone number available for this tenant.");
        }
    };

    return (
        <>
            {/* --- PRIMARY CARD --- */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 hover:border-blue-400 hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer relative"
                onClick={() => setIsExpanded(true)}>

                {/* Alert Icon if Rent is Due */}
                {isDue && (
                    <div className="absolute top-4 right-4 text-red-500 animate-pulse z-10">
                        <AlertCircle size={22} />
                    </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500 p-0.5">
                            <img
                                src={details.user.photoURL || `https://ui-avatars.com/api/?name=${details.user.fullName}`}
                                alt="tenant"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                            {details.user.fullName}
                        </h3>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Tenant</span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Complex</span>
                        <span className="text-xs text-gray-700 font-bold truncate block">{details.complexName}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Unit</span>
                        <span className="text-xs text-gray-700 font-bold block">#{details.unitNumber}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={handleWhatsApp}
                        className="flex-1 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors uppercase tracking-tighter"
                    >
                        <MessageCircle size={14} /> WhatsApp
                    </button>
                    <button className="flex-1 py-2 bg-gray-900 text-white text-[10px] font-black rounded-lg flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors uppercase tracking-tighter">
                        PROFILE <ArrowRight size={12} />
                    </button>
                </div>
            </div>

            {/* --- EXPANDED MODAL --- */}
            {isExpanded && (
                <div className="fixed inset-0 overflow-auto z-50 flex items-center justify-center pt-10  bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">

                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                        >
                            <X size={18} className="text-gray-600" />
                        </button>

                        <div className={`h-24 w-full ${isDue ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`} />

                        <div className="px-6 pb-8">
                            <div className="relative -mt-12 mb-4">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                                    <img
                                        src={details.user.photoURL || `https://ui-avatars.com/api/?name=${details.user.fullName}`}
                                        alt="tenant"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-1">
                                <h2 className="text-2xl font-black text-gray-900">{details.user.fullName}</h2>
                                {isDue && (
                                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                                        Payment Due
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm mb-6 uppercase font-bold tracking-tighter">Verified Tenant Account</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Mail size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-700 truncate">{details.user.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50" onClick={handleWhatsApp}>
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                                        <p className="text-sm font-semibold text-gray-700">{details.user.phone || 'No phone recorded'}</p>
                                    </div>
                                    <MessageCircle size={14} className="ml-auto text-green-500" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 border border-gray-100 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Complex</p>
                                        <p className="text-sm font-bold text-gray-800">{details.complexName}</p>
                                    </div>
                                    <div className="p-3 border border-gray-100 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Unit ID</p>
                                        <p className="text-sm font-bold text-gray-800">#{details.unitNumber}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 border border-gray-100 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Monthly Rent</p>
                                        <p className="text-sm font-bold text-gray-800">₦{Number(details.rent).toLocaleString()}</p>
                                    </div>
                                    <div className={`p-3 border rounded-xl ${isDue ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rent Balance</p>
                                        <p className={`text-sm font-bold ${isDue ? 'text-red-600' : 'text-gray-800'}`}>₦{Number(details.balance).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Billing Cycle</p>
                                    <p className="text-xs font-bold text-gray-700">Started on {details.billingTime ? new Date(details.billingTime).toLocaleDateString() : 'N/A'} ({details.billingDuration})</p>
                                </div>
                            </div>

                            <button
                                onClick={handleWhatsApp}
                                className="w-full mt-6 py-4 bg-green-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} /> Send Payment Reminder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}