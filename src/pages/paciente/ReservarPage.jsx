import { useState } from 'react'
import { useAuth }   from '../../hooks/useAuth'
import { useTurnos } from '../../hooks/useTurnos'
import { format, addDays, isSameDay, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'

const ESPECIALIDADES = [
  { id:'cardiologia', icon:'cardiology',       label:'Cardiología',      desc:'Corazón y sistema vascular' },
  { id:'pediatria',   icon:'child_care',       label:'Pediatría',        desc:'Atención de niños y adolescentes' },
  { id:'general',     icon:'medical_services', label:'Medicina General', desc:'Controles y consultas de rutina' },
  { id:'neurologia',  icon:'psychology',       label:'Neurología',       desc:'Cerebro y sistema nervioso' },
]

const HORARIOS_M = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30']
const HORARIOS_T = ['14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30']

export default function PacienteReservar() {
  const { user }     = useAuth()
  const { crear }    = useTurnos()
  const navigate     = useNavigate()

  const [step,      setStep]      = useState(1)
  const [espec,     setEspec]     = useState(null)
  const [fecha,     setFecha]     = useState(null)
  const [hora,      setHora]      = useState(null)
  const [motivo,    setMotivo]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // Generate next 14 days
  const dias = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1))

  async function confirmar() {
    if (!espec || !fecha || !hora) return
    setLoading(true); setError('')
    try {
      const fechaStr = format(fecha, 'yyyy-MM-dd')
      await crear({
        paciente: user.id,
        fecha:    fechaStr,
        hora:     hora,
        motivo:   `${espec.label}${motivo ? ' — ' + motivo : ''}`,
        estado:   'pendiente',
        duracion: 30,
      })
      navigate('/paciente/turnos')
    } catch (e) { 
      setError('Error al reservar. Intentá de nuevo.')
      console.error('Error:', e)
    }
    finally  { setLoading(false) }
  }

  const pct = step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="mb-lg">
        <div className="flex items-center justify-between mb-sm">
          <span className="text-label-sm text-primary uppercase tracking-wider">Paso {step} de 3</span>
          <span className="text-label-sm text-secondary">{step===1?'Especialidad':step===2?'Fecha y Hora':'Confirmación'}</span>
        </div>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div className={`h-full bg-primary transition-all duration-500 ${pct}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Left: steps */}
        <div className="lg:col-span-8 space-y-lg">
          {/* STEP 1: Especialidad */}
          {step === 1 && (
            <>
              <div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Reservar Turno</h1>
                <p className="text-body-md text-on-surface-variant">Seleccioná una especialidad para encontrar el profesional ideal.</p>
              </div>
              <div className="card p-md flex gap-md items-center">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" style={{fontSize:'18px'}}>search</span>
                  <input className="input pl-[44px]" placeholder="Buscar especialidad o médico..." />
                </div>
                <button className="btn-secondary gap-xs">
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>tune</span>
                  Filtros
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                {ESPECIALIDADES.map(e => (
                  <div key={e.id} onClick={() => setEspec(e)}
                    className={`card p-lg cursor-pointer transition-all hover:shadow-md group
                      ${espec?.id===e.id ? 'border-2 border-primary bg-surface shadow-md' : 'border border-outline-variant hover:border-primary'}`}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-md transition-transform group-hover:scale-110
                      ${espec?.id===e.id ? 'bg-primary' : 'bg-primary-container'}`}>
                      <span className="material-symbols-outlined" style={{fontSize:'22px', color: espec?.id===e.id ? 'white' : undefined}}>{e.icon}</span>
                    </div>
                    <h3 className="text-label-md font-semibold mb-xs">{e.label}</h3>
                    <p className="text-label-sm text-on-surface-variant">{e.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button className="btn-primary" disabled={!espec} onClick={() => setStep(2)}>
                  Siguiente
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 2: Fecha y Hora */}
          {step === 2 && (
            <>
              <div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Seleccioná Fecha y Hora</h1>
                <p className="text-body-md text-on-surface-variant">Especialidad: <strong>{espec?.label}</strong></p>
              </div>
              {/* Dates row */}
              <div className="card overflow-hidden">
                <div className="p-lg border-b border-outline-variant">
                  <h2 className="text-title-lg font-title-lg">Seleccionar Fecha</h2>
                </div>
                <div className="p-lg">
                  <div className="flex gap-sm overflow-x-auto pb-sm">
                    {dias.map(d => {
                      const sel = fecha && isSameDay(d, fecha)
                      return (
                        <button key={d.toISOString()} onClick={() => { setFecha(d); setHora(null) }}
                          className={`flex flex-col items-center px-md py-sm rounded-xl min-w-[64px] transition-all shrink-0
                            ${sel ? 'bg-primary text-on-primary shadow-md scale-105' : 'border border-outline-variant hover:bg-secondary-container'}`}>
                          <span className="text-label-sm capitalize">{format(d,'EEE',{locale:es})}</span>
                          <span className="text-title-lg font-bold">{format(d,'d')}</span>
                          <span className="text-label-sm">{format(d,'MMM',{locale:es})}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              {/* Horarios */}
              {fecha && (
                <div className="card p-lg space-y-lg">
                  <div>
                    <h2 className="text-title-lg font-title-lg">Horarios Disponibles</h2>
                    <p className="text-body-sm text-on-surface-variant capitalize">{format(fecha,"EEEE d 'de' MMMM",{locale:es})}</p>
                  </div>
                  {[['Mañana','light_mode',HORARIOS_M],['Tarde','wb_twilight',HORARIOS_T]].map(([label, icon, slots]) => (
                    <div key={label}>
                      <h3 className="text-label-md mb-md flex items-center gap-sm">
                        <span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>{icon}</span>
                        {label}
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-sm">
                        {slots.map(h => (
                          <button key={h} onClick={() => setHora(h)}
                            className={`py-sm border rounded-lg text-label-md transition-all
                              ${hora===h ? 'bg-secondary-container text-on-secondary-container border-2 border-primary font-bold' :
                                          'border-outline hover:bg-primary hover:text-on-primary'}`}>
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_back</span>
                  Volver
                </button>
                <button className="btn-primary" disabled={!fecha||!hora} onClick={() => setStep(3)}>
                  Siguiente
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Confirmación */}
          {step === 3 && (
            <>
              <div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Confirmar Turno</h1>
                <p className="text-body-md text-on-surface-variant">Revisá los detalles antes de confirmar.</p>
              </div>
              <div className="card p-lg space-y-md">
                {[
                  { icon:'stethoscope', label:'Especialidad', val: espec?.label },
                  { icon:'calendar_today', label:'Fecha', val: fecha ? format(fecha,"EEEE d 'de' MMMM yyyy",{locale:es}) : '' },
                  { icon:'schedule', label:'Hora', val: hora ? `${hora} hs` : '' },
                  { icon:'timer', label:'Duración', val: '30 min' },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-center gap-md py-sm border-b border-outline-variant last:border-0">
                    <span className="material-symbols-outlined text-primary" style={{fontSize:'20px'}}>{icon}</span>
                    <div className="flex-1">
                      <p className="text-label-sm text-on-surface-variant">{label}</p>
                      <p className="text-body-md font-semibold capitalize">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-lg">
                <label className="text-label-sm text-on-surface-variant mb-sm block">Motivo de consulta (opcional)</label>
                <textarea className="input resize-none" rows={3} placeholder="Describí brevemente tu consulta..." value={motivo} onChange={e => setMotivo(e.target.value)} />
              </div>
              <div className="card p-md bg-surface-container">
                <p className="text-label-sm text-on-surface-variant mb-xs">Información importante</p>
                <p className="text-body-sm">Favor llegar 10 minutos antes de su turno para el registro inicial.</p>
              </div>
              {error && <p className="text-body-sm text-on-error-container bg-error-container rounded-lg px-md py-sm">{error}</p>}
              <div className="flex justify-between">
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_back</span>
                  Volver
                </button>
                <button className="btn-primary" onClick={confirmar} disabled={loading}>
                  {loading ? 'Confirmando...' : 'Confirmar Turno'}
                  {!loading && <span className="material-symbols-outlined" style={{fontSize:'18px'}}>check_circle</span>}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: summary */}
        <aside className="lg:col-span-4">
          <div className="card p-lg sticky top-4">
            <h3 className="text-title-lg font-title-lg mb-lg">Resumen de Cita</h3>
            {espec ? (
              <div className="flex items-center gap-md mb-lg">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{fontSize:'24px'}}>{espec.icon}</span>
                </div>
                <div>
                  <p className="text-label-sm text-primary uppercase tracking-wider">Especialidad</p>
                  <h4 className="text-headline-md font-headline-md text-on-surface">{espec.label}</h4>
                </div>
              </div>
            ) : (
              <p className="text-body-sm text-on-surface-variant mb-lg">Completá los pasos para ver el resumen.</p>
            )}
            <div className="space-y-sm mb-xl">
              {[
                { label:'Fecha',    val: fecha ? format(fecha,"d MMM, yyyy",{locale:es}) : '—' },
                { label:'Hora',     val: hora  ? `${hora} hs` : '—' },
                { label:'Duración', val: '30 min' },
                { label:'Estado',   val: 'Pendiente' },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between py-sm border-b border-outline-variant">
                  <span className="text-label-md text-on-surface-variant">{label}</span>
                  <span className="text-label-md font-semibold text-on-surface capitalize">{val}</span>
                </div>
              ))}
            </div>
            {step === 3 && (
              <button className="btn-primary w-full" onClick={confirmar} disabled={loading}>
                {loading ? 'Confirmando...' : 'Confirmar Turno'}
                {!loading && <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>}
              </button>
            )}
            {step < 3 && (
              <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>Confirmar Turno</button>
            )}
            <button onClick={() => navigate('/paciente')} className="w-full mt-md text-primary text-label-md hover:underline flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined" style={{fontSize:'16px'}}>arrow_back</span>
              Volver al inicio
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
