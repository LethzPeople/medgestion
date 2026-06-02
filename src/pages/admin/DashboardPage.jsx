import { useMemo, useState } from 'react'
import { useTurnos }   from '../../hooks/useTurnos'
import { usePacientes } from '../../hooks/usePacientes'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge, StatCard } from '../../components/ui/index'
import Modal from '../../components/ui/Modal'
import TurnoForm from '../../components/turnos/TurnoForm'

export default function AdminDashboard() {
  const hoy = format(new Date(), 'yyyy-MM-dd')
  const mes  = format(new Date(), 'yyyy-MM')
  const { turnos: turnosHoy,  loading, crear } = useTurnos({ fecha: hoy })
  const { turnos: turnosMes }                  = useTurnos({ mes })
  const [modalNuevo, setModalNuevo] = useState(false)
  const { pacientes }                   = usePacientes()

  const stats = useMemo(() => ({
    hoy:        turnosHoy.length,
    pendientes: turnosHoy.filter(t => t.estado === 'pendiente').length,
    cancelados: turnosMes.filter(t => t.estado === 'cancelado').length,
    total:      turnosMes.length,
  }), [turnosHoy, turnosMes])

  const donut = useMemo(() => {
    const confirmados = turnosMes.filter(t => t.estado === 'confirmado').length
    const pendientes  = turnosMes.filter(t => t.estado === 'pendiente').length
    const cancelados  = turnosMes.filter(t => t.estado === 'cancelado').length
    const completados = turnosMes.filter(t => t.estado === 'completado').length
    const total       = turnosMes.length
    return { confirmados, pendientes, cancelados, completados, total, divisor: total || 1 }
  }, [turnosMes])

  const pct = (n) => Math.round((n / donut.divisor) * 100)

  function exportarCSV() {
    const nombreMes = format(new Date(), "MMMM_yyyy", { locale: es })

    const filas = [
      ['Paciente', 'DNI', 'Fecha', 'Hora', 'Motivo', 'Estado'],
      ...turnosMes.map(t => {
        const p = t.expand?.paciente
        const fecha = t.fecha ? format(new Date(t.fecha.substring(0,10) + 'T12:00:00'), 'dd/MM/yyyy', { locale: es }) : ''
        return [
          p ? `${p.apellido} ${p.nombre}` : '—',
          p?.dni || '—',
          fecha,
          t.hora || '—',
          t.motivo || '—',
          t.estado || '—',
        ]
      })
    ]

    const csv = filas.map(fila =>
      fila.map(celda => `"${String(celda).replace(/"/g, '""')}"`).join(';')
    ).join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `reporte_turnos_${nombreMes}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 md:p-margin-desktop space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-base">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Resumen de Actividad</h2>
          <p className="text-body-md text-secondary capitalize">
            {format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModalNuevo(true)}>
          <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>add</span>
          Nuevo Turno
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        <StatCard label="Turnos Hoy"     value={stats.hoy}        icon="event_available" color="primary"   sub={<><span className="material-symbols-outlined" style={{fontSize:'12px'}}>trending_up</span> Total del día</>} />
        <StatCard label="Nuevos Pacientes" value={pacientes.length} icon="person_add"      color="secondary" sub="Registrados" />
        <StatCard label="Tasa Cancelación" value={stats.total > 0 ? `${Math.round((stats.cancelados/stats.total)*100)}%` : '0%'} icon="event_busy" color="error" sub={<><span className="material-symbols-outlined" style={{fontSize:'12px'}}>trending_down</span> Este mes</>} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Turnos table - 8 cols */}
        <div className="lg:col-span-8 card overflow-hidden">
          <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-title-lg font-title-lg text-on-surface">Próximos Turnos de Hoy</h3>
            <a href="/admin/turnos" className="text-primary text-label-md font-semibold hover:underline">Ver agenda completa</a>
          </div>
          {loading ? (
            <div className="p-xl text-center text-body-sm text-secondary">Cargando...</div>
          ) : turnosHoy.length === 0 ? (
            <div className="p-xl text-center text-body-sm text-secondary">No hay turnos para hoy.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-lg py-sm text-label-sm text-secondary font-semibold">Paciente</th>
                    <th className="px-lg py-sm text-label-sm text-secondary font-semibold">Hora</th>
                    <th className="px-lg py-sm text-label-sm text-secondary font-semibold">Tipo</th>
                    <th className="px-lg py-sm text-label-sm text-secondary font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {turnosHoy.slice(0, 8).map((t, i) => {
                    const p = t.expand?.paciente
                    const initials = p ? `${p.nombre?.[0] || ''}${p.apellido?.[0] || ''}`.toUpperCase() : '?'
                    return (
                      <tr key={t.id} className={`hover:bg-surface-container transition-colors group ${i % 2 === 1 ? 'bg-surface-container-low/40' : ''}`}>
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-md">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-label-sm font-semibold text-primary">{initials}</div>
                            <span className="text-body-sm font-semibold text-on-surface">{p ? `${p.nombre} ${p.apellido}` : '—'}</span>
                          </div>
                        </td>
                        <td className="px-lg py-md text-body-sm text-on-surface-variant">{t.hora || '—'}</td>
                        <td className="px-lg py-md text-body-sm text-on-surface-variant">{t.motivo || 'Consulta'}</td>
                        <td className="px-lg py-md text-right"><Badge estado={t.estado} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Donut chart - 4 cols */}
        <div className="lg:col-span-4 card p-lg flex flex-col items-center justify-between min-h-[400px]">
          <div className="w-full">
            <h3 className="text-title-lg font-title-lg text-on-surface mb-xs">Estado de Turnos</h3>
            <p className="text-body-sm text-secondary">Distribución del mes actual.</p>
          </div>
          {(() => {
            const c1 = pct(donut.confirmados)
            const c2 = c1 + pct(donut.pendientes)
            const c3 = c2 + pct(donut.cancelados)
            return (
              <div className="relative w-48 h-48 my-lg"
                style={{
                  background: `conic-gradient(#3b82f6 0% ${c1}%, #6b7280 ${c1}% ${c2}%, #ef4444 ${c2}% ${c3}%, #22c55e ${c3}% 100%)`,
                  borderRadius: '50%'
                }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-headline-md font-headline-md font-bold text-on-surface">{donut.total}</span>
                  <span className="text-label-sm text-secondary">Total</span>
                </div>
              </div>
            )
          })()}
          <div className="w-full space-y-sm">
            {[
              { color: 'bg-blue-500',  label: 'Confirmados', val: donut.confirmados },
              { color: 'bg-gray-500',  label: 'Pendientes',  val: donut.pendientes },
              { color: 'bg-red-500',   label: 'Cancelados',  val: donut.cancelados },
              { color: 'bg-green-500', label: 'Completados', val: donut.completados },
            ].map(({ color, label, val }) => (
              <div key={label} className="flex items-center justify-between text-body-sm">
                <div className="flex items-center gap-base">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-on-surface">{label}</span>
                </div>
                <span className="font-semibold">{val} ({pct(val)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-md text-secondary">
          <span className="material-symbols-outlined" style={{fontSize:'32px'}}>clinical_notes</span>
        </div>
        <h4 className="text-title-lg font-title-lg text-on-surface">¿Necesitás generar un reporte mensual?</h4>
        <p className="text-body-md text-secondary max-w-md mt-base">
          Exportá los <span className="font-semibold text-on-surface">{turnosMes.length} turnos</span> de{' '}
          <span className="font-semibold text-on-surface capitalize">{format(new Date(), 'MMMM yyyy', { locale: es })}</span> a un archivo CSV para abrirlo en Excel o Google Sheets.
        </p>
        <button
          onClick={exportarCSV}
          disabled={turnosMes.length === 0}
          className="mt-lg flex items-center gap-sm border border-primary text-primary py-sm px-lg rounded-lg text-label-md hover:bg-primary-fixed transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{fontSize:'18px'}}>download</span>
          Exportar CSV del mes
        </button>
      </div>

      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Turno">
        <TurnoForm onSubmit={async d => { await crear(d); setModalNuevo(false) }} onCancel={() => setModalNuevo(false)} />
      </Modal>
    </div>
  )
}
