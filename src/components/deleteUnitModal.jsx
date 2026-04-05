import React, { useState } from 'react'
import { X, AlertCircle, CheckCircle, Trash2 } from 'lucide-react'
import { usePropertyStore } from '../contexts/zustandFetch'

export default function DeleteUnitModal({ isOpen, onClose, complexId, unitId, unit }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { deleteUnit } = usePropertyStore()

  const handleDelete = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await deleteUnit(complexId, unitId)
      setSuccess('Unit deleted successfully!')

      setTimeout(() => {
        setSuccess('')
        onClose()
      }, 1500)
    } catch (err) {
      setError(`Failed to delete unit: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-300 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Trash2 size={24} className="text-red-600" />
            <h2 className="text-xl font-semibold text-red-900">Delete Unit</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-red-400 hover:text-red-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 flex items-start gap-3">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold mb-1">Warning</p>
              <p className="text-sm">This action cannot be undone. All data for this unit will be permanently deleted.</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{unit?.name}</span>?
          </p>

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
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 border border-red-700 hover:bg-red-700 disabled:bg-red-400"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
