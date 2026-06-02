import { useEffect } from 'react'
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const h = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-surface-container-lowest rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] flex flex-col border border-outline-variant`}>
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
          <h2 className="text-title-lg font-title-lg text-on-surface">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-lg py-md custom-scrollbar">{children}</div>
      </div>
    </div>
  )
}
