import api from './client'

// Programs
export const getPrograms  = (params) => api.get('/api/programs/', { params }).then(r => r.data)
export const getProgram   = (id)     => api.get(`/api/programs/${id}`).then(r => r.data)
export const createProgram = (data)  => api.post('/api/programs/', data).then(r => r.data)
export const updateProgram = (id, data) => api.put(`/api/programs/${id}`, data).then(r => r.data)
export const deleteProgram = (id)    => api.delete(`/api/programs/${id}`).then(r => r.data)
export const getRecommendations = (params) => api.get('/api/programs/recommendations', { params }).then(r => r.data)

// Enrollments
export const getMyEnrollments = ()   => api.get('/api/enrollments/my').then(r => r.data)
export const getAllEnrollments = (params) => api.get('/api/enrollments/all', { params }).then(r => r.data)
export const enroll = (data)         => api.post('/api/enrollments/', data).then(r => r.data)
export const updateEnrollment = (id, data) => api.patch(`/api/enrollments/${id}`, data).then(r => r.data)

// Employees
export const getEmployees = ()       => api.get('/api/employees/').then(r => r.data)
export const getEmployee  = (id)     => api.get(`/api/employees/${id}`).then(r => r.data)

// Analytics
export const getOrgAnalytics = ()    => api.get('/api/analytics/org').then(r => r.data)
