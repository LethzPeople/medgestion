import { createContext, useContext, useState, useEffect } from 'react'
import pb from '../lib/pb'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(pb.authStore.model)
  const [loading, setLoading] = useState(false)

  useEffect(() => pb.authStore.onChange((_, model) => setUser(model)), [])

  // role: 'admin' logs into 'users', 'paciente' logs into 'pacientes'
  async function login(email, password, role = 'admin') {
    setLoading(true)
    try {
      const collection = role === 'paciente' ? 'pacientes' : 'users'
      await pb.collection(collection).authWithPassword(email, password)
    } finally {
      setLoading(false)
    }
  }

  function logout() { pb.authStore.clear() }

  // route-level role: 'admin' | 'paciente'
  const role = user?.collectionName === 'pacientes' ? 'paciente' : 'admin'

  // UI-level role: 'odontologo' | 'secretaria' | 'paciente'
  // Users without a rol value default to 'secretaria' for backward compatibility
  const userRole = user?.collectionName === 'pacientes'
    ? 'paciente'
    : (user?.rol || 'secretaria')

  return (
    <AuthContext.Provider value={{ user, role, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
