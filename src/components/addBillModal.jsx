import React, { useState } from 'react'
import { X, FileText, DollarSign, AlertCircle, CheckCircle } from 'lucide-react'
import { usePropertyStore } from '../contexts/zustandFetch'
// --- IMPORT FIREBASE REFS ---
import { ref, push, update, increment } from 'firebase/database'
import { db } from '../../firebase.config' // Adjust this path to your firebase config file

export default function AddBillModal({ isOpen, onClose, complexId, complexName }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    dueDate: '',
    category: 'Maintenance'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { complexes } = usePropertyStore()

  const billCategories = [
    'Maintenance', 'Utilities', 'Insurance', 'Property Tax',
    'Security', 'Cleaning', 'Repairs', 'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 1. Find the specific complex to get its units
    const currentComplex = complexes.find(c => c.id === complexId)
    const unitsObj = currentComplex?.units || {}
    const unitIds = Object.keys(unitsObj)
    const totalNewDebt = parseFloat(formData.amount) * unitIds.length;

    if (unitIds.length === 0) {
      setError('No units found in this complex to bill.')
      return
    }

    if (!formData.description.trim() || !formData.amount || !formData.dueDate) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)

    try {
      const billAmount = parseFloat(formData.amount);
      const unitIds = Object.keys(unitsObj);
      const totalAmountForComplex = billAmount * unitIds.length;

      // Generate ONE key to rule them all (this links the units to the stat)
      const commonBillId = push(ref(db, `complexes/${complexId}/stats`)).key;

      const updates = {};

      // 1. Distribute to Units using the SAME ID
      unitIds.forEach((unitId) => {
        updates[`complexes/${complexId}/units/${unitId}/bills/${commonBillId}`] = {
          description: formData.description,
          amount: billAmount,
          current: billAmount, // Starts as full amount
          dueDate: formData.dueDate,
          category: formData.category,
          paid: false,
          id: commonBillId // Use the common ID
        };
      });

      // 2. Create the Specific Stat Object
      updates[`complexes/${complexId}/stats/${commonBillId}`] = {
        description: formData.description,
        amount: billAmount,
        Total: totalAmountForComplex,
        totalPaid: 0,
        unpaid: totalAmountForComplex,
        lastUpdated: Date.now()
      };

      await update(ref(db), updates);

      setSuccess(`Bill successfully added to ${unitIds.length} units!`)

      setTimeout(() => {
        setFormData({
          description: '',
          amount: '',
          dueDate: '',
          category: 'Maintenance'
        })
        setSuccess('')
        onClose()
      }, 1500)

    } catch (err) {
      console.error('Error adding bills:', err)
      setError(err.message || 'Failed to add bills. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Bill</h2>
              <p className="text-xs text-gray-600">{complexName}</p>
            </div>
          </div>
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
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Monthly maintenance"
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-900 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
              >
                {billCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
                {loading ? 'Adding...' : 'Add Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}