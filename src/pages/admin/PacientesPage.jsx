import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePacientes } from '../../hooks/usePacientes'
import { differenceInYears, format } from 'date-fns'
import { es } from 'date-fns/locale'
import Modal from '../../components/ui/Modal'
import { Confirm, StatCard } from '../../components/ui/index'
import PacienteForm from '../../components/clientes/PacienteForm'
import pb from '../../lib/pb'

const RIESGO_LABELS = {
  estable:     { cls: 'bg-green-100 text-green-800', label: 'Estable' },
  seguimiento: { cls: 'bg-[#ffdbcc] text-[#7b2f00]', label: 'En Seguimiento' },
  activo:      { cls: 'bg-primary-fixed text-primary', label: 'Cita Activa' },
  critico:     { cls: 'bg-error-container text-on-error-container', label: 'Crítico' },
}

function getEdad(fecha) {
  if (!fecha) return '—'
  try { return `${differenceInYears(new Date(), new Date(fecha))} años` } catch { return '—' }
}

export default function AdminPacientes() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { pacientes, loading, crear, actualizar, eliminar } = usePacientes(search)
  const [modalNuevo,  setModalNuevo]  = useState(false)
  const [editando,    setEditando]    = useState(null)
  const [eliminando,  setEliminando]  = useState(null)
  const [ultimosTurnos, setUltimosTurnos] = useState({})
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 5
  const totalPaginas = Math.ceil(pacientes.length / POR_PAGINA)
  const pacientesPagina = pacientes.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  useEffect(() => {
    pb.collection('turnos').getFullList({ fields: 'paciente,fecha', sort: '-fecha' })
      .then(turnos => {
        const map = {}
        turnos.forEach(t => { if (t.paciente && !map[t.paciente]) map[t.paciente] = t.fecha })
        setUltimosTurnos(map)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="p-4 md:p-margin-desktop space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Gestión de Pacientes</h2>
          <p className="text-body-md text-on-surface-variant">Directorio centralizado de registros médicos.</p>
        </div>
        <button className="btn-primary" onClick={() => setModalNuevo(true)}>
          <span className="material-symbols-outlined" style={{fontSize:'18px'}}>person_add</span>
          Agregar Paciente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        <div className="card p-lg">
          <p className="text-label-sm text-secondary uppercase tracking-wider mb-xs">Total Pacientes</p>
          <div className="flex items-end gap-sm">
            <span className="text-headline-md font-headline-md font-bold text-primary">{pacientes.length}</span>
            <span className="text-body-sm text-green-600 mb-0.5 flex items-center gap-xs">
              <span className="material-symbols-outlined" style={{fontSize:'14px'}}>trending_up</span>registrados
            </span>
          </div>
        </div>
        <div className="card p-lg"><p className="text-label-sm text-secondary uppercase tracking-wider mb-xs">Con Obra Social</p><span className="text-headline-md font-headline-md font-bold text-on-surface">{pacientes.filter(p => p.obraSocial).length}</span></div>
        <div className="card p-lg"><p className="text-label-sm text-secondary uppercase tracking-wider mb-xs">Sin Obra Social</p><span className="text-headline-md font-headline-md font-bold text-on-surface">{pacientes.filter(p => !p.obraSocial).length}</span></div>
        <div className="card p-lg"><p className="text-label-sm text-secondary uppercase tracking-wider mb-xs">Resultado búsqueda</p><span className="text-headline-md font-headline-md font-bold text-on-surface">{pacientes.length}</span></div>
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        <div className="p-lg border-b border-outline-variant flex items-center justify-between gap-md">
          <h3 className="text-title-lg font-title-lg">Listado de Pacientes</h3>
          <div className="flex items-center gap-sm flex-1 max-w-sm">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline" style={{fontSize:'18px'}}>search</span>
              <input className="input pl-[40px]" placeholder="Buscar por nombre, DNI, email..." value={search} onChange={e => { setSearch(e.target.value); setPagina(1) }} />
            </div>
            <button className="btn-secondary gap-xs">
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>filter_list</span>
              Filtrar
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-xl text-center text-body-sm text-secondary">Cargando...</div>
        ) : pacientes.length === 0 ? (
          <div className="p-xl text-center text-body-sm text-secondary">{search ? 'Sin resultados.' : 'No hay pacientes registrados.'}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    {['Nombre Completo','DNI','Edad','Última Consulta','Teléfono','Estado','Acciones'].map(h => (
                      <th key={h} className="px-lg py-md text-label-md text-secondary uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {pacientesPagina.map((p, i) => {
                    const initials = `${p.nombre?.[0]||''}${p.apellido?.[0]||''}`.toUpperCase()
                    const bgs = ['bg-secondary-container text-primary','bg-[#ffdbcc] text-on-tertiary','bg-primary-fixed text-primary','bg-error-container text-on-error-container']
                    return (
                      <tr key={p.id} className={`hover:bg-surface-container transition-colors ${i%2===1?'bg-surface-container-low/30':''}`}>
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-md">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-label-sm ${bgs[i%4]}`}>{initials}</div>
                            <div>
                              <p className="text-body-md font-semibold text-on-surface">{p.apellido}, {p.nombre}</p>
                              <p className="text-body-sm text-on-surface-variant">{p.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-lg py-md text-body-md text-on-surface-variant">{p.dni || '—'}</td>
                        <td className="px-lg py-md text-body-md text-on-surface-variant">{getEdad(p.fechaNacimiento)}</td>
                        <td className="px-lg py-md text-body-md text-on-surface-variant">
                          {ultimosTurnos[p.id]
                            ? format(new Date(ultimosTurnos[p.id].substring(0,10) + 'T12:00:00'), "d MMM yyyy", { locale: es })
                            : '—'}
                        </td>
                        <td className="px-lg py-md text-body-md text-on-surface-variant">{p.telefono || '—'}</td>
                        <td className="px-lg py-md">
                          <span className={`px-sm py-xs rounded-full text-label-sm ${p.obraSocial ? 'bg-green-100 text-green-800' : 'bg-surface-container text-secondary'}`}>
                            {p.obraSocial || 'Particular'}
                          </span>
                        </td>
                        <td className="px-lg py-md">
                          <div className="flex gap-xs">
                            <button onClick={() => navigate(`/admin/pacientes/${p.id}`)} className="flex items-center gap-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-all" title="Ver Perfil">
                              <span className="material-symbols-outlined text-[18px]">account_circle</span>
                              <span className="text-label-sm">Ver Perfil</span>
                            </button>
                            <button onClick={() => setEditando(p)} className="p-2 text-secondary hover:bg-secondary-fixed rounded-lg transition-colors" title="Editar">
                              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>edit</span>
                            </button>
                            <button onClick={() => setEliminando(p)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors" title="Eliminar">
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
            <div className="p-lg border-t border-outline-variant flex items-center justify-between bg-surface">
              <p className="text-body-sm text-on-surface-variant">
                Mostrando {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, pacientes.length)} de {pacientes.length} pacientes
              </p>
              <div className="flex items-center gap-md">
                <span className="text-label-sm text-secondary">Página {pagina} de {totalPaginas}</span>
                <div className="flex gap-base">
                  <button
                    className="btn-secondary gap-xs"
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'16px'}}>chevron_left</span>Anterior
                  </button>
                  <button
                    className="btn-secondary gap-xs"
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                  >
                    Siguiente<span className="material-symbols-outlined" style={{fontSize:'16px'}}>chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Paciente" size="lg">
        <PacienteForm onSubmit={async d => { await crear(d); setModalNuevo(false) }} onCancel={() => setModalNuevo(false)} />
      </Modal>
      <Modal open={!!editando} onClose={() => setEditando(null)} title="Editar Paciente" size="lg">
        {editando && <PacienteForm paciente={editando} onSubmit={async d => { await actualizar(editando.id, d); setEditando(null) }} onCancel={() => setEditando(null)} />}
      </Modal>
      <Confirm open={!!eliminando} onClose={() => setEliminando(null)} onConfirm={() => eliminar(eliminando.id)}
        title="Eliminar paciente" message={`¿Eliminar a ${eliminando?.nombre} ${eliminando?.apellido}?`} danger />
    </div>
  )
}
