import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function AppRoutes() {
  const { user, loading } = useAuth();
  
  // Check if they have visited before for the landing page logic
  const hasVisited = localStorage.getItem('hasVisitedPayhaus');

  if (loading) return null;

//   1. If it's a first time visitor, send to landing (if you have one)
  if (!hasVisited) {
    localStorage.setItem('hasVisitedPayhaus', 'true');
    return <Navigate to="/landing" replace />;
  }

  // 2. If NOT logged in, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 3. If logged in, allow them to see the nested routes (the Outlet)
  return <Outlet />;
}