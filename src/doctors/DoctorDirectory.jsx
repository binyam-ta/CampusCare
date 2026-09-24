import { useSearchParams, Link } from 'react-router-dom'
import DepartmentFilter from './DepartmentFilter.jsx'
import { DoctorCard } from './DoctorCard'
import './Doctor.css'

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Psychiatry',
  'Dermatology',
  'Sports Medicine'
]

const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Abebe Kebede',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    experience: 8,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    department: 'Dermatology',
    specialization: 'Skin Care',
    experience: 7,
    rating: 4.9,
    reviews: 98
  },
  {
    id: '3',
    name: 'Dr. Hana Tesfaye',
    department: 'Psychiatry',
    specialization: 'Mental Health',
    experience: 10,
    rating: 4.7,
    reviews: 86
  },
  {
    id: '4',
    name: 'Dr. Dawit Alemu',
    department: 'Sports Medicine',
    specialization: 'Sports Injuries',
    experience: 6,
    rating: 4.8,
    reviews: 72
  }
]

export default function DoctorDirectory() {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeDepartment = searchParams.get('dept') || null
  const search = searchParams.get('search') || ''

  const handleSearchChange = (value) => {
    const params = new URLSearchParams(searchParams)

    if (value.trim()) {
      params.set('search', value)
    } else {
      params.delete('search')
    }

    setSearchParams(params)
  }

  const handleDepartmentChange = (dept) => {
    const params = new URLSearchParams(searchParams)

    if (dept) {
      params.set('dept', dept)
    } else {
      params.delete('dept')
    }

    setSearchParams(params)
  }

  const filteredDoctors = DOCTORS.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.department.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase())

    const matchesDepartment =
      !activeDepartment ||
      doctor.department === activeDepartment

    return matchesSearch && matchesDepartment
  })

  return (
    <section className="screen">
      <h1 className="screen-title">Doctor Directory</h1>

      <DepartmentFilter
        departments={DEPARTMENTS}
        activeDepartment={activeDepartment}
        search={search}
        onSearchChange={handleSearchChange}
        onDepartmentChange={handleDepartmentChange}
      />

      <div
        className="screen-body"
        style={{ borderRadius: '10px' }}
      >
        <div>
          <p className="doctors-available">
            {filteredDoctors.length} doctors available
          </p>

          {filteredDoctors.length === 0 ? (
            <div className="no-results">
              No doctors match your search.
            </div>
          ) : (
            <div className="doctor-list">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                />
              ))}
            </div>
          )}

          <div className="doctor-test-links">
            <Link
              to="/doctors/dr-1"
              className="btn btn-primary"
            >
              Open /doctors/dr-1
            </Link>

            <Link
              to="/doctors/dr-99"
              className="btn btn-secondary"
            >
              Open /doctors/dr-99
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}