// Thin fetch wrapper for the json-server mock API.
// Provides: fetchDoctors, fetchDoctor, fetchSlots, fetchAppointments,
//           createAppointment, cancelAppointment.
//
// NOTE: Not imported by any component yet — the page components are still
// scaffolds. When built out, DoctorDirectory/DoctorDetail will use the doctor
// functions, and BookingForm/AppointmentHistory will use the appointment ones.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json()
}

export async function fetchDoctors(params = {}) {
  const query = new URLSearchParams()
  if (params.department) query.set('department', params.department)
  const qs = query.toString()
  return request(`/doctors${qs ? `?${qs}` : ''}`)
}

export async function fetchDoctor(id) {
  return request(`/doctors/${id}`)
}

export async function fetchSlots(doctorId, params = {}) {
  const query = new URLSearchParams({ doctorId })
  if (params.start) query.set('start', params.start)
  if (params.end) query.set('end', params.end)
  return request(`/slots?${query.toString()}`)
}

export async function fetchAppointments(studentId) {
  const query = new URLSearchParams({ studentId })
  return request(`/appointments?${query.toString()}`)
}

export async function createAppointment(payload) {
  return request('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function cancelAppointment(id) {
  return request(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'cancelled' })
  })
}
