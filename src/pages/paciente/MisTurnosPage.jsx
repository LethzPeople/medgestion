import { useState, useEffect }  from 'react'
import { useAuth }   from '../../hooks/useAuth'
import { useTurnos } from '../../hooks/useTurnos'
import { format }    from 'date-fns'
import { es }        from 'date-fns/locale'
import { Badge }     from '../../components/ui/index'
import { Confirm }   from '../../components/ui/index'
import { NavLink }   from 'react-router-dom'

export default function MisTurnos() {
  const { user }   = useAuth()
  const { turnos, loading, cambiarEstado, refetch } = useTurnos({ pacienteId: user?.id })
  const [cancelando, setCancelando] = useState(null)

  useEffect(() => { if (user?.id) refetch() }, [user?.id, refetch])

  const proximos  = turnos.filter(t => new Date(t.fecha) >= new Date() && t.estado !== 'cancelado')
  const pasados   = turnos.filter(t => new Date(t.fecha) <  new Date() || t.estado === 'completado')
  const cancelados= turnos.filter(t => t.estado === 'cancelado')

  return (
    <div className="p-margin-mobile md:p-margin-desktop space-y-lg">
      {/* Header */}
      <div>
        <h3 className="text-headline-lg font-headline-lg text-on-surface">Tus Turnos</h3>
        <p className="text-body-md text-on-surface-variant">Administrá tus citas y revisá tu historial médico.</p>
      </div>

      {/* UPCOMING */}
      <section>
        <div className="flex items-center justify-between mb-md">
          <h4 className="text-title-lg font-title-lg text-primary flex items-center gap-sm">
            <span className="material-symbols-outlined" style={{fontSize:'20px'}}>event_upcoming</span>
            Próximos
          </h4>
          <span className="badge badge-confirmado">{proximos.length} programado{proximos.length!==1?'s':''}</span>
        </div>

        {loading ? (
          <div className="card p-xl text-center text-body-sm text-secondary">Cargando...</div>
        ) : proximos.length === 0 ? (
          <div className="card p-xl text-center">
            <div className="w-14 h-14 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-secondary" style={{fontSize:'26px'}}>event_available</span>
            </div>
            <p className="text-body-md text-on-surface-variant mb-md">No tenés turnos próximos.</p>
            <NavLink to="/paciente/reservar" className="btn-primary inline-flex mx-auto">
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
              Reservar turno
            </NavLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {proximos.map(t => (
              <div key={t.id} className="card p-lg flex flex-col gap-md hover:shadow-md transition-shadow relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" style={{fontSize:'22px'}}>stethoscope</span>
                    </div>
                    <div>
                      <p className="text-label-md font-semibold uppercase tracking-wide text-on-surface">{t.motivo || 'Consulta Médica'}</p>
                      <p className="text-body-sm text-on-surface-variant">Medicina General</p>
                    </div>
                  </div>
                  <Badge estado={t.estado} />
                </div>

                <div className="grid grid-cols-2 gap-md py-md border-y border-outline-variant/40">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>calendar_today</span>
                    <div>
                      <p className="text-label-sm text-secondary">Fecha</p>
                      <p className="text-body-md font-semibold capitalize">{format(new Date(t.fecha),"d MMM, yyyy",{locale:es})}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary" style={{fontSize:'18px'}}>schedule</span>
                    <div>
                      <p className="text-label-sm text-secondary">Hora</p>
                      <p className="text-body-md font-semibold">{format(new Date(t.fecha),'HH:mm')} hs</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-md">
                  <NavLink to="/paciente/reservar" className="btn-primary flex-1 py-sm text-label-md">Reagendar</NavLink>
                  <button onClick={() => setCancelando(t)} className="btn-secondary flex-1 py-sm text-label-md">Cancelar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAST */}
      {pasados.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-md">
            <h4 className="text-title-lg font-title-lg text-secondary flex items-center gap-sm">
              <span className="material-symbols-outlined" style={{fontSize:'20px'}}>history</span>
              Historial
            </h4>
            <button className="text-primary text-label-md font-semibold hover:underline">Ver todo</button>
          </div>
          <div className="space-y-sm">
            {pasados.map((t, i) => (
              <div key={t.id}
                className={`card px-lg py-md flex flex-col md:flex-row md:items-center justify-between gap-md hover:bg-surface-container transition-colors
                  ${i%2===1 ? 'bg-surface-container-low/30' : ''}`}>
                <div className="flex items-center gap-lg">
                  <div className="hidden md:flex flex-col items-center justify-center w-14 h-14 bg-surface-container-highest rounded-lg shrink-0">
                    <p className="text-label-sm text-secondary uppercase">{format(new Date(t.fecha),'MMM',{locale:es})}</p>
                    <p className="text-headline-md font-bold text-primary">{format(new Date(t.fecha),'d')}</p>
                  </div>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">{t.motivo || 'Consulta Médica'}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {format(new Date(t.fecha),'HH:mm')} hs
                      {t.duracion ? ` · ${t.duracion} min` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <Badge estado={t.estado} />
                  <button className="btn-secondary gap-xs py-xs">
                    <span className="material-symbols-outlined" style={{fontSize:'16px'}}>description</span>
                    Ver resumen
                  </button>
                  <NavLink to="/paciente/reservar" className="btn-ghost gap-xs py-xs border border-primary/20">
                    <span className="material-symbols-outlined" style={{fontSize:'16px'}}>add_circle</span>
                    Repetir
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CANCELLED */}
      {cancelados.length > 0 && (
        <section>
          <h4 className="text-title-lg font-title-lg text-secondary flex items-center gap-sm mb-md">
            <span className="material-symbols-outlined" style={{fontSize:'20px'}}>event_busy</span>
            Cancelados
          </h4>
          <div className="space-y-sm">
            {cancelados.map(t => (
              <div key={t.id} className="card px-lg py-md flex items-center justify-between opacity-60 hover:opacity-90 transition-opacity">
                <div>
                  <p className="text-label-md font-semibold text-on-surface line-through">{t.motivo || 'Consulta Médica'}</p>
                  <p className="text-body-sm text-on-surface-variant capitalize">
                    {format(new Date(t.fecha),"d 'de' MMMM yyyy 'a las' HH:mm",{locale:es})} hs
                  </p>
                </div>
                <div className="flex items-center gap-md">
                  <Badge estado="cancelado" />
                  <NavLink to="/paciente/reservar" className="btn-ghost py-xs text-label-sm">
                    <span className="material-symbols-outlined" style={{fontSize:'14px'}}>refresh</span>
                    Reagendar
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state total */}
      {!loading && turnos.length === 0 && (
        <div className="card p-xl text-center">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-secondary" style={{fontSize:'36px'}}>calendar_today</span>
          </div>
          <h4 className="text-title-lg font-title-lg text-on-surface mb-sm">Sin historial de turnos</h4>
          <p className="text-body-md text-on-surface-variant mb-lg max-w-sm mx-auto">Aún no tenés turnos registrados. Reservá tu primera cita.</p>
          <NavLink to="/paciente/reservar" className="btn-primary inline-flex mx-auto">
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
            Reservar mi primer turno
          </NavLink>
        </div>
      )}

      <Confirm
        open={!!cancelando}
        onClose={() => setCancelando(null)}
        onConfirm={() => cambiarEstado(cancelando.id, 'cancelado')}
        title="Cancelar turno"
        message={`¿Estás seguro que querés cancelar el turno del ${cancelando ? format(new Date(cancelando.fecha),"d 'de' MMMM 'a las' HH:mm",{locale:es}) : ''}?`}
        danger
      />

      {/* Desktop FAB */}
      <NavLink to="/paciente/reservar"
        className="hidden md:flex fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined" style={{fontSize:'24px'}}>add</span>
      </NavLink>
    </div>
  )
}
