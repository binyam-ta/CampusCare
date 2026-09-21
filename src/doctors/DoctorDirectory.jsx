import { useSearchParams, Link } from 'react-router-dom'
import DepartmentFilter from './DepartmentFilter.jsx'

const DEPARTMENTS = ['General Medicine', 'Psychiatry', 'Dermatology', 'Sports Medicine']

export default function DoctorDirectory() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeDepartment = searchParams.get('dept') || null

  const handleDepartmentChange = (dept) => {
    if (dept) {
      searchParams.set('dept', dept)
    } else {
      searchParams.delete('dept')
    }
    setSearchParams(searchParams)
  }

  return (
    <section className="screen">
      <h1 className="screen-title">Doctor Directory</h1>


      <DepartmentFilter
        departments={DEPARTMENTS}
        activeDepartment={activeDepartment}
        onDepartmentChange={handleDepartmentChange}
      />

      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          <p>This is the doctor directory screen.</p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/doctors/dr-1" className="btn btn-primary" style={{ marginRight: '0.5rem' }}>Open /doctors/dr-1</Link>
            <Link to="/doctors/dr-99" className="btn btn-secondary">Open /doctors/dr-99</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
