import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import pb from '../../lib/pb'
import Modal from '../ui/Modal'

const NAV = [
  { to: '/admin',             label: 'Panel Principal',     icon: 'dashboard',      exact: true },
  { to: '/admin/calendario',  label: 'Calendario de Citas', icon: 'calendar_today' },
  { to: '/admin/pacientes',   label: 'Gestión de Pacientes',icon: 'group' },
  { to: '/admin/turnos',      label: 'Turnos',              icon: 'event_note' },
]

export default function AdminLayout() {
  const { user, userRole, logout } = useAuth()
  const rolLabel = userRole === 'odontologo' ? 'Odontólogo' : 'Secretaría'
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState(false)
  const [form, setForm]               = useState({ nombre: '', apellido: '' })
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  function abrirConfig() {
    setForm({ nombre: user?.nombre || '', apellido: user?.apellido || '' })
    setError('')
    setModalConfig(true)
  }

  async function guardarPerfil(e) {
    e.preventDefault()
    if (!form.nombre.trim()) { setError('El nombre es requerido.'); return }
    setSaving(true)
    try {
      await pb.collection('users').update(user.id, { nombre: form.nombre.trim(), apellido: form.apellido.trim() })
      await pb.collection('users').authRefresh()
      setModalConfig(false)
    } catch {
      setError('Error al guardar. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const cerrarSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={cerrarSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 shrink-0 bg-surface-container-low border-r border-outline-variant
        flex flex-col p-md gap-base
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between gap-md mb-xl px-md">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary" style={{fontSize:'20px'}}>medical_services</span>
            </div>
            <div>
              <h1 className="text-headline-md font-headline-md text-primary leading-tight">MedGestión</h1>
              <p className="text-body-sm text-secondary leading-none mt-0.5">Soporte Administrativo</p>
            </div>
          </div>
          {/* Cerrar sidebar en mobile */}
          <button onClick={cerrarSidebar} className="md:hidden p-1 rounded-lg hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant" style={{fontSize:'20px'}}>close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-xs">
          {NAV.map(({ to, label, icon, exact }) => (
            <NavLink key={to} to={to} end={exact}
              onClick={cerrarSidebar}
              className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}>
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-outline-variant pt-md flex flex-col gap-xs">
          <button className="nav-item" onClick={abrirConfig}>
            <span className="material-symbols-outlined" style={{fontSize:'20px'}}>settings</span>
            Configuración
          </button>
          <button onClick={() => { logout(); navigate('/login') }} className="nav-item">
            <span className="material-symbols-outlined" style={{fontSize:'20px'}}>logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* TopBar */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-margin-desktop bg-surface border-b border-outline-variant shadow-sm z-40">
          {/* Hamburger (solo mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-container-high transition-colors mr-sm"
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{fontSize:'22px'}}>menu</span>
          </button>

          {/* Título en mobile */}
          <span className="md:hidden text-title-md font-semibold text-primary">MedGestión</span>

          {/* Spacer desktop */}
          <div className="hidden md:flex flex-1" />

          {/* Usuario */}
          <div className="flex items-center gap-sm">
            <div className="text-right hidden sm:block">
              <p className="text-label-md font-semibold text-on-surface leading-none">
                {user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : user?.email}
              </p>
              <p className="text-label-sm text-secondary mt-0.5">{user?.especialidad || rolLabel}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-primary font-semibold text-label-md shrink-0">
              {(user?.nombre || user?.email || 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Modal configuración */}
      <Modal open={modalConfig} onClose={() => setModalConfig(false)} title="Configuración de perfil" size="sm">
        <form onSubmit={guardarPerfil} className="space-y-lg">
          <div className="flex items-center gap-md p-md bg-surface-container-low rounded-lg">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-title-md shrink-0">
              {(form.nombre || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-body-md font-semibold text-on-surface">{form.nombre || '—'} {form.apellido}</p>
              <p className="text-label-sm text-secondary">{rolLabel}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Nombre *</label>
              <input
                className="input"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Apellido</label>
              <input
                className="input"
                value={form.apellido}
                onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))}
                placeholder="Apellido"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="text-label-sm text-on-surface-variant">Email</label>
            <input className="input bg-surface-container-low" value={user?.email || ''} disabled />
          </div>

          {error && <p className="text-body-sm text-on-error-container bg-error-container rounded-lg px-md py-sm">{error}</p>}

          <div className="flex justify-end gap-sm pt-sm">
            <button type="button" className="btn-secondary" onClick={() => setModalConfig(false)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
