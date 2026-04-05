import React, { useEffect } from 'react'
import { Building2, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react'
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

    const totalProperties = complexes.length
    const totalTenants = complexes.reduce((count, complex) => {
        const units = complex.units || {}
        return count + Object.values(units).filter((unit) => unit?.currentTenantUID).length
    }, 0)
    const rentalIncome = complexes.reduce((sum, complex) => {
        const units = complex.units || {}
        return (
            sum + Object.values(units).reduce((unitSum, unit) => {
                return unitSum + (parseFloat(unit.monthlyRent) || 0)
            }, 0)
        )
    }, 0)
    const pendingPayment = complexes.reduce((sum, complex) => {
        const complexBills = complex.bills || {}
        return (
            sum + Object.values(complexBills).reduce((billSum, bill) => {
                if (!bill) return billSum
                const isPaid = bill.paid === true || bill.paid === 'true'
                return billSum + (isPaid ? 0 : (parseFloat(bill.amount) || 0))
            }, 0)
        )
    }, 0)

    const stats = [
        {
            label: 'Total Properties',
            value: totalProperties,
            description: 'Active complexes',
            Icon: Building2,
            color: 'blue',
        },
        {
            label: 'Total Tenants',
            value: totalTenants,
            description: 'Occupied units',
            Icon: Users,
            color: 'green',
        },
        {
            label: 'Rental Income',
            value: `$${rentalIncome.toLocaleString()}`,
            description: 'Monthly rent total',
            Icon: DollarSign,
            color: 'emerald',
        },
        {
            label: 'Pending Payment',
            value: `$${pendingPayment.toLocaleString()}`,
            description: 'Unpaid bills',
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
