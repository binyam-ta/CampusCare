/* ------------------------------------------------------------------
   MOCK DATA for DoctorDashboard.
   To connect a real API, replace the three exports below
   (doctor, patients, appointments) and keep the same field names.
   Dates use at() so "today" and "upcoming" always make sense when you open the page.
   Statuses used: 'scheduled' | 'completed' | 'cancelled'
------------------------------------------------------------------- */

// Returns an ISO date string N days from today at the given time
const at = (daysFromNow, hour, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const doctor = {
  id: '1',
  name: 'Dr. Abebe Kebede',
  department: 'Internal Medicine',
}

export const patients = [
  { id: 'p1', fullName: 'Meron Alemu', phone: '+251 911 234 567', email: 'meron.alemu@gmail.com', lastVisit: at(0, 8, 30), lastReason: 'Blood pressure check', totalVisits: 6 },
  { id: 'p2', fullName: 'Dawit Tadesse', phone: '+251 922 481 903', email: 'dawit.tadesse@gmail.com', lastVisit: at(-7, 16), lastReason: 'Sleep problems', totalVisits: 3 },
  { id: 'p3', fullName: 'Selamawit Girma', phone: '+251 933 672 015', email: 'selamawit.girma@yahoo.com', lastVisit: at(-20, 10), lastReason: 'Ear infection', totalVisits: 2 },
  { id: 'p4', fullName: 'Yonas Bekele', phone: '+251 913 559 288', email: 'yonas.bekele@gmail.com', lastVisit: at(-14, 11), lastReason: 'Knee pain', totalVisits: 4 },
  { id: 'p5', fullName: 'Hanna Mekonnen', phone: '+251 944 120 736', email: 'hanna.mekonnen@gmail.com', lastVisit: at(-45, 9), lastReason: 'Vaccination', totalVisits: 1 },
  { id: 'p6', fullName: 'Abel Haile', phone: '+251 966 803 421', email: 'abel.haile@gmail.com', lastVisit: at(-9, 14), lastReason: 'Lower back pain', totalVisits: 2 },
  { id: 'p7', fullName: 'Tigist Worku', phone: '+251 921 337 640', email: 'tigist.worku@yahoo.com', lastVisit: at(-2, 9), lastReason: 'Fever and sore throat', totalVisits: 5 },
  { id: 'p8', fullName: 'Kidus Assefa', phone: '+251 715 248 093', email: 'kidus.assefa@gmail.com', lastVisit: at(-30, 15), lastReason: 'Medication review', totalVisits: 3 },
  { id: 'p9', fullName: 'Bethlehem Desta', phone: '+251 912 764 350', email: 'bethlehem.desta@gmail.com', lastVisit: at(-25, 14), lastReason: 'Migraine', totalVisits: 4 },
  { id: 'p10', fullName: 'Nahom Getachew', phone: '+251 705 916 482', email: 'nahom.getachew@gmail.com', lastVisit: at(-40, 10), lastReason: 'Seasonal flu', totalVisits: 1 },
]

// Builds one appointment with the patient's details attached
const appt = (id, patientId, days, hour, minute, reason, status) => {
  const { fullName, phone, email } = patients.find((p) => p.id === patientId)
  return {
    id,
    patient: { id: patientId, fullName, phone, email },
    reason,
    slotDateTime: at(days, hour, minute),
    status,
  }
}

export const appointments = [
  // Today
  appt('a1', 'p1', 0, 8, 30, 'Follow-up: blood pressure check', 'completed'),
  appt('a2', 'p2', 0, 10, 0, 'Recurring headaches', 'scheduled'),
  appt('a3', 'p3', 0, 11, 30, 'Seasonal allergy symptoms', 'scheduled'),
  appt('a4', 'p4', 0, 14, 30, 'Stomach pain after meals', 'scheduled'),
  // Upcoming
  appt('a5', 'p5', 1, 9, 30, 'Annual health check-up', 'scheduled'),
  appt('a6', 'p6', 1, 15, 0, 'Lower back pain', 'scheduled'),
  appt('a7', 'p7', 2, 10, 30, 'Skin rash on arms', 'scheduled'),
  appt('a8', 'p8', 4, 11, 0, 'Medication review', 'scheduled'),
  // Past
  appt('a9', 'p7', -2, 9, 0, 'Fever and sore throat', 'completed'),
  appt('a10', 'p9', -3, 14, 0, 'Migraine follow-up', 'cancelled'),
  appt('a11', 'p10', -5, 10, 0, 'Cough for two weeks', 'cancelled'),
  appt('a12', 'p2', -7, 16, 0, 'Sleep problems', 'completed'),
]