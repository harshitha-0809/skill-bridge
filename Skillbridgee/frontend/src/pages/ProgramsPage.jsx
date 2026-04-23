import { useState } from 'react'
import { useFetch, useAsync } from '../hooks/useFetch'
import { getPrograms, enroll, createProgram, getRecommendations } from '../api/services'
import { Badge, Spinner, EmptyState, ErrorMsg } from '../components/shared/UI'
import AppLayout from '../components/shared/AppLayout'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Search, Plus, Clock, X, Sparkles } from 'lucide-react'

const CATEGORIES = ['All','Engineering','Leadership','Design','Data','Communication','Management']
const DIFFICULTIES = ['All','beginner','intermediate','advanced']

function ProgramCard({ program, onEnroll, enrolling }) {
  return (
    <div className="card p-5 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug">{program.title}</h3>
        <Badge value={program.difficulty} />
      </div>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2 flex-1">{program.description}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/>{program.duration_hrs}h</span>
        {program.category && <span className="text-xs text-slate-400">· {program.category}</span>}
        {program.provider && <span className="text-xs text-slate-400">· {program.provider}</span>}
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {program.skills?.slice(0, 4).map(s => (
          <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <button
        onClick={() => onEnroll(program.id)}
        disabled={enrolling === program.id}
        className="btn-primary w-full justify-center text-xs py-2"
      >
        {enrolling === program.id ? 'Enrolling…' : 'Enroll'}
      </button>
    </div>
  )
}

function CreateProgramModal({ onClose, onCreated }) {
  const { execute, loading, error } = useAsync(createProgram)
  const [form, setForm] = useState({
    title:'', description:'', category:'Engineering', difficulty:'beginner',
    duration_hrs:4, skills:'', provider:''
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    await execute({ ...form, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean), duration_hrs: Number(form.duration_hrs) })
    onCreated()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-900">New Program</h2>
          <button onClick={onClose} className="btn-ghost p-1"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={set('title')} required /></div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={set('category')}>
                {['Engineering','Leadership','Design','Data','Communication','Management'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="input" value={form.difficulty} onChange={set('difficulty')}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Duration (hrs)</label><input className="input" type="number" min={0.5} step={0.5} value={form.duration_hrs} onChange={set('duration_hrs')}/></div>
            <div><label className="label">Provider</label><input className="input" placeholder="Coursera, internal…" value={form.provider} onChange={set('provider')}/></div>
          </div>
          <div><label className="label">Skills (comma-separated)</label><input className="input" placeholder="Python, SQL, Leadership" value={form.skills} onChange={set('skills')}/></div>
          <ErrorMsg message={error}/>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Creating…' : 'Create Program'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProgramsPage() {
  const { isManager } = useAuth()
  const { data: programs, loading, refetch } = useFetch(getPrograms)
  const { data: recommendations } = useFetch(() => getRecommendations({ limit: 3 }))
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('All')
  const [diff, setDiff]       = useState('All')
  const [enrolling, setEnrolling] = useState(null)
  const [enrollError, setEnrollError] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = programs?.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchCat  = cat  === 'All' || p.category === cat
    const matchDiff = diff === 'All' || p.difficulty === diff
    return matchSearch && matchCat && matchDiff
  })

  const handleEnroll = async (id) => {
    setEnrolling(id)
    setEnrollError('')
    try {
      await enroll({ program_id: id })
    } catch (e) {
      setEnrollError(e.response?.data?.detail || 'Enrollment failed')
    } finally {
      setEnrolling(null)
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Catalog</h1>
          <p className="text-slate-500 mt-1">{programs?.length || 0} programs available</p>
        </div>
        {isManager && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16}/> Add Program
          </button>
        )}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-brand-600"/>
            <h2 className="text-lg font-semibold text-slate-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(rec => (
              <ProgramCard key={rec.program.id} program={rec.program} onEnroll={handleEnroll} enrolling={enrolling} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input className="input pl-9" placeholder="Search programs…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${cat===c ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {c}
            </button>
          ))}
        </div>
        <select className="input w-auto" value={diff} onChange={e=>setDiff(e.target.value)}>
          {DIFFICULTIES.map(d=><option key={d} value={d}>{d==='All'?'All levels':d}</option>)}
        </select>
      </div>

      <ErrorMsg message={enrollError}/>

      {loading ? <Spinner/> : !filtered?.length ? (
        <EmptyState icon={BookOpen} title="No programs found" description="Try adjusting your filters"/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p=>(
            <ProgramCard key={p.id} program={p} onEnroll={handleEnroll} enrolling={enrolling}/>
          ))}
        </div>
      )}

      {showCreate && <CreateProgramModal onClose={()=>setShowCreate(false)} onCreated={refetch}/>}
    </AppLayout>
  )
}
