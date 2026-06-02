import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Auth
import LoginPage from './pages/LoginPage'

// Admin layout + pages
import AdminLayout       from './components/layout/AdminLayout'
import AdminDashboard    from './pages/admin/DashboardPage'
import AdminTurnos       from './pages/admin/TurnosPage'
import AdminCalendario   from './pages/admin/CalendarioPage'
import AdminPacientes    from './pages/admin/PacientesPage'
import AdminPacienteDetail from './pages/admin/PacienteDetailPage'

function RequireAuth({ role, children }) {
  const { user, role: userRole } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && userRole !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user, role } = useAuth()

  if (user) {
    const home = '/admin'
    return (
      <Routes>
        <Route path="/login" element={<Navigate to={home} replace />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
          <Route index         element={<AdminDashboard />} />
          <Route path="turnos"    element={<AdminTurnos />} />
          <Route path="calendario" element={<AdminCalendario />} />
          <Route path="pacientes"  element={<AdminPacientes />} />
          <Route path="pacientes/:id" element={<AdminPacienteDetail />} />
        </Route>

        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*"      element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
