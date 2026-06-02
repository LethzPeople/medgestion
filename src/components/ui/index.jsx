import Modal from './Modal'

export function Confirm({ open, onClose, onConfirm, title, message, danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirmar'} size="sm">
      <p className="text-body-md text-on-surface-variant mb-lg">{message}</p>
      <div className="flex justify-end gap-sm">
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={() => { onConfirm(); onClose() }}>
          Confirmar
        </button>
      </div>
    </Modal>
  )
}

const ESTADOS = {
  pendiente:  { label: 'Pendiente',  cls: 'badge-pendiente' },
  confirmado: { label: 'Confirmado', cls: 'badge-confirmado' },
  cancelado:  { label: 'Cancelado',  cls: 'badge-cancelado' },
  completado: { label: 'Completado', cls: 'badge-completado' },
}
export function Badge({ estado }) {
  const e = ESTADOS[estado] || { label: estado, cls: 'badge-pendiente' }
  return <span className={e.cls}>{e.label}</span>
}

export function StatCard({ label, value, sub, icon, color = 'primary' }) {
  const iconBg = {
    primary: 'bg-primary-fixed text-primary',
    secondary: 'bg-surface-container-high text-secondary',
    error: 'bg-error-container text-on-error-container',
    success: 'bg-[#e8f5e9] text-[#2e7d32]',
  }
  return (
    <div className="card p-lg flex items-center gap-lg">
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${iconBg[color]}`}>
        <span className="material-symbols-outlined" style={{fontSize:'24px'}}>{icon}</span>
      </div>
      <div>
        <p className="text-label-sm text-secondary uppercase tracking-wider">{label}</p>
        <h3 className="text-headline-lg font-headline-lg font-bold text-on-surface leading-none mt-xs">{value}</h3>
        {sub && <p className="text-label-sm text-primary flex items-center gap-xs mt-xs">{sub}</p>}
      </div>
    </div>
  )
}
