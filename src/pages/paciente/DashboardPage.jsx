import { useEffect } from 'react'
import { useAuth }   from '../../hooks/useAuth'
import { useTurnos } from '../../hooks/useTurnos'
import { format }    from 'date-fns'
import { es }        from 'date-fns/locale'
import { Badge }     from '../../components/ui/index'
import { NavLink }   from 'react-router-dom'

export default function PacienteDashboard() {
  const { user } = useAuth()
  const { turnos, refetch } = useTurnos({ pacienteId: user?.id })

  useEffect(() => { if (user?.id) refetch() }, [user?.id, refetch])

  const proximos = turnos
    .filter(t => new Date(t.fecha) >= new Date() && t.estado !== 'cancelado')
    .slice(0, 1)
  const proximo = proximos[0]

  const recientes = turnos
    .filter(t => new Date(t.fecha) < new Date())
    .slice(0, 3)

  return (
    <div className="p-margin-mobile md:p-margin-desktop space-y-lg">
      {/* Welcome */}
      <div>
        <h3 className="text-headline-lg font-headline-lg text-on-surface">Hola, {user?.nombre || 'Paciente'}</h3>
        <p className="text-body-lg text-on-surface-variant">Aquí tenés el resumen de tu atención.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left col */}
        <div className="lg:col-span-8 space-y-gutter">
          {/* Próxima cita */}
          {proximo ? (
            <div className="bg-primary text-on-primary rounded-xl p-lg shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-lg">
                  <div>
                    <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full text-label-sm mb-sm inline-block">PRÓXIMA CITA</span>
                    <h4 className="text-headline-md font-headline-md">
                      {proximo.expand?.paciente ? `${proximo.expand.paciente.nombre} ${proximo.expand.paciente.apellido}` : 'Tu turno'}
                    </h4>
                    <p className="text-body-md opacity-90">{proximo.motivo || 'Consulta médica'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-sm text-center min-w-[72px]">
                    <p className="text-label-sm uppercase opacity-80">{format(new Date(proximo.fecha),'MMM',{locale:es})}</p>
                    <p className="text-3xl font-bold">{format(new Date(proximo.fecha),'d')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-md pt-md border-t border-white/20">
                  <div className="flex items-center gap-base">
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>schedule</span>
                    <span className="text-body-sm">{format(new Date(proximo.fecha),'HH:mm')} hs</span>
                  </div>
                  <div className="flex items-center gap-base">
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>timer</span>
                    <span className="text-body-sm">{proximo.duracion || 30} min</span>
                  </div>
                </div>
                <div className="mt-lg flex gap-md">
                  <button className="bg-white text-primary px-lg py-sm rounded-lg text-label-md font-bold hover:bg-surface-container transition-colors">Ver detalles</button>
                  <button className="border border-white/40 text-white px-lg py-sm rounded-lg text-label-md font-bold hover:bg-white/10 transition-colors">Reagendar</button>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
            </div>
          ) : (
            <div className="card p-xl text-center">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
                <span className="material-symbols-outlined text-secondary" style={{fontSize:'28px'}}>event_available</span>
              </div>
              <h4 className="text-title-lg font-title-lg text-on-surface mb-sm">No tenés turnos próximos</h4>
              <p className="text-body-md text-on-surface-variant mb-lg">Reservá un turno con tu especialista.</p>
              <NavLink to="/paciente/reservar" className="btn-primary inline-flex mx-auto">
                <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
                Reservar ahora
              </NavLink>
            </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon:'calendar_month', title:'Nueva Cita', desc:'Reservá con tu especialista.', to:'/paciente/reservar', color:'bg-primary-container text-on-primary' },
              { icon:'description',    title:'Historial',  desc:'Consultá diagnósticos previos.', to:'/paciente/turnos', color:'bg-secondary-container text-primary' },
              { icon:'download',       title:'Resultados', desc:'Descargá tus laboratorios.', to:'/paciente', color:'bg-[#ffdbcc] text-[#7b2f00]' },
            ].map(({ icon, title, desc, to, color }) => (
              <NavLink key={title} to={to} className="card p-lg hover:shadow-md transition-shadow cursor-pointer group block">
                <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-md group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined" style={{fontSize:'22px'}}>{icon}</span>
                </div>
                <h5 className="text-title-lg font-title-lg text-on-surface mb-xs">{title}</h5>
                <p className="text-body-sm text-on-surface-variant">{desc}</p>
              </NavLink>
            ))}
          </div>

          {/* Actividad reciente */}
          {recientes.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
                <h5 className="text-title-lg font-title-lg text-on-surface">Actividad Reciente</h5>
                <NavLink to="/paciente/turnos" className="text-primary text-label-md font-semibold hover:underline">Ver todo</NavLink>
              </div>
              <table className="w-full text-left">
                <thead><tr className="bg-surface-container text-on-surface-variant">
                  <th className="px-lg py-sm text-label-sm">FECHA</th>
                  <th className="px-lg py-sm text-label-sm">MOTIVO</th>
                  <th className="px-lg py-sm text-label-sm text-right">ESTADO</th>
                </tr></thead>
                <tbody className="divide-y divide-outline-variant">
                  {recientes.map(t => (
                    <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-md text-body-sm">{format(new Date(t.fecha),"d MMM yyyy",{locale:es})}</td>
                      <td className="px-lg py-md text-body-sm font-semibold">{t.motivo || 'Consulta'}</td>
                      <td className="px-lg py-md text-right"><Badge estado={t.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="lg:col-span-4 space-y-gutter">
          {/* Recordatorios */}
          <div className="card p-lg">
            <h5 className="text-title-lg font-title-lg text-on-surface mb-lg flex items-center gap-base">
              <span className="material-symbols-outlined text-primary" style={{fontSize:'20px'}}>notifications_active</span>
              Recordatorios
            </h5>
            <div className="space-y-md">
              <div className="flex gap-md p-md bg-surface-container-lowest rounded-lg border-l-4 border-error">
                <span className="material-symbols-outlined text-error mt-xs" style={{fontSize:'18px'}}>medication</span>
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Medicación pendiente</p>
                  <p className="text-body-sm text-on-surface-variant">Recordá tomar tu medicación.</p>
                </div>
              </div>
              <div className="flex gap-md p-md bg-surface-container-lowest rounded-lg border-l-4 border-primary">
                <span className="material-symbols-outlined text-primary mt-xs" style={{fontSize:'18px'}}>water_drop</span>
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Próximo control</p>
                  <p className="text-body-sm text-on-surface-variant">Consultá con tu médico.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen turnos */}
          <div className="card p-lg">
            <h5 className="text-title-lg font-title-lg text-on-surface mb-lg">Resumen de Turnos</h5>
            <div className="space-y-lg">
              {[
                { label:'Total turnos', val: turnos.length },
                { label:'Confirmados',  val: turnos.filter(t=>t.estado==='confirmado').length },
                { label:'Completados',  val: turnos.filter(t=>t.estado==='completado').length },
                { label:'Cancelados',   val: turnos.filter(t=>t.estado==='cancelado').length },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-end border-b border-outline-variant pb-md">
                  <p className="text-label-sm text-on-surface-variant uppercase tracking-wide">{label}</p>
                  <p className="text-headline-md font-headline-md font-bold text-on-surface">{val}</p>
                </div>
              ))}
            </div>
            <NavLink to="/paciente/reservar"
              className="w-full mt-xl block text-center py-sm text-primary border border-primary/20 rounded-lg text-label-md hover:bg-primary/5 transition-colors">
              Reservar nuevo turno
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
