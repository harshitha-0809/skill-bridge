import axios from 'axios'

// In production (Vercel), VITE_API_URL points to your Render backend.
// In local dev, the Vite proxy handles /api → localhost:8000 so baseURL stays '/'.
const baseURL = import.meta.env.VITE_API_URL || '/'

const api = axios.create({ baseURL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('sb_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sb_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
