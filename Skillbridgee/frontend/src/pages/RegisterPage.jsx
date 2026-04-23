import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorMsg } from '../components/shared/UI'
import { Zap } from 'lucide-react'

const DEPARTMENTS = ['Engineering','Product','Design','Marketing','Sales','HR','Finance','Operations']

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ full_name:'', email:'', password:'', role:'employee', department:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/login')
    } catch (e) {
      setError(e.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 rounded-xl mb-4 shadow-lg shadow-brand-200">
            <Zap size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm">Join SkillBridge today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" placeholder="Priya Sharma" value={form.full_name} onChange={set('full_name')} required />
            </div>
            <div>
              <label className="label">Work email</label>
              <input className="input" type="email" placeholder="priya@company.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Role</label>
                <select className="input" value={form.role} onChange={set('role')}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              <div>
                <label className="label">Department</label>
                <select className="input" value={form.department} onChange={set('department')}>
                  <option value="">Select…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
            </div>

            <ErrorMsg message={error} />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
