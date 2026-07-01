import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import DashboardPage  from './pages/DashboardPage'
import ProgramsPage   from './pages/ProgramsPage'
import MyProgressPage from './pages/MyProgressPage'
import OrgPage        from './pages/OrgPage'
import EmployeesPage  from './pages/EmployeesPage'
import { Spinner }    from './components/shared/UI'

function ProtectedRoute({ children, managerOnly = false }) {
  const { user, loading, isManager } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner/></div>
  if (!user) return <Navigate to="/login" replace/>
  if (managerOnly && !isManager) return <Navigate to="/dashboard" replace/>
  return children
}

function RootRedirect() {
  const { user, loading, isManager } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><Spinner/></div>
  if (!user) return <Navigate to="/login" replace/>
  return <Navigate to={isManager ? '/org' : '/dashboard'} replace/>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect/>}/>
      <Route path="/login"    element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
      <Route path="/programs"    element={<ProtectedRoute><ProgramsPage/></ProtectedRoute>}/>
      <Route path="/my-progress" element={<ProtectedRoute><MyProgressPage/></ProtectedRoute>}/>
      <Route path="/org"         element={<ProtectedRoute managerOnly><OrgPage/></ProtectedRoute>}/>
      <Route path="/employees"   element={<ProtectedRoute managerOnly><EmployeesPage/></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  )
}
