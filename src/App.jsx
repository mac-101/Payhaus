import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Property from "./Pages/property.jsx"
import PayhausAuth from "./Pages/auth.jsx"
import AppLayout from "./components/appLayout.jsx"
import TenantHome from "./tenantPage/home.jsx"
import TenantBillsPage from "./tenantPage/TenantBillsPage.jsx"
import TenantPage from "./Pages/tenantPage.jsx"
import Landing from "./Pages/Tenant.jsx"
import { useAuth } from "./contexts/AuthContext.jsx"
import { Loader } from "lucide-react"
import Home from "./Pages/startingHome.jsx"
import AppRoutes from "./contexts//AppRoutes.jsx"
import { Navigate } from "react-router-dom"
import Transactions from "./Pages/transaction.jsx"
import TenantTransactionsPage from "./tenantPage/transaction.jsx"


function AppContent() {
  const { role, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={24} className="text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Accessible by everyone) */}
      <Route path="/auth" element={<PayhausAuth />} />
      <Route path="/landing" element={<Landing />} />

      {/* 2. PROTECTED ROUTES (Requires Login) */}
      <Route element={<AppRoutes />}>
        {role === 'tenant' ? (
          /* Tenant View */
          <>
            <Route path="/" element={<TenantHome />} />
            <Route path="/bills" element={<TenantBillsPage />} />
            <Route path="/transactions" element={<TenantTransactionsPage />} />
          </>
        ) : (
          /* Landlord View */
          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/property" element={<Property />} />
                <Route path="/people" element={<TenantPage />} />
                <Route path="/transactions" element={<Transactions />} />
              </Routes>
            </AppLayout>
          } />
        )}
      </Route>

      {/* 3. CATCH-ALL (Redirects unknown paths) */}
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App