import { useState } from 'react'
import { usePacientes } from '../../hooks/usePacientes'
import { format } from 'date-fns'

const ESTADOS = ['pendiente','confirmado','cancelado','completado']

export default function TurnoForm({ turno, onSubmit, onCancel }) {
  const { pacientes, crear: crearPaciente } = usePacientes()
  const [modo, setModo] = useState(turno ? 'existente' : 'existente') // existente o nuevo
  const [form, setForm] = useState({
    paciente: '', fecha: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    motivo: '', duracion: 30, estado: 'pendiente', notas: '',
    ...(turno ? { 
      paciente: turno.paciente,
      fecha: format(new Date(turno.fecha), "yyyy-MM-dd'T'HH:mm") 
    } : {})
  })
  
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    dni: '', obraSocial: '', nroAfiliado: '', fechaNacimiento: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setNP = (k, v) => setNuevoPaciente(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      let pacienteId = form.paciente
      
      // Si modo es nuevo, crear paciente primero
      if (modo === 'nuevo') {
        if (!nuevoPaciente.nombre || !nuevoPaciente.apellido) {
          throw new Error('Nombre y apellido son requeridos.')
        }
        
        // Crear paciente (sin password, ya no es auth collection)
        const p = await crearPaciente({
          nombre: nuevoPaciente.nombre,
          apellido: nuevoPaciente.apellido,
          ...(nuevoPaciente.email && { email: nuevoPaciente.email }),
          ...(nuevoPaciente.telefono && { telefono: nuevoPaciente.telefono }),
          ...(nuevoPaciente.dni && { dni: nuevoPaciente.dni }),
          ...(nuevoPaciente.fechaNacimiento && { fechaNacimiento: nuevoPaciente.fechaNacimiento }),
          ...(nuevoPaciente.obraSocial && { obraSocial: nuevoPaciente.obraSocial }),
          ...(nuevoPaciente.nroAfiliado && { nroAfiliado: nuevoPaciente.nroAfiliado })
        })
        pacienteId = p.id
      } else {
        if (!pacienteId) throw new Error('Seleccioná un paciente.')
      }
      
      // Crear turno — split directo sin conversión UTC
      const [fechaStr, horaStr = '00:00'] = form.fecha.split('T')

      const turnoData = {
        paciente: pacienteId,
        fecha: `${fechaStr} ${horaStr}:00`,
        hora: horaStr,
        motivo: form.motivo,
        duracion: form.duracion,
        estado: form.estado,
        notas: form.notas
      }
      
      console.log('Enviando turno:', turnoData) // DEBUG
      await onSubmit(turnoData)
    } catch (e) {
      setError(e.message || 'Error al guardar el turno.')
    } finally {
      setLoading(false)
    }
  }

  if (turno) {
    // Edición de turno existente - modo simple
    return (
      <form onSubmit={handleSubmit} className="space-y-lg">
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Fecha y hora *</label>
          <input type="datetime-local" className="input" value={form.fecha} onChange={e => set('fecha', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className="text-label-sm text-on-surface-variant">Duración</label>
            <select className="input" value={form.duracion} onChange={e => set('duracion', Number(e.target.value))}>
              {[15,20,30,45,60,90].map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
          <div className="space-y-xs">
            <label className="text-label-sm text-on-surface-variant">Estado</label>
            <select className="input" value={form.estado} onChange={e => set('estado', e.target.value)}>
              {ESTADOS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Motivo de consulta</label>
          <input type="text" className="input" placeholder="Ej: Control, consulta general..." value={form.motivo} onChange={e => set('motivo', e.target.value)} />
        </div>
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Notas internas</label>
          <textarea className="input resize-none" rows={3} placeholder="Observaciones..." value={form.notas} onChange={e => set('notas', e.target.value)} />
        </div>
        {error && <p className="text-body-sm text-on-error-container bg-error-container rounded-lg px-md py-sm">{error}</p>}
        <div className="flex justify-end gap-sm pt-sm">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      {/* Toggle Paciente Existente / Nuevo */}
      <div className="flex gap-xs bg-surface-container-low border border-outline-variant rounded-lg p-xs mb-lg">
        {[['existente', 'Paciente Existente'], ['nuevo', 'Paciente Nuevo']].map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setModo(m)}
            className={`flex-1 py-sm rounded-md text-label-md transition-all ${
              modo === m
                ? 'bg-surface-container-lowest shadow border border-outline-variant text-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Seleccionar Paciente Existente */}
      {modo === 'existente' && (
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Paciente *</label>
          <select className="input" value={form.paciente} onChange={e => set('paciente', e.target.value)} required>
            <option value="">Seleccionar paciente...</option>
            {pacientes.map(p => <option key={p.id} value={p.id}>{p.apellido}, {p.nombre} — DNI {p.dni}</option>)}
          </select>
        </div>
      )}

      {/* Crear Paciente Nuevo */}
      {modo === 'nuevo' && (
        <div className="space-y-lg bg-surface-container-low p-md rounded-lg border border-outline-variant">
          <h3 className="text-title-sm font-title-sm text-on-surface">Datos del Paciente</h3>
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Nombre *</label>
              <input type="text" className="input" placeholder="Nombre" value={nuevoPaciente.nombre} onChange={e => setNP('nombre', e.target.value)} required />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Apellido *</label>
              <input type="text" className="input" placeholder="Apellido" value={nuevoPaciente.apellido} onChange={e => setNP('apellido', e.target.value)} required />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Email</label>
              <input type="email" className="input" placeholder="correo@ejemplo.com (opcional)" value={nuevoPaciente.email} onChange={e => setNP('email', e.target.value)} />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Teléfono</label>
              <input type="tel" className="input" placeholder="+54 9 11 XXXX-XXXX" value={nuevoPaciente.telefono} onChange={e => setNP('telefono', e.target.value)} />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">DNI</label>
              <input type="text" className="input" placeholder="DNI" value={nuevoPaciente.dni} onChange={e => setNP('dni', e.target.value)} />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Fecha de Nacimiento</label>
              <input type="date" className="input" value={nuevoPaciente.fechaNacimiento} onChange={e => setNP('fechaNacimiento', e.target.value)} />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Obra Social / Prepaga</label>
              <input type="text" className="input" placeholder="OSDE, Swiss Medical..." value={nuevoPaciente.obraSocial} onChange={e => setNP('obraSocial', e.target.value)} />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant">Nro de Afiliado</label>
              <input type="text" className="input" placeholder="Nro afiliado" value={nuevoPaciente.nroAfiliado} onChange={e => setNP('nroAfiliado', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Datos del Turno */}
      <div className="space-y-lg">
        <h3 className="text-title-sm font-title-sm text-on-surface">Datos del Turno</h3>
        <div className="grid grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className="text-label-sm text-on-surface-variant">Fecha y hora *</label>
            <input type="datetime-local" className="input" value={form.fecha} onChange={e => set('fecha', e.target.value)} required />
          </div>
          <div className="space-y-xs">
            <label className="text-label-sm text-on-surface-variant">Duración</label>
            <select className="input" value={form.duracion} onChange={e => set('duracion', Number(e.target.value))}>
              {[15,20,30,45,60,90].map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Motivo de consulta</label>
          <input type="text" className="input" placeholder="Ej: Control, consulta general..." value={form.motivo} onChange={e => set('motivo', e.target.value)} />
        </div>
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Estado</label>
          <select className="input" value={form.estado} onChange={e => set('estado', e.target.value)}>
            {ESTADOS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
        <div className="space-y-xs">
          <label className="text-label-sm text-on-surface-variant">Notas internas</label>
          <textarea className="input resize-none" rows={3} placeholder="Observaciones..." value={form.notas} onChange={e => set('notas', e.target.value)} />
        </div>
      </div>

      {error && <p className="text-body-sm text-on-error-container bg-error-container rounded-lg px-md py-sm">{error}</p>}
      <div className="flex justify-end gap-sm pt-sm">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear turno'}
        </button>
      </div>
    </form>
  )
}
