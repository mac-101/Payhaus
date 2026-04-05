import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Property from "./Pages/property"
import PayhausAuth from "./Pages/auth"
import AppLayout from "./components/appLayout"
import TenantHome from "./tenantPage/home"
import TenantBillsPage from "./tenantPage/TenantBillsPage"
import { useAuth } from "./contexts/AuthContext"
import { Loader } from "lucide-react"

function AppContent() {
  const { role, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={24} className="text-blue-600 animate-spin" />
      </div>
    )
  }

  if (role === 'tenant') {
    return (
      <Routes>
        <Route path="/" element={<TenantHome />} />
        <Route path="/bills" element={<TenantBillsPage />} />
        <Route path="/auth" element={<PayhausAuth />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={<PayhausAuth />} />
      <Route path="/*" element={
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property" element={<Property />} />
          </Routes>
        </AppLayout>
      } />
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