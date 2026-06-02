import { useState, useEffect, useCallback } from 'react'
import pb from '../lib/pb'

export function usePacientes(search = '') {
  const [pacientes, setPacientes] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const filter = search
        ? `nombre ~ "${search}" || apellido ~ "${search}" || dni ~ "${search}" || email ~ "${search}"`
        : null
      const result = await pb.collection('pacientes').getFullList({ 
        ...(filter ? { filter } : {}),
        sort: 'apellido,nombre' 
      })
      setPacientes(result)
    } catch (e) { setError(e.message) }
    finally     { setLoading(false) }
  }, [search])

  useEffect(() => { fetch() }, [fetch])

  const crear      = async (data)     => { const c = await pb.collection('pacientes').create(data);     await fetch(); return c }
  const actualizar = async (id, data) => { const c = await pb.collection('pacientes').update(id, data); await fetch(); return c }
  const eliminar   = async (id)       => { await pb.collection('pacientes').delete(id); await fetch() }

  return { pacientes, loading, error, crear, actualizar, eliminar, refetch: fetch }
}
