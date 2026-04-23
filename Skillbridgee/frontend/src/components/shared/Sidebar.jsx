import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, BookOpen, TrendingUp, Users,
  LogOut, Zap, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const NAV_EMPLOYEE = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/programs',   label: 'Programs',   icon: BookOpen },
  { to: '/my-progress',label: 'My Progress',icon: TrendingUp },
]

const NAV_MANAGER = [
  { to: '/org',        label: 'Org Overview', icon: TrendingUp },
  { to: '/employees',  label: 'Employees',    icon: Users },
  { to: '/programs',   label: 'Programs',     icon: BookOpen },
]

export default function Sidebar() {
  const { user, logout, isManager } = useAuth()
  const navigate = useNavigate()

  const navItems = isManager ? NAV_MANAGER : NAV_EMPLOYEE

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-none">SkillBridge</p>
            <p className="text-xs text-slate-400 mt-0.5">Profile Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          {isManager ? 'Management' : 'Personal'}
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                {label}
                {({ isActive }) => isActive && <ChevronRight size={14} className="ml-auto" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Log out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
