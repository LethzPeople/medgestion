import { useState } from 'react'
import { differenceInYears } from 'date-fns'

export default function PacienteForm({ paciente, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre:'', apellido:'', dni:'', email:'', telefono:'',
    obraSocial:'', nroAfiliado:'', notas:'',
    ...(paciente || {}),
    fechaNacimiento: paciente?.fechaNacimiento?.split('T')[0] || '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setError('')
    try { await onSubmit(form) }
    catch { setError('Error al guardar el paciente.') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      <div className="grid grid-cols-2 gap-md">
        <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Nombre *</label><input className="input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></div>
        <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Apellido *</label><input className="input" value={form.apellido} onChange={e => set('apellido', e.target.value)} required /></div>
      </div>
      <div className="grid grid-cols-2 gap-md">
        <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">DNI</label><input className="input" placeholder="30123456" value={form.dni} onChange={e => set('dni', e.target.value)} /></div>
        <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Fecha de nacimiento</label><input type="date" className="input" value={form.fechaNacimiento} onChange={e => set('fechaNacimiento', e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-md">
        <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Email</label><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Teléfono</label><input className="input" placeholder="+54 9 381..." value={form.telefono} onChange={e => set('telefono', e.target.value)} /></div>
      </div>
      <div className="border-t border-outline-variant pt-lg">
        <p className="text-label-sm text-secondary uppercase tracking-wider mb-md">Cobertura médica</p>
        <div className="grid grid-cols-2 gap-md">
          <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Obra social / Prepaga</label><input className="input" placeholder="OSDE, Swiss Medical..." value={form.obraSocial} onChange={e => set('obraSocial', e.target.value)} /></div>
          <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Nro de afiliado</label><input className="input" value={form.nroAfiliado} onChange={e => set('nroAfiliado', e.target.value)} /></div>
        </div>
      </div>
      <div className="space-y-xs"><label className="text-label-sm text-on-surface-variant">Notas / antecedentes</label><textarea className="input resize-none" rows={3} placeholder="Alergias, condiciones preexistentes..." value={form.notas} onChange={e => set('notas', e.target.value)} /></div>
      {error && <p className="text-body-sm text-on-error-container bg-error-container rounded-lg px-md py-sm">{error}</p>}
      <div className="flex justify-end gap-sm pt-sm">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : paciente ? 'Guardar cambios' : 'Registrar paciente'}
        </button>
      </div>
    </form>
  )
}
