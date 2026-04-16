import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = api.getToken()
    if (token) {
      // Decode the JWT payload to get username (no verification needed client-side)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setUser({ username: payload.sub })
        } else {
          api.clearToken()
        }
      } catch {
        api.clearToken()
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password)
    api.setToken(data.access_token)
    setUser({ username })
    return data
  }, [])

  const register = useCallback(async (username, password) => {
    await api.register(username, password)
    return login(username, password)
  }, [login])

  const logout = useCallback(() => {
    api.clearToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
