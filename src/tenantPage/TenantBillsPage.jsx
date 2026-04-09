import React, { useEffect, useState } from 'react'
import { FileText, Loader, ArrowLeft, Receipt, Check } from 'lucide-react'
import { useTenantStore } from '../contexts/tenantStore'
import { useNavigate } from 'react-router-dom'
import PaymentModal from '../tenantPageComponent/PaymentModal'

export default function TenantBillsPage() {
  const navigate = useNavigate()
  const { allBills, hasUnitAccess, fetchAllBills, unit } = useTenantStore()
  const [pageLoading, setPageLoading] = useState(true)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedBills, setSelectedBills] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    if (!hasUnitAccess) { navigate('/'); return; }
    const loadBills = async () => {
      setPageLoading(true)
      await fetchAllBills()
      setPageLoading(false)
    }
    loadBills()
  }, [hasUnitAccess, fetchAllBills, navigate])

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handlePaySelected = () => {
    const billsToPay = allBills.filter(b => selectedIds.includes(b.id))
    if (billsToPay.length > 0) {
      setSelectedBills(billsToPay)
      setPaymentModalOpen(true)
    }
  }

  const handlePayAll = () => {
    const unpaidBills = allBills.filter(b => (b.current ?? b.amount) > 0)
    if (unpaidBills.length > 0) {
      setSelectedBills(unpaidBills)
      setPaymentModalOpen(true)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size={32} className="text-blue-600 animate-spin" />
      </div>
    )
  }

  const totalBalance = allBills.reduce((sum, b) => sum + (b.current ?? b.amount ?? 0), 0)
  const selectedTotal = allBills
    .filter(b => selectedIds.includes(b.id))
    .reduce((sum, b) => sum + (b.current ?? b.amount ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-32 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto">

        {/* Nav */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </button>

        {/* Header Section */}
        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-md">
              <Receipt size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Statement</h1>
              <p className="text-xs text-gray-500 uppercase font-medium">
                {unit?.unitNumber ? `Unit ${unit.unitNumber}` : 'Resident Billing'}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-400 font-medium">Total Outstanding</p>
            <p className="text-xl font-bold text-gray-900">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Current Invoices'}
          </h2>
          <div className="flex gap-2">
            {totalBalance > 0 && selectedIds.length === 0 && (
              <button onClick={handlePayAll} className="text-xs px-3 py-1 font-bold uppercase text-gray-500 hover:text-green-600">
                Pay All
              </button>
            )}
            {selectedIds.length > 0 && (
              <button onClick={() => setSelectedIds([])} className="text-xs px-3 py-1 font-bold uppercase text-red-500">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Bills List */}
        <div className="space-y-3">
          {allBills.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-md border border-dashed border-gray-300">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 font-medium">No active charges found.</p>
            </div>
          ) : (
            allBills.map((bill) => {
              const displayAmount = bill.current ?? bill.amount ?? 0
              const isPaid = bill.paid || displayAmount <= 0
              const isSelected = selectedIds.includes(bill.id)

              return (
                <div
                  key={bill.id}
                  onClick={() => !isPaid && toggleSelection(bill.id)}
                  className={`relative p-4 rounded-md border transition-all cursor-pointer select-none ${
                    isPaid ? 'bg-gray-50 opacity-60' :
                    isSelected ? 'border-green-500 bg-green-50' : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {!isPaid && (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'
                      }`}>
                        {isSelected && <Check size={12} className="text-white stroke-[4]" />}
                      </div>
                    )}
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h3 className={`font-bold text-sm ${isPaid ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {bill.description}
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          {bill.category} • {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isPaid ? 'text-gray-400' : 'text-gray-900'}`}>
                          ${displayAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto z-40">
            <div className="bg-green-600 text-white p-4 rounded-md flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-green-100">Paying {selectedIds.length} items</p>
                <p className="text-lg font-bold">${selectedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <button 
                onClick={handlePaySelected}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md font-bold uppercase text-xs"
              >
                Complete Payment →
              </button>
            </div>
          </div>
        )}

      </div>

      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => { setPaymentModalOpen(false); setSelectedBills(null); setSelectedIds([]); }}
        bills={selectedBills}
        onPaymentComplete={() => fetchAllBills()}
      />
    </div>
  )
}