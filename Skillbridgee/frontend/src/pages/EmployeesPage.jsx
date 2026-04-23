import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { getEmployees, getAllEnrollments } from '../api/services'
import { Badge, Spinner, EmptyState } from '../components/shared/UI'
import AppLayout from '../components/shared/AppLayout'
import { Users, Search, ChevronDown, ChevronRight } from 'lucide-react'

function EmployeeRow({ employee, enrollments }) {
  const [open, setOpen] = useState(false)
  const myEnrollments = enrollments?.filter(e => e.employee_id === employee.id) || []
  const completed = myEnrollments.filter(e => e.status === 'completed').length

  return (
    <>
      <tr
        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
              {employee.full_name[0]}
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">{employee.full_name}</p>
              <p className="text-xs text-slate-400">{employee.email}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-sm text-slate-600">{employee.department || '—'}</td>
        <td className="px-5 py-4"><Badge value={employee.role}/></td>
        <td className="px-5 py-4 text-sm text-center text-slate-700">{myEnrollments.length}</td>
        <td className="px-5 py-4 text-sm text-center text-emerald-600 font-medium">{completed}</td>
        <td className="px-5 py-4 text-right pr-5">
          {open ? <ChevronDown size={16} className="text-slate-400 ml-auto"/> : <ChevronRight size={16} className="text-slate-400 ml-auto"/>}
        </td>
      </tr>
      {open && myEnrollments.length > 0 && (
        <tr className="bg-slate-50 border-b border-slate-100">
          <td colSpan={6} className="px-5 py-3">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myEnrollments.map(e => (
                <div key={e.id} className="flex items-center gap-3 py-1.5">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-800">{e.program.title}</p>
                    <p className="text-xs text-slate-400">{e.program.category}</p>
                  </div>
                  <div className="w-28">
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-brand-500" style={{width:`${e.progress}%`}}/>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 w-10 text-right">{Math.round(e.progress)}%</span>
                  <Badge value={e.status}/>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function EmployeesPage() {
  const { data: employees, loading: eLoading } = useFetch(getEmployees)
  const { data: enrollments } = useFetch(getAllEnrollments)
  const [search, setSearch] = useState('')
  const [dept, setDept]     = useState('All')

  const departments = ['All', ...new Set(employees?.map(e => e.department).filter(Boolean) || [])]
  const filtered = employees?.filter(e => {
    const matchSearch = e.full_name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
    const matchDept   = dept === 'All' || e.department === dept
    return matchSearch && matchDept
  })

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        <p className="text-slate-500 mt-1">{employees?.length || 0} total employees</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input className="input pl-9" placeholder="Search employees…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="input w-auto" value={dept} onChange={e=>setDept(e.target.value)}>
          {departments.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>

      {eLoading ? <Spinner/> : !filtered?.length ? (
        <EmptyState icon={Users} title="No employees found"/>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Enrolled</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Completed</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <EmployeeRow key={emp.id} employee={emp} enrollments={enrollments}/>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
