import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Property from "./Pages/property.jsx"
import PayhausAuth from "./Pages/auth.jsx"
import AppLayout from "./components/appLayout.jsx"
import TenantHome from "./tenantPage/home.jsx"
import TenantBillsPage from "./tenantPage/TenantBillsPage.jsx"
import TenantPage from "./Pages/tenantPage.jsx"
import Landing from "./Pages/Tenant.jsx"
import LandlordAccountPage from "./Pages/setting.jsx"
import { useAuth } from "./contexts/AuthContext.jsx"
import { Loader } from "lucide-react"
import Home from "./Pages/startingHome.jsx"
import AppRoutes from "./contexts//AppRoutes.jsx"
import { Navigate } from "react-router-dom"
import Transactions from "./Pages/transaction.jsx"
import TenantTransactionsPage from "./tenantPage/transaction.jsx"


function AppContent() {
  const { role, loading, user } = useAuth();

  return (
    <Routes>
      {/* 1. PUBLIC ROUTES - These render immediately */}
      <Route path="/auth" element={<PayhausAuth />} />
      <Route path="/landing" element={<Landing />} />

      {/* 2. PROTECTED ROUTES */}
      <Route
        element={
          // Show loader only when trying to access protected content
          loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <Loader size={24} className="text-blue-600 animate-spin" />
            </div>
          ) : (
            <AppRoutes />
          )
        }
      >
        {role === 'tenant' ? (
          <>
            <Route path="/" element={<TenantHome />} />
            <Route path="/bills" element={<TenantBillsPage />} />
            <Route path="/transactions" element={<TenantTransactionsPage />} />
          </>
        ) : (
          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/property" element={<Property />} />
                <Route path="/people" element={<TenantPage />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/settings" element={<LandlordAccountPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          } />
        )}
      </Route>

      {/* 3. GLOBAL CATCH-ALL */}
      <Route 
        path="*" 
        element={loading ? null : <Navigate to={user ? "/" : "/auth"} replace />} 
      />
    </Routes>
  );
}






function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App