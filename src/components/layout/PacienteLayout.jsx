import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/paciente',          label: 'Home',             icon: 'home',            exact: true },
  { to: '/paciente/reservar', label: 'Reservar Turno',   icon: 'calendar_add_on' },
  { to: '/paciente/turnos',   label: 'Mis Turnos',       icon: 'history' },
]

export default function PacienteLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-surface-container-low border-r border-outline-variant flex-col p-md z-50">
        <div className="mb-xl px-4">
          <h1 className="text-headline-md font-headline-md font-black text-primary">MedGestión</h1>
          <div className="mt-lg flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-title-lg">
              {(user?.nombre || user?.email || 'P')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-label-md font-semibold text-on-surface leading-none">{user?.nombre} {user?.apellido}</p>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Portal del Paciente</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-xs">
          {NAV.map(({ to, label, icon, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}>
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>{icon}</span>
              {label}
            </NavLink>
          ))}
          <NavLink to="/paciente" className="nav-item">
            <span className="material-symbols-outlined" style={{fontSize:'20px'}}>person</span>
            Mi Perfil
          </NavLink>
        </nav>

        <div className="mt-auto">
          <div className="p-lg bg-primary rounded-xl text-on-primary">
            <p className="text-label-sm opacity-90 mb-sm">¿Necesitás atención urgente?</p>
            <NavLink to="/paciente/reservar"
              className="w-full block text-center bg-white text-primary font-label-md py-sm rounded-lg hover:opacity-90 transition-opacity">
              Reservar ahora
            </NavLink>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            className="nav-item mt-md w-full">
            <span className="material-symbols-outlined text-error" style={{fontSize:'20px'}}>logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-margin-mobile md:px-margin-desktop bg-surface border-b border-outline-variant shadow-sm z-40">
          <span className="text-headline-md font-headline-md font-bold text-primary md:hidden">MedGestión</span>
          <span className="text-title-lg text-primary hidden md:block">Panel del Paciente</span>
          <div className="flex items-center gap-md">
            <button className="p-2 text-secondary hover:bg-secondary-container rounded-full transition-colors">
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>notifications</span>
            </button>
            <button className="p-2 text-secondary hover:bg-secondary-container rounded-full transition-colors">
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>help_outline</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-semibold text-label-sm">
              {(user?.nombre || user?.email || 'P')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-2 bg-surface border-t border-outline-variant shadow-lg rounded-t-xl">
          {NAV.map(({ to, label, icon, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-4 py-1 rounded-2xl transition-all text-xs
                 ${isActive ? 'bg-primary-container text-on-primary-container scale-90' : 'text-on-surface-variant hover:text-primary'}`
              }>
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>{icon}</span>
              <span className="text-label-sm">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
