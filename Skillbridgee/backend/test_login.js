import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

async function testLogin() {
  try {
    const form = new URLSearchParams({ username: 'admin@skillbridge.dev', password: 'admin123' })
    const response = await api.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    console.log('Login successful:', response.data)
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
  }
}

testLogin()