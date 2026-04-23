import clsx from 'clsx'

// ── Badge ────────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  beginner:     'bg-emerald-50 text-emerald-700',
  intermediate: 'bg-amber-50 text-amber-700',
  advanced:     'bg-rose-50 text-rose-700',
  not_started:  'bg-slate-100 text-slate-600',
  in_progress:  'bg-blue-50 text-blue-700',
  completed:    'bg-emerald-50 text-emerald-700',
  dropped:      'bg-red-50 text-red-600',
  employee:     'bg-slate-100 text-slate-600',
  manager:      'bg-brand-50 text-brand-700',
  hr:           'bg-purple-50 text-purple-700',
  admin:        'bg-rose-50 text-rose-700',
}

export function Badge({ value, label, className }) {
  const text  = label || value?.replace('_', ' ')
  const style = BADGE_VARIANTS[value] || 'bg-slate-100 text-slate-600'
  return (
    <span className={clsx('badge capitalize', style, className)}>
      {text}
    </span>
  )
}

// ── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value = 0, showLabel = true, size = 'md' }) {
  const h = size === 'sm' ? 'h-1.5' : 'h-2'
  const color = value >= 100 ? 'bg-emerald-500' : value >= 50 ? 'bg-brand-500' : 'bg-amber-400'
  return (
    <div className="w-full">
      <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', h)}>
        <div
          className={clsx('rounded-full transition-all duration-500', h, color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-1">{Math.round(value)}% complete</p>
      )}
    </div>
  )
}

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ className }) {
  return (
    <div className={clsx('flex items-center justify-center py-16', className)}>
      <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  )
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, color = 'brand' }) {
  const colors = {
    brand:   'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber:   'bg-amber-50 text-amber-600',
    rose:    'bg-rose-50 text-rose-600',
  }
  return (
    <div className="card p-5 flex items-start gap-4">
      {Icon && (
        <div className={clsx('p-2.5 rounded-lg', colors[color])}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Icon size={24} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── ErrorMsg ─────────────────────────────────────────────────────────────────
export function ErrorMsg({ message }) {
  if (!message) return null
  return (
    <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
      {message}
    </div>
  )
}
