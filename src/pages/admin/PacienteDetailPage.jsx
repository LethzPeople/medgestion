import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import pb from '../../lib/pb'
import { Badge } from '../../components/ui/index'

// PocketBase devuelve fechas con espacio: "2026-06-01 10:30:00.000Z"
// new Date() no parsea ese formato en Safari/Firefox, hay que normalizar con T
function formatPbDate(str) {
  if (!str) return '—'
  const d = new Date(str.replace(' ', 'T'))
  return isValid(d) && d.getFullYear() > 2000 ? format(d, 'dd/MM/yyyy HH:mm') : '—'
}

export default function PacienteDetailPage() {
  const { id } = useParams()
  const [turnos, setTurnos] = useState([])

  useEffect(() => {
    pb.collection('turnos').getFullList({
      filter: `paciente = "${id}"`,
      sort: '-fecha',
    }).then(setTurnos).catch(() => {})
  }, [id])
  const navigate = useNavigate()
  const [paciente, setPaciente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    cargarPaciente()
  }, [id])

  async function cargarPaciente() {
    try {
      setLoading(true)
      const data = await pb.collection('pacientes').getOne(id)
      setPaciente(data)
      setForm(data)
    } catch (e) {
      setError('Error al cargar paciente')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function guardar() {
    try {
      const actualizado = await pb.collection('pacientes').update(id, form)
      setPaciente(actualizado)
      setForm(actualizado)
      setEditando(false)
    } catch (e) {
      setError('Error al guardar')
    }
  }

  if (loading) return <div className="p-margin-desktop text-center">Cargando...</div>
  if (error) return <div className="p-margin-desktop text-error">{error}</div>
  if (!paciente) return <div className="p-margin-desktop">Paciente no encontrado</div>

  return (
    <div className="p-4 md:p-margin-desktop space-y-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate('/admin/pacientes')} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-headline-lg font-headline-lg text-on-surface">{paciente.nombre} {paciente.apellido}</h1>
            <p className="text-body-md text-on-surface-variant">DNI: {paciente.dni || '—'}</p>
          </div>
        </div>
        <button onClick={() => setEditando(!editando)} className="btn-primary">
          <span className="material-symbols-outlined">{editando ? 'close' : 'edit'}</span>
          {editando ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left: Datos Personales */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Datos Personales Card */}
          <div className="card p-lg">
            <h2 className="text-title-lg font-title-lg text-on-surface mb-lg">Datos Personales</h2>
            <div className="grid grid-cols-2 gap-lg">
              <div>
                <label className="text-label-sm text-on-surface-variant">Nombre</label>
                {editando ? (
                  <input className="input mt-xs" value={form.nombre || ''} onChange={e => setForm({...form, nombre: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">{paciente.nombre}</p>
                )}
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Apellido</label>
                {editando ? (
                  <input className="input mt-xs" value={form.apellido || ''} onChange={e => setForm({...form, apellido: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">{paciente.apellido}</p>
                )}
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">DNI</label>
                {editando ? (
                  <input className="input mt-xs" value={form.dni || ''} onChange={e => setForm({...form, dni: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">{paciente.dni || '—'}</p>
                )}
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Teléfono</label>
                {editando ? (
                  <input className="input mt-xs" value={form.telefono || ''} onChange={e => setForm({...form, telefono: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">{paciente.telefono || '—'}</p>
                )}
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Email</label>
                <p className="text-body-md text-on-surface mt-xs">{paciente.email}</p>
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Fecha de Nacimiento</label>
                {editando ? (
                  <input type="date" className="input mt-xs" value={form.fechaNacimiento || ''} onChange={e => setForm({...form, fechaNacimiento: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">
                    {paciente.fechaNacimiento ? format(new Date(paciente.fechaNacimiento), 'dd/MM/yyyy') : '—'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cobertura Médica Card */}
          <div className="card p-lg">
            <h2 className="text-title-lg font-title-lg text-on-surface mb-lg">Cobertura Médica</h2>
            <div className="grid grid-cols-2 gap-lg">
              <div>
                <label className="text-label-sm text-on-surface-variant">Obra Social / Prepaga</label>
                {editando ? (
                  <input className="input mt-xs" placeholder="OSDE, Swiss Medical..." value={form.obraSocial || ''} onChange={e => setForm({...form, obraSocial: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">{paciente.obraSocial || '—'}</p>
                )}
              </div>
              <div>
                <label className="text-label-sm text-on-surface-variant">Nro de Afiliado</label>
                {editando ? (
                  <input className="input mt-xs" value={form.nroAfiliado || ''} onChange={e => setForm({...form, nroAfiliado: e.target.value})} />
                ) : (
                  <p className="text-body-md text-on-surface mt-xs">{paciente.nroAfiliado || '—'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notas Médicas */}
          <div className="card p-lg">
            <h2 className="text-title-lg font-title-lg text-on-surface mb-lg">Notas Médicas</h2>
            {editando ? (
              <textarea
                className="input w-full h-40 resize-none"
                placeholder="Agregar notas clínicas, observaciones, etc..."
                value={form.notas || ''}
                onChange={e => setForm({...form, notas: e.target.value})}
              />
            ) : (
              <div className="bg-surface-container-low p-md rounded-lg min-h-40">
                {paciente.notas ? (
                  <p className="text-body-md text-on-surface whitespace-pre-wrap">{paciente.notas}</p>
                ) : (
                  <p className="text-body-md text-on-surface-variant italic">Sin notas registradas</p>
                )}
              </div>
            )}
          </div>

          {editando && (
            <div className="flex gap-md">
              <button onClick={guardar} className="btn-primary flex-1">
                <span className="material-symbols-outlined">check</span>
                Guardar Cambios
              </button>
              <button onClick={() => setEditando(false)} className="btn-secondary flex-1">
                <span className="material-symbols-outlined">close</span>
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Right: Info General */}
        <div className="space-y-lg">
          {/* Metadata */}
          <div className="card p-lg space-y-md">
            <div>
              <p className="text-label-sm text-on-surface-variant">ID Registro</p>
              <p className="text-body-sm text-on-surface font-mono break-all">{paciente.id}</p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant">Registrado</p>
              <p className="text-body-sm text-on-surface">{formatPbDate(paciente.created)}</p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant">Última Actualización</p>
              <p className="text-body-sm text-on-surface">{formatPbDate(paciente.updated)}</p>
            </div>
          </div>

          {/* Historial de turnos */}
          <div className="card p-lg space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-title-md font-semibold text-on-surface">Historial de Turnos</h3>
              <span className="text-label-sm text-secondary">{turnos.length} total</span>
            </div>
            {turnos.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant italic">Sin turnos registrados.</p>
            ) : (
              <div className="space-y-sm max-h-72 overflow-y-auto pr-xs">
                {turnos.map(t => (
                  <div key={t.id} className="border border-outline-variant rounded-lg p-sm flex items-start justify-between gap-sm">
                    <div>
                      <p className="text-body-sm font-semibold text-on-surface">
                        {t.fecha ? format(new Date(t.fecha.substring(0,10)+'T12:00:00'), "d MMM yyyy", { locale: es }) : '—'}
                        {t.hora ? ` · ${t.hora}` : ''}
                      </p>
                      <p className="text-label-sm text-secondary mt-xs truncate max-w-[160px]">
                        {t.motivo || 'Sin motivo'}
                      </p>
                    </div>
                    <Badge estado={t.estado} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
