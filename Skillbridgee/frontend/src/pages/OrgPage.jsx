import { useFetch } from '../hooks/useFetch'
import { getOrgAnalytics } from '../api/services'
import { StatCard, Spinner } from '../components/shared/UI'
import AppLayout from '../components/shared/AppLayout'
import { Users, BookOpen, CheckCircle, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#8b5cf6','#06b6d4']

function DeptTable({ data }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">Department Breakdown</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Department</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Employees</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Active</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Completed</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Progress</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.department} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i%2===0?'':'bg-slate-50/30'}`}>
                <td className="px-5 py-3.5 font-medium text-slate-900">{d.department}</td>
                <td className="px-5 py-3.5 text-right text-slate-600">{d.total_employees}</td>
                <td className="px-5 py-3.5 text-right text-blue-600 font-medium">{d.active_enrollments}</td>
                <td className="px-5 py-3.5 text-right text-emerald-600 font-medium">{d.completed_programs}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-slate-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-brand-500" style={{width:`${d.avg_progress}%`}}/>
                    </div>
                    <span className="text-slate-600 text-xs w-10 text-right">{d.avg_progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function OrgPage() {
  const { data, loading } = useFetch(getOrgAnalytics)

  if (loading) return <AppLayout><Spinner/></AppLayout>
  if (!data) return null

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Org Overview</h1>
        <p className="text-slate-500 mt-1">Organisation-wide learning metrics</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Employees"  value={data.total_employees}  icon={Users}       color="brand" />
        <StatCard label="Programs"         value={data.total_programs}   icon={BookOpen}    color="amber" />
        <StatCard label="Total Enrollments" value={data.total_enrollments} icon={TrendingUp} color="brand" />
        <StatCard label="Completion Rate"  value={`${data.completion_rate}%`} icon={CheckCircle} color="emerald" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top programs bar chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Top Programs by Enrollment</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.top_programs} margin={{top:0,right:0,left:-20,bottom:40}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="title" tick={{fontSize:10}} angle={-30} textAnchor="end" interval={0}/>
              <YAxis tick={{fontSize:11}}/>
              <Tooltip/>
              <Bar dataKey="enrollments" fill="#6366f1" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill coverage pie */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Skill Coverage</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.skill_coverage} dataKey="programs" nameKey="skill" cx="50%" cy="50%" outerRadius={90} label={({skill})=>skill}>
                {data.skill_coverage.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department table */}
      {data.by_department?.length > 0 && <DeptTable data={data.by_department}/>}
    </AppLayout>
  )
}
