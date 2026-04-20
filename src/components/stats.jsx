import React, { useEffect } from 'react'
import { Building2, Users, DollarSign, AlertCircle, Loader2, Home, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyStore } from '../contexts/zustandFetch'

export default function Stats() {
    const { uid } = useAuth()
    const { complexes, loading, fetchUserComplexes } = usePropertyStore()

    useEffect(() => {
        if (uid && complexes.length === 0) {
            fetchUserComplexes(uid)
        }
    }, [uid, complexes.length, fetchUserComplexes])

    const totalComplexes = complexes.length

    const allUnits = complexes.flatMap(complex => Object.values(complex.units || {}));

    const totalUnits = allUnits.length
    const occupiedUnits = allUnits.filter(unit => unit?.currentTenantUID).length
    const vacantUnits = totalUnits - occupiedUnits

    const rentalIncome = allUnits.reduce((sum, unit) => sum + (parseFloat(unit.monthlyRent) || 0), 0)
    const pendingPayment = allUnits.reduce((sum, unit) => sum + (parseFloat(unit.rentBalance) || 0), 0)
    const rentPaid = allUnits.reduce((sum, unit) => {
        const total = parseFloat(unit.monthlyRent) || 0;
        const balance = parseFloat(unit.rentBalance) || 0;
        return sum + Math.max(0, total - balance);
    }, 0)

    const stats = [
        {
            label: 'Total Complexes',
            value: totalComplexes,
            description: 'Properties owned',
            Icon: Building2,
            color: 'blue',
        },
        {
            label: 'Total Units',
            value: totalUnits,
            description: 'Across all complexes',
            Icon: Home,
            color: 'blue',
        },
        {
            label: 'Occupied',
            value: occupiedUnits,
            description: 'Currently rented',
            Icon: CheckCircle2,
            color: 'green',
        },
        {
            label: 'Vacant',
            value: vacantUnits,
            description: 'Available units',
            Icon: XCircle,
            color: 'orange',
        },
        {
            label: 'Total Income',
            value: `$${rentalIncome.toLocaleString()}`,
            description: 'Potential monthly',
            Icon: DollarSign,
            color: 'emerald',
        },
        {
            label: 'Rent Paid',
            value: `$${rentPaid.toLocaleString()}`,
            description: 'Collected this month',
            Icon: DollarSign,
            color: 'green',
        },
        {
            label: 'Unpaid Rent',
            value: `$${pendingPayment.toLocaleString()}`,
            description: 'Total outstanding',
            Icon: AlertCircle,
            color: 'orange',
        },
    ]

    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
    }

    if (loading && complexes.length === 0) {
        return (
            <div className="w-full flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600" size={28} />
            </div>
        )
    }

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={`bg-white border ${colorMap[item.color]} p-6 hover:shadow-md transition-shadow rounded-2xl`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600">{item.label}</h3>
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                            <item.Icon size={24} className="text-current" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                    </div>
                )
            })}
        </div>
    )
}
