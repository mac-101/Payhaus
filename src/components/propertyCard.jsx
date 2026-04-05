import React from 'react'
import { Building2, DollarSign, Key, User, ChevronDown, ChevronUp, Edit2, Trash2, LogOut, FileText, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import EditUnitBilling from './editUnitBilling'
import DeleteUnitModal from './deleteUnitModal'
import EndTenancyModal from './endTenancyModal'
import AddBillModal from './addBillModal'

export default function PropertyCard({ complex }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [editBillingOpen, setEditBillingOpen] = useState(false)
  const [editBillingUnitId, setEditBillingUnitId] = useState(null)
  const [deleteUnitOpen, setDeleteUnitOpen] = useState(false)
  const [deleteUnitId, setDeleteUnitId] = useState(null)
  const [endTenancyOpen, setEndTenancyOpen] = useState(false)
  const [endTenancyUnitId, setEndTenancyUnitId] = useState(null)
  const [addBillOpen, setAddBillOpen] = useState(false)
  const [openUnitMenuId, setOpenUnitMenuId] = useState(null)
  
  const units = complex.units ? Object.entries(complex.units) : []
  const bills = complex.bills ? Object.entries(complex.bills) : []

  const handleEditBilling = (unitId) => {
    setEditBillingUnitId(unitId)
    setEditBillingOpen(true)
  }

  const handleDeleteUnit = (unitId) => {
    setDeleteUnitId(unitId)
    setDeleteUnitOpen(true)
  }

  const handleEndTenancy = (unitId) => {
    setEndTenancyUnitId(unitId)
    setEndTenancyOpen(true)
  }

  return (
    <div className="bg-white border border-gray-200 mb-4">
      {/* Complex Header */}
      <div 
        className="p-6 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <Building2 size={24} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{complex.name}</h3>
            <p className="text-sm text-gray-600">{units.length} units • {bills?.length || 0} bills</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {complex.billingDuration}
            </p>
            <p className="text-xs text-gray-500">{complex.installmentPlan}</p>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Units & Bills List */}
      {isExpanded && (
        <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {/* Bills Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                Bills
              </h4>
              <button
                onClick={() => setAddBillOpen(true)}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-medium"
              >
                + Add Bill
              </button>
            </div>
            
          </div>

          {/* Units Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Units ({units.length})</h4>
            {units.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No units yet</p>
            ) : (
              <div className="space-y-3">
                {units.map(([unitId, unit]) => (
                  <div
                    key={unitId}
                    className="relative bg-gray-50 border border-gray-300 p-3"
                  >
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="min-w-[150px]">
                        <p className="font-semibold text-gray-900 truncate">{unit.name}</p>
                        <p className="text-xs text-gray-500 truncate">{unit.unitType}</p>
                      </div>

                      <div className="flex-1 grid grid-cols-3 gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-2 truncate">
                          <DollarSign size={16} className="text-green-600" />
                          <span className="truncate">${unit.monthlyRent?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Key size={16} className="text-purple-600" />
                          <span className="truncate">{unit.accessCode || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${unit.currentTenantUID ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {unit.currentTenantUID ? 'Occupied' : 'Vacant'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenUnitMenuId(openUnitMenuId === unitId ? null : unitId)
                        }}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Open unit menu"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {openUnitMenuId === unitId && (
                      <div className="absolute right-3 top-full mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                        <button
                          onClick={() => {
                            handleEditBilling(unitId)
                            setOpenUnitMenuId(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 size={16} />
                          Edit Billing
                        </button>
                        {unit.currentTenantUID && (
                          <button
                            onClick={() => {
                              handleEndTenancy(unitId)
                              setOpenUnitMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            End Tenancy
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleDeleteUnit(unitId)
                            setOpenUnitMenuId(null)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete Unit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {editBillingUnitId && (
        <EditUnitBilling
          isOpen={editBillingOpen}
          onClose={() => {
            setEditBillingOpen(false)
            setEditBillingUnitId(null)
          }}
          complexId={complex.id}
          unitId={editBillingUnitId}
          unit={complex.units[editBillingUnitId]}
        />
      )}
      {deleteUnitId && (
        <DeleteUnitModal
          isOpen={deleteUnitOpen}
          onClose={() => {
            setDeleteUnitOpen(false)
            setDeleteUnitId(null)
          }}
          complexId={complex.id}
          unitId={deleteUnitId}
          unit={complex.units[deleteUnitId]}
        />
      )}
      {endTenancyUnitId && (
        <EndTenancyModal
          isOpen={endTenancyOpen}
          onClose={() => {
            setEndTenancyOpen(false)
            setEndTenancyUnitId(null)
          }}
          complexId={complex.id}
          unitId={endTenancyUnitId}
          unit={complex.units[endTenancyUnitId]}
        />
      )}
      <AddBillModal
        isOpen={addBillOpen}
        onClose={() => setAddBillOpen(false)}
        complexId={complex.id}
        complexName={complex.name}
      />
    </div>
  )
}
