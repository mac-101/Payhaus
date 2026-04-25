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

  // 1. PUBLIC ROUTES (Always accessible, no loader)
  if (window.location.pathname === "/auth") return <PayhausAuth />;
  if (window.location.pathname === "/landing") return <Landing />;

  // 2. LOADING STATE (Only for the dashboard)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={24} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  // 3. MAIN ROUTING
  return (
    <Routes>
      <Route element={<AppRoutes />}>
        {role === 'tenant' ? (
          <>
            <Route path="/" element={<TenantHome />} />
            <Route path="/bills" element={<TenantBillsPage />} />
            <Route path="/transactions" element={<TenantTransactionsPage />} />
          </>
        ) : (
          /* Landlord Routes */
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="property" element={<Property />} />
            <Route path="people" element={<TenantPage />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<LandlordAccountPage />} />
          </Route>
        )}
      </Route>

      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
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