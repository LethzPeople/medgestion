import { useState, useEffect, useCallback } from 'react'
import pb from '../lib/pb'

export function useTurnos(filters = {}) {
  const [turnos,  setTurnos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const buildFilter = () => {
    const parts = []
    if (filters.fecha)     parts.push(`fecha >= "${filters.fecha} 00:00:00" && fecha <= "${filters.fecha} 23:59:59"`)
    if (filters.estado)    parts.push(`estado = "${filters.estado}"`)
    if (filters.clienteId) parts.push(`cliente = "${filters.clienteId}"`)
    if (filters.pacienteId)parts.push(`paciente = "${filters.pacienteId}"`)
    if (filters.mes) {
      const [y, m] = filters.mes.split('-')
      const last   = String(new Date(parseInt(y), parseInt(m), 0).getDate()).padStart(2, '0')
      parts.push(`fecha >= "${y}-${m}-01 00:00:00" && fecha <= "${y}-${m}-${last} 23:59:59"`)
    }
    return parts.join(' && ')
  }

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const filterStr = buildFilter()
      const result = await pb.collection('turnos').getFullList({
        ...(filterStr ? { filter: filterStr } : {}),
        expand: 'paciente',
        sort:   'fecha',
      })
      setTurnos(result)
    } catch (e) { setError(e.message) }
    finally     { setLoading(false) }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  const crear         = async (data)         => { 
    try {
      const t = await pb.collection('turnos').create(data); 
      await fetch(); 
      return t 
    } catch (e) { 
      console.error('Error creando turno:', e)
      throw e 
    }
  }
  const actualizar    = async (id, data)     => { const t = await pb.collection('turnos').update(id, data);     await fetch(); return t }
  const eliminar      = async (id)           => { await pb.collection('turnos').delete(id); await fetch() }
  const cambiarEstado = async (id, estado)   => actualizar(id, { estado })

  return { turnos, loading, error, crear, actualizar, eliminar, cambiarEstado, refetch: fetch }
}
