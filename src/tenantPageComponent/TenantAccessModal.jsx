import React, { useState } from 'react'
import { X, Key } from 'lucide-react'
import { useTenantStore } from '../contexts/tenantStore'
import { useAuth } from '../contexts/AuthContext'

export default function TenantAccessModal({ isOpen, onClose }) {
    const [code, setCode] = useState('')
    const { fetchUnitByAccessCode, loading, error } = useTenantStore()
    const { uid } = useAuth()

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await fetchUnitByAccessCode(code, uid)
        if (result.success) {
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Enter Access Code</h2>
                        <p className="text-sm text-gray-500">Paste your tenant access code to load your unit data.</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Access Code</label>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                        <Key size={18} className="text-blue-600" />
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="e.g. ABC-101-XYZ1"
                            className="w-full bg-transparent text-gray-900 outline-none"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {loading ? 'Checking code...' : 'Load unit'}
                    </button>
                </form>
            </div>
        </div>
    )
}
