import axios from 'axios'

const configured = import.meta.env.VITE_API_URL
const apiOrigin = (configured || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')).replace(/\/+$/, '')
const BASE_URL = apiOrigin ? `${apiOrigin}/api` : '/api'

export const ACCESS_TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)
export const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
export const setTokens = (access, refresh) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing = null

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refreshToken = getRefreshToken()

    if (error.response?.status === 401 && !original._retry && refreshToken) {
      original._retry = true
      try {
        refreshing =
          refreshing ||
          axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })

        const { data } = await refreshing
        refreshing = null
        setAccessToken(data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return client(original)
      } catch (refreshError) {
        refreshing = null
        clearTokens()
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default client