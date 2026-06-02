import { useState, useRef, useEffect } from 'react'
import { useTurnos } from '../../hooks/useTurnos'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Modal from '../../components/ui/Modal'
import { Confirm, Badge } from '../../components/ui/index'
import TurnoForm from '../../components/turnos/TurnoForm'

const ESTADOS = ['pendiente','confirmado','cancelado','completado']

const ESTADO_CONFIG = {
  pendiente:  { label: 'Pendiente',  bg: 'bg-gray-100',  text: 'text-gray-700',  border: 'border-gray-300',  dot: 'bg-gray-500'  },
  confirmado: { label: 'Confirmado', bg: 'bg-blue-50',   text: 'text-blue-700',  border: 'border-blue-300',  dot: 'bg-blue-500'  },
  cancelado:  { label: 'Cancelado',  bg: 'bg-red-50',    text: 'text-red-700',   border: 'border-red-300',   dot: 'bg-red-500'   },
  completado: { label: 'Completado', bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
}

function EstadoSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const cfg = ESTADO_CONFIG[value] || ESTADO_CONFIG.pendiente

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-xs px-sm py-xs rounded-lg border text-label-sm font-medium transition-colors ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <span className="material-symbols-outlined" style={{fontSize:'14px'}}>expand_more</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-xs left-0 bg-white border border-outline-variant rounded-lg shadow-lg py-xs min-w-[140px]">
          {ESTADOS.map(s => {
            const c = ESTADO_CONFIG[s]
            return (
              <button key={s} type="button"
                onClick={() => { onChange(s); setOpen(false) }}
                className={`w-full flex items-center gap-sm px-md py-sm text-label-sm hover:bg-surface-container transition-colors ${s === value ? 'font-semibold' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className={c.text}>{c.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminTurnos() {
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroFecha,  setFiltroFecha]  = useState('')
  const [busqueda,     setBusqueda]     = useState('')
  const { turnos: todosLosTurnos, loading, crear, actualizar, eliminar, cambiarEstado } = useTurnos({
    estado: filtroEstado || undefined,
    fecha:  filtroFecha  || undefined,
  })
  const [modalNuevo, setModalNuevo] = useState(false)
  const [editando,   setEditando]   = useState(null)
  const [eliminando, setEliminando] = useState(null)

  const turnos = busqueda.trim()
    ? todosLosTurnos.filter(t => {
        const p = t.expand?.paciente
        if (!p) return false
        const q = busqueda.toLowerCase()
        return (
          p.nombre?.toLowerCase().includes(q) ||
          p.apellido?.toLowerCase().includes(q) ||
          p.dni?.toLowerCase().includes(q) ||
          `${p.nombre} ${p.apellido}`.toLowerCase().includes(q)
        )
      })
    : todosLosTurnos

  return (
    <div className="p-4 md:p-margin-desktop space-y-lg">
      <div className="flex flex-wrap items-center justify-between gap-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Turnos</h2>
          <p className="text-body-md text-on-surface-variant">{turnos.length} resultado{turnos.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setModalNuevo(true)}>
          <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>add</span>
          Nuevo Turno
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-md flex flex-wrap gap-md items-center">
        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" style={{fontSize:'18px'}}>search</span>
          <input
            className="input pl-[40px] w-full sm:w-64"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <input type="date" className="input w-44" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} />
        <select className="input w-48" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map(s => <option key={s} value={s}>{ESTADO_CONFIG[s].label}</option>)}
        </select>
        {(filtroFecha || filtroEstado || busqueda) && (
          <button className="text-label-sm text-primary hover:underline" onClick={() => { setFiltroFecha(''); setFiltroEstado(''); setBusqueda('') }}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-xl text-center text-body-sm text-secondary">Cargando...</div>
        ) : turnos.length === 0 ? (
          <div className="p-xl text-center text-body-sm text-secondary">No se encontraron turnos.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-md text-label-md text-secondary uppercase">Paciente</th>
                <th className="px-lg py-md text-label-md text-secondary uppercase">Hora</th>
                <th className="px-lg py-md text-label-md text-secondary uppercase">Motivo</th>
                <th className="px-lg py-md text-label-md text-secondary uppercase">Estado</th>
                <th className="px-lg py-md" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {turnos.map((t, i) => {
                const p = t.expand?.paciente
                return (
                  <tr key={t.id} className={`hover:bg-surface-container transition-colors ${i%2===1?'bg-surface-container-low/30':''}`}>
                    <td className="px-lg py-md">
                      <p className="text-body-sm font-semibold text-on-surface">{p ? `${p.apellido}, ${p.nombre}` : '—'}</p>
                      <p className="text-label-sm text-secondary">{p?.dni ? `DNI ${p.dni}` : ''}</p>
                    </td>
                    <td className="px-lg py-md">
                      <p className="text-body-sm font-semibold text-primary">{t.hora || '—'}</p>
                      <p className="text-label-sm text-secondary capitalize">{t.fecha ? format(new Date(t.fecha.substring(0,10) + 'T12:00:00'), "d MMM yyyy", { locale: es }) : '—'}</p>
                    </td>
                    <td className="px-lg py-md text-body-sm text-on-surface-variant max-w-xs truncate">{t.motivo || '—'}</td>
                    <td className="px-lg py-md">
                      <EstadoSelect value={t.estado} onChange={estado => cambiarEstado(t.id, estado)} />
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex gap-xs justify-end">
                        <button onClick={() => setEditando(t)} className="p-2 text-primary hover:bg-primary-fixed rounded-lg transition-colors">
                          <span className="material-symbols-outlined" style={{fontSize:'18px'}}>edit</span>
                        </button>
                        <button onClick={() => setEliminando(t)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined" style={{fontSize:'18px'}}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Turno">
        <TurnoForm onSubmit={async d => { await crear(d); setModalNuevo(false) }} onCancel={() => setModalNuevo(false)} />
      </Modal>
      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar Turno">
        {editando && <TurnoForm turno={editando} onSubmit={async d => { await actualizar(editando.id, d); setEditando(null) }} onCancel={() => setEditando(null)} />}
      </Modal>
      <Confirm open={!!eliminando} onClose={() => setEliminando(null)} onConfirm={() => eliminar(eliminando.id)}
        title="Eliminar turno" message="¿Eliminar este turno? Esta acción no se puede deshacer." danger />
    </div>
  )
}
