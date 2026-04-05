import { Wrench, FileText, History } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ActionButtons() {
    const navigate = useNavigate()

    const actions = [
        { icon: Wrench, label: 'Request Maintenance', onClick: () => alert('Maintenance request coming soon'), color: 'bg-orange-500 hover:bg-orange-600' },
        { icon: FileText, label: 'Bills', onClick: () => navigate('/bills'), color: 'bg-blue-500 hover:bg-blue-600' },
        { icon: History, label: 'Transaction History', onClick: () => alert('Transaction history coming soon'), color: 'bg-green-500 hover:bg-green-600' },
    ]

    return (
        <div className="grid grid-cols-3 gap-4">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={action.onClick}
                    className={`flex flex-col items-center justify-center p-4 text-white rounded-lg transition-colors ${action.color}`}
                >
                    <action.icon size={24} className="mb-2" />
                    <span className="text-sm font-medium text-center">{action.label}</span>
                </button>
            ))}
        </div>
    )
}

export default ActionButtons