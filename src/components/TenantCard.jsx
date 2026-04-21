import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { ref, get } from 'firebase/database';
import { User, MapPin, Home, ArrowRight, X, Phone, Mail, Calendar, Hash } from 'lucide-react';

export default function TenantCard({ tenantData }) {
    const [details, setDetails] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false); // State for the expanded view

    useEffect(() => {
        const fetchFullDetails = async () => {
            const [uSnap, cSnap] = await Promise.all([
                get(ref(db, `users/${tenantData.uid}`)),
                get(ref(db, `complexes/${tenantData.complexId}`))
            ]);

            if (uSnap.exists() && cSnap.exists()) {
                const complex = cSnap.val();
                setDetails({
                    user: uSnap.val(),
                    complexName: complex.name,
                    unitNumber: complex.units?.[tenantData.activeUnit]?.unitNumber || 'N/A',
                    rent: complex.units?.[tenantData.activeUnit]?.monthlyRent || 'N/A',
                    balance: complex.units?.[tenantData.activeUnit]?.rentBalance || 'N/A'

                });
            }
        };
        fetchFullDetails();
    }, [tenantData]);

    if (!details) return <div className="h-48 animate-pulse bg-gray-50 rounded-xl" />;

    return (
        <>
            {/* --- PRIMARY CARD --- */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 hover:border-blue-400 hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer" 
                 onClick={() => setIsExpanded(true)}>
                
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

                <button className="mt-auto w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors">
                    PROFILE <ArrowRight size={12} />
                </button>
            </div>

            {/* --- EXPANDED MODAL (The Overlay) --- */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
                        
                        {/* Close Button */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                        >
                            <X size={18} className="text-gray-600" />
                        </button>

                        {/* Modal Header/Cover */}
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 w-full" />
                        
                        <div className="px-6 pb-8">
                            {/* Profile Pic overlap */}
                            <div className="relative -mt-12 mb-4">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                                    <img
                                        src={details.user.photoURL || `https://ui-avatars.com/api/?name=${details.user.fullName}`}
                                        alt="tenant"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900">{details.user.fullName}</h2>
                            <p className="text-gray-500 text-sm mb-6 uppercase font-bold tracking-tighter">Verified Tenant Account</p>

                            {/* Detailed Info List */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-700">{details.user.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                                        <p className="text-sm font-semibold text-gray-700">{details.user.phone || 'No phone recorded'}</p>
                                    </div>
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
                                        <p className="text-sm font-bold text-gray-800">NGN {details.rent}</p>
                                    </div>
                                    <div className="p-3 border border-gray-100 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rent Balnce</p>
                                        <p className="text-sm font-bold text-gray-800">NGN {details.balance}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsExpanded(false)}
                                className="w-full mt-8 py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-black transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}