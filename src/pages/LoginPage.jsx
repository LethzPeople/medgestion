import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    try { await login(email, password, 'admin') }
    catch { setError('Email o contraseña incorrectos.') }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-margin-mobile relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-surface-container-high rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="mb-xl text-center">
          <div className="flex items-center justify-center mb-md">
            <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-on-primary-container" style={{fontSize: '2rem', fontVariationSettings:"'FILL' 1"}}>medical_services</span>
            </div>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-tight">MedGestión</h1>
          <p className="text-body-sm text-on-surface-variant mt-xs">Sistema de Gestión Médica Integral</p>
        </div>



        {/* Card */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-lg md:p-xl"
             style={{backdropFilter:'blur(10px)'}}>
          <div className="mb-lg">
            <h2 className="text-title-lg font-title-lg text-on-surface">Bienvenido</h2>
            <p className="text-body-sm text-on-surface-variant">Ingrese sus credenciales para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Usuario o Correo Electrónico</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" style={{fontSize:'20px'}}>person</span>
                <input
                  type="email" className="input pl-[44px]"
                  placeholder="nombre@ejemplo.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>
            </div>

            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Contraseña</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" style={{fontSize:'20px'}}>lock</span>
                <input
                  type={showPw ? 'text' : 'password'} className="input pl-[44px] pr-[44px]"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{fontSize:'20px'}}>{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-xs cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant accent-primary" />
                <span className="text-label-sm text-on-surface-variant">Recordarme</span>
              </label>
              <a href="#" className="text-label-sm text-primary hover:underline font-semibold">¿Olvidó su contraseña?</a>
            </div>

            {error && (
              <p className="text-body-sm text-on-error-container bg-error-container border border-error/20 rounded-lg px-md py-sm">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Acceder al Sistema'}
            </button>
          </form>

          <div className="mt-lg pt-lg border-t border-outline-variant flex flex-col items-center gap-base">
            <p className="text-body-sm text-on-surface-variant">¿Necesita soporte técnico?</p>
            <button className="flex items-center gap-xs text-primary text-label-sm hover:bg-secondary-container px-md py-xs rounded-full transition-colors">
              <span className="material-symbols-outlined" style={{fontSize:'16px'}}>help_outline</span>
              Centro de Ayuda
            </button>
          </div>
        </div>

        <footer className="mt-xl text-center">
          <p className="text-label-sm text-outline">© 2024 MedGestión Systems. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-md mt-sm">
            <a href="#" className="text-label-sm text-on-surface-variant hover:text-primary">Privacidad</a>
            <span className="text-outline-variant">•</span>
            <a href="#" className="text-label-sm text-on-surface-variant hover:text-primary">Términos</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
