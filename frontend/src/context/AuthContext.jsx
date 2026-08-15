import { useCallback, useEffect, useMemo, useState } from 'react'
import client, {
  clearTokens,
  getRefreshToken,
  setTokens,
} from '../api/client'
import { AuthContext } from './authContext'

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async (token) => {
    const { data } = await client.get('/auth/me/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearTokens()
    localStorage.removeItem('user')
  }, [])

  const restoreSession = useCallback(async () => {
    if (!getRefreshToken()) {
      setLoading(false)
      return
    }
    try {
      const { data } = await client.post('/auth/token/refresh/', {
        refresh: getRefreshToken(),
      })
      setTokens(data.access, data.refresh)
      const me = await fetchMe(data.access)
      setUser(me)
      localStorage.setItem('user', JSON.stringify(me))
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [fetchMe, logout])

  const login = useCallback(
    async (username, password) => {
      const { data } = await client.post('/auth/token/', { username, password })
      setTokens(data.access, data.refresh)
      const me = await fetchMe(data.access)
      setUser(me)
      localStorage.setItem('user', JSON.stringify(me))
      return me
    },
    [fetchMe],
  )

  const register = useCallback(async (username, email, password) => {
    const { data } = await client.post('/auth/register/', {
      username,
      email,
      password,
    })
    setTokens(data.access, data.refresh)
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  }, [])

  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener('auth:logout', handleLogout)
    restoreSession()
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [restoreSession])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}