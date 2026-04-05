import React, { useState } from 'react'
import { X, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { usePropertyStore } from '../contexts/zustandFetch'

export default function EditUnitBilling({ isOpen, onClose, complexId, unitId, unit }) {
  const [newAmount, setNewAmount] = useState(unit?.monthlyRent?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { updateUnitBilling } = usePropertyStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newAmount || parseFloat(newAmount) <= 0) {
      setError('Please enter a valid billing amount')
      return
    }

    setLoading(true)

    try {
      await updateUnitBilling(complexId, unitId, newAmount)
      setSuccess('Billing updated successfully!')

      setTimeout(() => {
        setNewAmount('')
        setSuccess('')
        onClose()
      }, 1500)
    } catch (err) {
      setError(`Failed to update billing: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Edit Unit Billing</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Unit: {unit?.name}</p>
              <label htmlFor="newAmount" className="block text-sm font-semibold text-gray-900 mb-2">
                New Billing Amount
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  id="newAmount"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-300 text-red-800">
                <AlertCircle size={18} className="shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-300 text-green-800">
                <CheckCircle size={18} className="shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
