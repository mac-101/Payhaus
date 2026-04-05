import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyStore } from '../contexts/zustandFetch'
import PropertyCard from '../components/propertyCard'
import { AlertCircle, Loader } from 'lucide-react'

export default function Property() {
  const { uid, loading: authLoading } = useAuth()
  const { complexes, loading, error, fetchUserComplexes } = usePropertyStore()

  useEffect(() => {
    if (uid) {
      fetchUserComplexes(uid)
    }
  }, [uid, fetchUserComplexes])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size={24} className="text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!uid) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">Please log in to view your properties</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Properties</h1>
        <p className="text-gray-600">Manage all your rental properties and units</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader size={24} className="text-blue-600 animate-spin mr-2" />
          <span className="text-gray-600">Loading your properties...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 text-red-800 mb-6">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && complexes.length === 0 && (
        <div className="text-center p-8 bg-gray-50 border border-gray-200">
          <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Properties Yet</h3>
          <p className="text-gray-600">Create your first property complex to get started</p>
        </div>
      )}

      {/* Properties List */}
      {!loading && complexes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-4">
            Total: {complexes.length} complex{complexes.length !== 1 ? 'es' : ''} 
            ({complexes.reduce((sum, c) => sum + Object.keys(c.units || {}).length, 0)} units)
          </p>
          <div className="space-y-4">
            {complexes.map(complex => (
              <PropertyCard key={complex.id} complex={complex} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
