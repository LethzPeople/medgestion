import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday,
  addMonths, subMonths
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useTurnos } from '../../hooks/useTurnos'
import { Badge } from '../../components/ui/index'
import Modal from '../../components/ui/Modal'
import TurnoForm from '../../components/turnos/TurnoForm'

const DIAS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

export default function AdminCalendario() {
  const [mes,      setMes]      = useState(new Date())
  const [diasel,   setDiasel]   = useState(null)
  const [detalle,  setDetalle]  = useState(null)
  const [modalNuevo, setModal]  = useState(false)

  const mesStr = format(mes, 'yyyy-MM')
  const { turnos, crear } = useTurnos({ mes: mesStr })

  const inicioGrid = startOfWeek(startOfMonth(mes), { weekStartsOn: 1 })
  const finGrid    = endOfWeek(endOfMonth(mes),     { weekStartsOn: 1 })
  const dias       = eachDayOfInterval({ start: inicioGrid, end: finGrid })
  const tDia       = d => turnos.filter(t => t.fecha?.substring(0, 10) === format(d, 'yyyy-MM-dd'))

  const tDiasel = diasel ? tDia(diasel).sort((a,b) => new Date(a.fecha) - new Date(b.fecha)) : []

  return (
    <div className="p-4 md:p-margin-desktop space-y-lg">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Calendario de Citas</h2>
          <p className="text-body-md text-secondary">{turnos.length} turno{turnos.length!==1?'s':''} este mes</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex items-center gap-xs card p-xs">
            <button className="p-xs hover:bg-surface-container rounded-lg transition-colors" onClick={() => setMes(m => subMonths(m,1))}>
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>chevron_left</span>
            </button>
            <span className="text-label-md font-semibold px-sm capitalize min-w-28 text-center text-sm">
              {format(mes, 'MMMM yyyy', { locale: es })}
            </span>
            <button className="p-xs hover:bg-surface-container rounded-lg transition-colors" onClick={() => setMes(m => addMonths(m,1))}>
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>chevron_right</span>
            </button>
          </div>
          <button className="btn-secondary text-sm py-xs px-sm" onClick={() => setMes(new Date())}>Hoy</button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-lg">
        {/* Calendar */}
        <div className="flex-1 card overflow-hidden min-w-0">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low">
            {DIAS.map(d => (
              <div key={d} className={`py-sm text-center text-[10px] md:text-label-sm uppercase tracking-wider ${d==='Sáb'||d==='Dom' ? 'text-error' : 'text-secondary'}`}>{d}</div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7">
            {dias.map(dia => {
              const ts         = tDia(dia)
              const esHoy      = isToday(dia)
              const esMes      = isSameMonth(dia, mes)
              const seleccionado = diasel && isSameDay(dia, diasel)
              const tieneTs    = ts.length > 0

              return (
                <div
                  key={dia.toISOString()}
                  onClick={() => setDiasel(isSameDay(dia, diasel) ? null : dia)}
                  className={`min-h-[48px] md:min-h-[100px] border-b border-r border-outline-variant p-xs cursor-pointer transition-colors
                    ${!esMes ? 'bg-surface-container-low/50 opacity-50' : 'hover:bg-surface-container-low/60'}
                    ${seleccionado ? 'ring-2 ring-inset ring-primary bg-primary-fixed/20' : ''}
                    ${tieneTs && !seleccionado ? 'border-t-[3px] border-t-primary' : 'border-t-[3px] border-t-transparent'}
                  `}
                >
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-label-sm mb-xs
                    ${esHoy ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}>
                    {format(dia, 'd')}
                  </div>
                  {/* Chips solo en desktop */}
                  <div className="space-y-0.5 hidden md:block">
                    {ts.slice(0,2).map(t => (
                      <div key={t.id} onClick={e => { e.stopPropagation(); setDetalle(t) }}
                        className={`text-[10px] px-xs py-0.5 rounded truncate font-semibold cursor-pointer
                          ${t.estado==='confirmado' ? 'bg-[#e7f3ff] text-primary border-l-2 border-primary' :
                            t.estado==='cancelado'  ? 'bg-error-container text-on-error-container border-l-2 border-error opacity-70' :
                            t.estado==='completado' ? 'bg-secondary-container text-secondary border-l-2 border-secondary' :
                            'bg-[#fff9e6] text-[#856404] border-l-2 border-yellow-500'}`}>
                        {t.hora || '—'} {t.expand?.paciente?.apellido || ''}
                      </div>
                    ))}
                    {ts.length > 2 && <p className="text-[10px] text-secondary px-xs">+{ts.length-2} más</p>}
                  </div>
                  {/* Punto indicador en mobile */}
                  {tieneTs && (
                    <div className="md:hidden flex justify-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-72 flex flex-col gap-lg">
          {/* Action card */}
          <div className="bg-primary rounded-xl p-lg shadow-md text-on-primary">
            <h3 className="text-title-lg font-title-lg mb-xs">Acciones Rápidas</h3>
            <p className="text-body-sm mb-lg opacity-90">Organizá la jornada de forma eficiente.</p>
            <button onClick={() => setModal(true)} className="w-full bg-white text-primary font-semibold py-md rounded-lg flex items-center justify-center gap-base hover:bg-primary-fixed transition-all active:scale-95 shadow-lg">
              <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>add_circle</span>
              Nuevo Turno
            </button>
          </div>

          {/* Filters */}
          <div className="card p-md">
            <h4 className="text-label-md text-secondary uppercase tracking-widest mb-md">Filtrar por Estado</h4>
            <div className="space-y-sm">
              {[
                {label:'Pendientes',  color:'bg-yellow-400'},
                {label:'Confirmados', color:'bg-primary'},
                {label:'Cancelados',  color:'bg-error'},
              ].map(({ label, color }) => (
                <label key={label} className="flex items-center gap-md p-sm rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                  <input defaultChecked type="checkbox" className="w-4 h-4 rounded accent-primary border-outline-variant" />
                  <span className="flex-1 text-body-sm font-medium">{label}</span>
                  <span className={`w-3 h-3 rounded-full ${color}`} />
                </label>
              ))}
            </div>
          </div>

          {/* Día seleccionado */}
          {diasel && (
            <div className="card p-md">
              <p className="text-label-md font-semibold text-primary mb-md capitalize">
                {format(diasel, "EEEE d 'de' MMMM", { locale: es })}
              </p>
              {tDiasel.length === 0 ? (
                <p className="text-body-sm text-secondary">Sin turnos este día.</p>
              ) : (
                <div className="space-y-sm">
                  {tDiasel.map(t => (
                    <div key={t.id} className="border border-outline-variant rounded-lg p-sm">
                      <div className="flex items-center justify-between mb-xs">
                        <span className="text-label-sm font-mono font-bold text-primary">{t.hora || t.fecha?.substring(11,16) || '—'}</span>
                        <Badge estado={t.estado} />
                      </div>
                      <p className="text-body-sm font-medium text-on-surface">
                        {t.expand?.paciente ? `${t.expand.paciente.apellido}, ${t.expand.paciente.nombre}` : '—'}
                      </p>
                      {t.motivo && <p className="text-label-sm text-secondary mt-xs truncate">{t.motivo}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detalle turno */}
          {detalle && (
            <div className="card p-md border-primary/20 border-2">
              <div className="flex justify-between items-start mb-md">
                <h4 className="text-title-lg font-title-lg text-primary">Detalles del Turno</h4>
                <button onClick={() => setDetalle(null)} className="text-on-surface-variant hover:text-error">
                  <span className="material-symbols-outlined" style={{fontSize:'18px'}}>close</span>
                </button>
              </div>
              <div className="space-y-md text-body-sm">
                <div className="flex gap-md"><span className="material-symbols-outlined text-secondary" style={{fontSize:'18px'}}>person</span>
                  <div><p className="text-label-sm text-secondary">Paciente</p><p className="font-semibold">{detalle.expand?.paciente ? `${detalle.expand.paciente.nombre} ${detalle.expand.paciente.apellido}` : '—'}</p></div>
                </div>
                <div className="flex gap-md"><span className="material-symbols-outlined text-secondary" style={{fontSize:'18px'}}>schedule</span>
                  <div><p className="text-label-sm text-secondary">Hora y Fecha</p><p className="font-semibold">{detalle.fecha ? format(new Date(detalle.fecha.substring(0,10)+'T12:00:00'), "d MMM yyyy", {locale:es}) : '—'}{detalle.hora ? ` a las ${detalle.hora}` : ''}</p></div>
                </div>
                <div className="flex gap-md"><span className="material-symbols-outlined text-secondary" style={{fontSize:'18px'}}>stethoscope</span>
                  <div><p className="text-label-sm text-secondary">Motivo</p><p className="font-semibold">{detalle.motivo || '—'}</p></div>
                </div>
              </div>
              <div className="flex gap-sm mt-lg">
                <button className="flex-1 btn-primary py-xs text-label-sm">Editar</button>
                <button className="flex-1 btn-secondary py-xs text-label-sm">Reprogramar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={modalNuevo} onClose={() => setModal(false)} title="Nuevo Turno">
        <TurnoForm onSubmit={async d => { await crear(d); setModal(false) }} onCancel={() => setModal(false)} />
      </Modal>
    </div>
  )
}
