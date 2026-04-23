import { useFetch, useAsync } from '../hooks/useFetch'
import { getMyEnrollments, updateEnrollment } from '../api/services'
import { Badge, ProgressBar, Spinner, EmptyState } from '../components/shared/UI'
import AppLayout from '../components/shared/AppLayout'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle } from 'lucide-react'
import { useState } from 'react'

function EnrollmentCard({ enrollment, onUpdate }) {
  const [progress, setProgress] = useState(enrollment.progress)
  const { execute, loading } = useAsync(updateEnrollment)
  const isCompleted = enrollment.status === 'completed'

  const handleSave = async () => {
    await onUpdate(enrollment.id, {
      progress,
      status: progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started'
    })
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">{enrollment.program.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {enrollment.program.category} · {enrollment.program.duration_hrs}h · {enrollment.program.provider || 'Internal'}
          </p>
        </div>
        <Badge value={enrollment.status} />
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {enrollment.program.skills?.slice(0,5).map(s=>(
          <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>

      {isCompleted ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium py-2">
          <CheckCircle size={16}/>
          Completed {enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : ''}
        </div>
      ) : (
        <div className="space-y-3">
          <ProgressBar value={progress}/>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={100} step={5}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="flex-1 accent-brand-600"
            />
            <button
              onClick={handleSave}
              disabled={loading || progress === enrollment.progress}
              className="btn-primary text-xs py-1.5 px-3 shrink-0"
            >
              {loading ? 'Saving…' : 'Update'}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
        Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
      </div>
    </div>
  )
}

export default function MyProgressPage() {
  const { data: enrollments, loading, refetch } = useFetch(getMyEnrollments)

  const handleUpdate = async (id, data) => {
    await updateEnrollment(id, data)
    refetch()
  }

  const active    = enrollments?.filter(e => e.status !== 'completed') || []
  const completed = enrollments?.filter(e => e.status === 'completed') || []

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Progress</h1>
        <p className="text-slate-500 mt-1">Track and update your learning progress</p>
      </div>

      {loading ? <Spinner/> : !enrollments?.length ? (
        <EmptyState
          icon={BookOpen}
          title="No enrollments yet"
          description="Start by enrolling in a program from the catalog"
          action={<Link to="/programs" className="btn-primary">Browse Programs</Link>}
        />
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <div>
              <h2 className="font-semibold text-slate-700 mb-4">In Progress ({active.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.map(e => <EnrollmentCard key={e.id} enrollment={e} onUpdate={handleUpdate}/>)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="font-semibold text-slate-700 mb-4">Completed ({completed.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completed.map(e => <EnrollmentCard key={e.id} enrollment={e} onUpdate={handleUpdate}/>)}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  )
}
