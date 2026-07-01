import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { getMyEnrollments, getPrograms } from '../api/services'
import { StatCard, ProgressBar, Badge, Spinner, EmptyState } from '../components/shared/UI'
import AppLayout from '../components/shared/AppLayout'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: enrollments, loading: eLoading } = useFetch(getMyEnrollments)
  const { data: programs,    loading: pLoading } = useFetch(getPrograms)

  const completed   = enrollments?.filter(e => e.status === 'completed').length || 0
  const inProgress  = enrollments?.filter(e => e.status === 'in_progress').length || 0
  const totalHrs    = enrollments?.reduce((s, e) => s + (e.program?.duration_hrs || 0), 0) || 0
  const avgProgress = enrollments?.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good morning, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Enrolled"     value={enrollments?.length || 0} icon={BookOpen}   color="brand" />
        <StatCard label="In Progress"  value={inProgress}               icon={Clock}      color="amber" />
        <StatCard label="Completed"    value={completed}                icon={CheckCircle} color="emerald" />
        <StatCard label="Avg Progress" value={`${avgProgress}%`}        icon={TrendingUp}  color="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active enrollments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">My Programs</h2>
            <Link to="/my-progress" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>

          {eLoading ? <Spinner /> : !enrollments?.length ? (
            <EmptyState
              icon={BookOpen}
              title="No enrollments yet"
              description="Browse the program catalog to start learning"
              action={<Link to="/programs" className="btn-primary">Browse Programs</Link>}
            />
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 5).map(e => (
                <div key={e.id} className="card p-4 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-900 text-sm truncate">{e.program.title}</p>
                      <Badge value={e.status} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 mb-2">{e.program.category} · {e.program.duration_hrs}h</p>
                    <ProgressBar value={e.progress} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended */}
        <div>
          <h2 className="font-semibold text-slate-900 mb-4">Recommended</h2>
          {pLoading ? <Spinner /> : (
            <div className="space-y-3">
              {programs?.slice(0, 4).map(p => (
                <div key={p.id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{p.title}</p>
                    <Badge value={p.difficulty} />
                  </div>
                  <p className="text-xs text-slate-400">{p.category} · {p.duration_hrs}h</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.skills?.slice(0, 3).map(s => (
                      <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
              <Link to="/programs" className="btn-secondary w-full justify-center text-sm">
                View all programs
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
