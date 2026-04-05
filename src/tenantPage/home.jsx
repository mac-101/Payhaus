import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTenantStore } from '../contexts/tenantStore'
import VirtualCard from '../tenantPageComponent/VirtualCard'
import ActionButtons from '../tenantPageComponent/ActionButtons'
import RecentBills from '../tenantPageComponent/RecentBills'
import TenantAccessModal from '../tenantPageComponent/TenantAccessModal'

function TenantHome() {
    const { fullName } = useAuth()
    const { hasUnitAccess, unit, complex, recentBill } = useTenantStore()
    const [isModalOpen, setIsModalOpen] = useState(!hasUnitAccess)

    useEffect(() => {
        if (!hasUnitAccess) {
            setIsModalOpen(true)
        }
    }, [hasUnitAccess])

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <TenantAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="max-w-md mx-auto space-y-6">
                <VirtualCard
                    fullName={fullName}
                    unit={unit}
                    complex={complex}
                    recentBill={recentBill}
                    hasUnitAccess={hasUnitAccess}
                />
                <ActionButtons />
                <RecentBills />
            </div>
        </div>
    )
}

export default TenantHome