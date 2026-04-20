import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenantDirectoryStore } from '../contexts/tenantDirectoryStore';
import TenantCard from '../components/TenantCard';
import { Loader2, Users } from 'lucide-react';

export default function TenantPage() {
  const { user } = useAuth();
  const { tenantList, loading, fetchLandlordTenants } = useTenantDirectoryStore();

  useEffect(() => {
    if (user?.uid) {
      fetchLandlordTenants(user.uid);
    }
  }, [user]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Directory</h1>
          <p className="text-sm text-gray-500">Manage {tenantList.length} active tenants across your properties</p>
        </div>
      </div>

      {tenantList.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed rounded-2xl py-20 text-center">
          <p className="text-gray-500">No tenants found. Share an access code to get started.</p>
        </div>
      ) : (
        /* The 5-Column Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {tenantList.map((tenant) => (
            <TenantCard key={tenant.uid} tenantData={tenant} />
          ))}
        </div>
      )}
    </div>
  );
}