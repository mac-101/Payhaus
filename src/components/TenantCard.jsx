import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { ref, get } from 'firebase/database';
import { User, MapPin, Home, ArrowRight } from 'lucide-react';

export default function TenantCard({ tenantData }) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchFullDetails = async () => {
            // Fetch User Profile + Complex Name + Unit Name
            const [uSnap, cSnap] = await Promise.all([
                get(ref(db, `users/${tenantData.uid}`)),
                get(ref(db, `complexes/${tenantData.complexId}`))
            ]);

            if (uSnap.exists() && cSnap.exists()) {
                const complex = cSnap.val();
                setDetails({
                    user: uSnap.val(),
                    complexName: complex.name,
                    unitNumber: complex.units?.[tenantData.activeUnit]?.unitNumber || 'N/A'
                });
            }
        };
        fetchFullDetails();
    }, [tenantData]);

    if (!details) return <div className="h-48 animate-pulse bg-gray-100 rounded-xl" />;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group relative flex flex-col h-full">
    {/* TOP SECTION: Profile & Name */}
    <div className="grid grid-cols-2 gap-4 items-center mb-6">
        {/* Top Left: Profile Pic */}
        <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-sm">
                <img
                    src={details.user.photoURL || `https://ui-avatars.com/api/?name=${details.user.fullName}`}
                    alt="tenant"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Online status indicator for extra flair */}
            <div className="absolute bottom-0 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Top Right: Name & Status */}
        <div className="text-left">
            <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 truncate">
                {details.user.fullName}
            </h3>
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                Active
            </span>
        </div>
    </div>

    {/* MIDDLE SECTION: Info Grid (The 4-corner feel) */}
    <div className="w-full grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden mb-4">
        {/* Bottom Left: Complex */}
        <div className="bg-white p-3 flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 text-blue-500">
                <MapPin size={14} />
                <span className="text-[10px] font-semibold uppercase text-gray-400">Complex</span>
            </div>
            <span className="text-xs text-gray-700 font-medium truncate w-full">
                {details.complexName}
            </span>
        </div>

        {/* Bottom Right: Unit */}
        <div className="bg-white p-3 flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 text-green-500">
                <Home size={14} />
                <span className="text-[10px] font-semibold uppercase text-gray-400">Unit</span>
            </div>
            <span className="text-xs text-gray-700 font-medium">
                #{details.unitNumber}
            </span>
        </div>
    </div>

    {/* BOTTOM SECTION: Action Button */}
    <div className="mt-auto">
        <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all shadow-sm">
            View Profile <ArrowRight size={14} />
        </button>
    </div>
</div>
    );
}