import React, { useState } from 'react'
import { X, Home, DollarSign, Tag, AlertCircle, CheckCircle, Building2, Clock, Percent } from 'lucide-react'
import { db } from '../../firebase.config'
import { ref, set, push, serverTimestamp } from 'firebase/database'
import { useAuth } from '../contexts/AuthContext'

export default function AddProperty({ isOpen, onClose }) {
  const { uid } = useAuth()
  const [formData, setFormData] = useState({
    complexName: '',
    unitsInComplex: '',
    unitType: '',
    billing: '',
    duration: '',
    installment: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const unitTypes = [
    'Studio',
    '1 Bedroom',
    '2 Bedroom',
    '3 Bedroom',
    '4 Bedroom',
    'Apartment',
    'Townhouse',
    'Condo'
  ]

  const billingDurations = [
    'Monthly',
    'Quarterly',
    'Semi-Annual',
    'Annual'
  ]

  const installmentOptions = [
    1,
    2,
    3,
    6,
    12
  ] 

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.complexName.trim()) {
      setError('Complex name is required')
      return false
    }
    if (!formData.unitsInComplex) {
      setError('Number of units is required')
      return false
    }
    if (parseInt(formData.unitsInComplex) <= 0) {
      setError('Number of units must be greater than 0')
      return false
    }
    if (!formData.unitType) {
      setError('Unit type is required')
      return false
    }
    if (!formData.billing) {
      setError('Billing amount is required')
      return false
    }
    if (parseFloat(formData.billing) <= 0) {
      setError('Billing amount must be a positive amount')
      return false
    }
    if (!formData.duration) {
      setError('Billing duration is required')
      return false
    }
    if (!formData.installment) {
      setError('Payment plan is required')
      return false
    }
    return true
  }

  const generateAccessCode = () => {
    // Generate format: COMPLEX-UNIT-XXXX
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Generate unique complex ID
      const complexId = push(ref(db, 'complexes')).key
      
      // Create complex data structure
      const complexData = {
        id: complexId,
        name: formData.complexName,
        billingDuration: formData.duration,
        installmentPlan: formData.installment,
        landlordUID: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        units: {}
      }

      const numUnits = parseInt(formData.unitsInComplex)

      // Create units for this complex
      for (let i = 1; i <= numUnits; i++) {
        const unitId = `unit_${i.toString().padStart(3, '0')}`
        const accessCode = `${formData.complexName.substring(0, 3).toUpperCase()}-${i}-${generateAccessCode()}`
        
        complexData.units[unitId] = {
          name: `Unit ${i}`,
          unitNumber: i,
          unitType: formData.unitType,
          monthlyRent: parseFloat(formData.billing),
          rentBalance: parseFloat(formData.billing),  
          billingDuration: formData.duration,
          installmentPlan: formData.installment,
          currentTenantUID: null,
          currentAccessCodeId: accessCode,
          accessCode: accessCode,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          tenancies: {}
        }

        // Store access code mapping for this unit
        await set(ref(db, `accessCodes/${accessCode}`), {
          landlordUID: uid,
          complexId: complexId,
          unitId: unitId,
        })
      }

      // Save complex to main complexes collection
      await set(ref(db, `complexes/${complexId}`), complexData)
      
      // Add reference in user's complexes
      await set(ref(db, `users/${uid}/complexes/${complexId}`), true)
      
      setSuccess('Property complex added successfully!')
      setError('')
      
      setTimeout(() => {
        setFormData({
          complexName: '',
          unitsInComplex: '',
          unitType: '',
          billing: '',
          duration: '',
          installment: ''
        })
        setSuccess('')
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Error adding property:', err)
      setError(`Failed to add property: ${err.message}`)
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        complexName: '',
        unitsInComplex: '',
        unitType: '',
        billing: '',
        duration: '',
        installment: ''
      })
      setError('')
      setSuccess('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-lg my-8">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-semibold text-gray-900">Add Property Complex</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Complex Name - Full Width */}
            <div>
              <label htmlFor="complexName" className="block text-sm font-semibold text-gray-900 mb-2">
                Complex Name
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  id="complexName"
                  name="complexName"
                  value={formData.complexName}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown Complex"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Units in Complex */}
              <div>
                <label htmlFor="unitsInComplex" className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Units
                </label>
                <div className="relative">
                  <Tag size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    id="unitsInComplex"
                    name="unitsInComplex"
                    value={formData.unitsInComplex}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    min="1"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Unit Type */}
              <div>
                <label htmlFor="unitType" className="block text-sm font-semibold text-gray-900 mb-2">
                  Unit Type
                </label>
                <select
                  id="unitType"
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleSelectChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select a unit type</option>
                  {unitTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Billing Amount */}
              <div>
                <label htmlFor="billing" className="block text-sm font-semibold text-gray-900 mb-2">
                  Billing Amount
                </label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    id="billing"
                    name="billing"
                    value={formData.billing}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Billing Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-gray-900 mb-2">
                  Billing Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleSelectChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select billing duration</option>
                  {billingDurations.map(duration => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Plan - Full Width */}
            <div>
              <label htmlFor="installment" className="block text-sm font-semibold text-gray-900 mb-2">
                Payment Plan
              </label>
              <select
                id="installment"
                name="installment"
                value={formData.installment}
                onChange={handleSelectChange}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Select payment plan</option>
                {installmentOptions.map(option => (
                  <option key={option} value={option}>
                    {option} {option === 1 ? 'Installment' : 'Installments'}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 text-red-800">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-300 text-green-800">
                <CheckCircle size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500 transition-colors disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 disabled:bg-blue-400 disabled:border-blue-500 transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}