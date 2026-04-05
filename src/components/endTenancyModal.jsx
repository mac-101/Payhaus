import React, { useState } from 'react'
import { X, AlertCircle, CheckCircle, Key } from 'lucide-react'
import { usePropertyStore } from '../contexts/zustandFetch'

export default function EndTenancyModal({ isOpen, onClose, complexId, unitId, unit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newAccessCode, setNewAccessCode] = useState('')
  const { endTenancy } = usePropertyStore()

  const handleEndTenancy = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await endTenancy(complexId, unitId)
      setNewAccessCode(result.newAccessCode)
      setSuccess('Tenancy ended successfully! New access code generated.')

      setTimeout(() => {
        setNewAccessCode('')
        setSuccess('')
        onClose()
      }, 2000)
    } catch (err) {
      setError(`Failed to end tenancy: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="bg-orange-50 border-b border-orange-300 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Key size={24} className="text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-900">End Tenancy</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-orange-400 hover:text-orange-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-800">
            <p className="text-sm font-semibold mb-1">What will happen:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Tenant UID will be cleared</li>
              <li>New access code will be generated</li>
              <li>Old access code will be deleted</li>
            </ul>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to end the tenancy for <span className="font-semibold">{unit?.name}</span>?
          </p>

          {newAccessCode && (
            <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-800">
              <p className="text-sm font-semibold mb-2">New Access Code:</p>
              <p className="text-lg font-mono font-bold text-green-900">{newAccessCode}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-300 text-red-800 mb-4">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-300 text-green-800 mb-4">
              <CheckCircle size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleEndTenancy}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 border border-orange-700 hover:bg-orange-700 disabled:bg-orange-400"
            >
              {loading ? 'Processing...' : 'End Tenancy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
