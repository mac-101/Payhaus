import React, { useEffect, useState } from 'react'
import { FileText, AlertCircle, Loader, ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { useTenantStore } from '../contexts/tenantStore'
import { useNavigate } from 'react-router-dom'

export default function TenantBillsPage() {
  const navigate = useNavigate()
  const { allBills, hasUnitAccess, fetchAllBills, unit, complex, loading } = useTenantStore()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!hasUnitAccess) {
      navigate('/')
      return
    }

    const loadBills = async () => {
      setPageLoading(true)
      await fetchAllBills()
      setPageLoading(false)
    }

    loadBills()
  }, [hasUnitAccess, fetchAllBills, navigate])

  const getStatusIndicator = (bill) => {
    const isRent = bill.description?.toLowerCase().includes('rent') || 
                  bill.category?.toLowerCase() === 'rent'
    return isRent ? 'Rent' : bill.category || 'Bill'
  }

  if (!hasUnitAccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800">
            <AlertCircle size={18} />
            <span>Please enter your access code first.</span>
          </div>
        </div>
      </div>
    )
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Loader size={24} className="text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <FileText size={28} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Bills</h1>
              <p className="text-sm text-gray-600">{unit?.unitNumber ? `Unit ${unit.unitNumber}` : `${complex?.name || 'Your Unit'}`}</p>
            </div>
          </div>
        </div>

        {/* Bills List */}
        {allBills.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No bills found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allBills.map((bill) => {
              const isRent = bill.description?.toLowerCase().includes('rent') || 
                           bill.category?.toLowerCase() === 'rent'
              const amount = bill.amount || 0

              return (
                <div
                  key={bill.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isRent
                      ? 'bg-red-50 border-red-200 hover:border-red-300'
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{bill.description}</h3>
                        {isRent && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            PRIORITY
                          </span>
                        )}
                        {bill.paid && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
                            <CheckCircle size={12} />
                            Paid
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{bill.category || 'General'}</span>
                        {bill.dueDate && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              Due: {bill.dueDate}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-2xl font-bold ${isRent ? 'text-red-600' : 'text-gray-900'}`}>
                        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      {bill.paid ? (
                        <p className="text-xs text-green-600 font-medium">Paid</p>
                      ) : (
                        <p className="text-xs text-orange-600 font-medium">Pending</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Summary */}
        {allBills.length > 0 && (
          <div className="mt-8 bg-white p-4 rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bills:</span>
                <span className="font-semibold text-gray-900">{allBills.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">
                  ${allBills.reduce((sum, bill) => sum + (bill.amount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-orange-600">
                  ${allBills.filter((b) => !b.paid).reduce((sum, bill) => sum + (bill.amount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
