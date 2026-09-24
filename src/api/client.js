import fallbackData from '../data/data.json'

// Cache the fetched data in-memory to prevent repeated network requests
let dataCache = null

export async function fetchData() {
  if (dataCache) {
    return dataCache
  }

  try {
    const response = await fetch('/data.json')
    if (!response.ok) {
      throw new Error(`Failed to load data.json: HTTP status ${response.status}`)
    }
    const data = await response.json()
    dataCache = data
    return data
  } catch (error) {
    console.warn('Network request for /data.json failed, using bundled fallback data.', error)
    dataCache = fallbackData
    return fallbackData
  }
}


export async function fetchDoctors(params = {}) {
  const data = await fetchData()
  let list = data.doctors || []

  if (params.department) {
    const deptLower = params.department.trim().toLowerCase()
    list = list.filter((doc) => doc.department.toLowerCase() === deptLower)
  }

  if (params.name) {
    const nameLower = params.name.trim().toLowerCase()
    list = list.filter((doc) => doc.name.toLowerCase().includes(nameLower))
  }

  return list
}


export async function fetchDoctor(id) {
  const data = await fetchData()
  const doctors = data.doctors || []
  return doctors.find((doc) => String(doc.id) === String(id)) || null
}


export async function fetchSpecialties() {
  const data = await fetchData()
  return data.specialties || []
}


export async function fetchRecommendedDoctor() {
  const data = await fetchData()
  return data.recommendedDoctor || (data.doctors && data.doctors[0]) || null
}


export async function fetchClinicInfo() {
  const data = await fetchData()
  return data.clinicInfo || {}
}


export async function fetchAppointments(studentEmail) {
  const data = await fetchData()
  const list = data.appointments || []
  if (!studentEmail) return list
  return list.filter(
    (appt) =>
      appt.patient?.email?.toLowerCase() === studentEmail.toLowerCase()
  )
}


export async function fetchMockUsers() {
  const data = await fetchData()
  return data.users || []
}


export async function createAppointment(payload) {
  return {
    ...payload,
    id: payload.id || `appt-${Date.now()}`,
    createdAt: new Date().toISOString()
  }
}


export async function cancelAppointment(id) {
  return { id, status: 'cancelled', updatedAt: new Date().toISOString() }
}
