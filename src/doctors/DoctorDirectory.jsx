import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import DepartmentFilter from './DepartmentFilter.jsx'
import DoctorList from './DoctorList.jsx'
import { fetchDoctors } from '../api/client.js'
import './Doctor.css'

export default function DoctorDirectory() {
  // --------------------------------------------------------------------------
  // 1. ROUTER QUERY PARAMS
  // --------------------------------------------------------------------------
  // Reads and writes the ?dept= query parameter for deep-linking and browser history support
  const [searchParams, setSearchParams] = useSearchParams()
  const activeDepartment = searchParams.get('dept') || null

  // --------------------------------------------------------------------------
  // 2. STATE MANAGEMENT (`useState`)
  // --------------------------------------------------------------------------
  // Stores doctors fetched from data.json 
  const [doctors, setDoctors] = useState([])
  // Tracks user input to filter doctors by name ("on the doctor page filter the name")
  const [searchTerm, setSearchTerm] = useState('')
  // Tracks initial loading state
  const [isLoading, setIsLoading] = useState(true)

  // --------------------------------------------------------------------------
  // 3. DATA FETCHING SIDE EFFECT (`useEffect`)
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true

    async function loadDoctors() {
      try {
        const data = await fetchDoctors()
        if (isMounted) {
          setDoctors(data)
        }
      } catch (err) {
        console.error('Failed to load doctors from data.json', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDoctors()

    return () => {
      isMounted = false
    }
  }, [])

  // --------------------------------------------------------------------------
  // 4. DYNAMIC DEPARTMENTS LIST (`useMemo`)
  // --------------------------------------------------------------------------
  // Derives unique departments from the loaded doctors array 
  const departments = useMemo(() => {
    const set = new Set()
    doctors.forEach((doc) => {
      if (doc.department) set.add(doc.department)
    })
    return Array.from(set).sort()
  }, [doctors])

  // --------------------------------------------------------------------------
  // 5. MEMOIZED DOCTOR FILTERING (`useMemo`)
  // --------------------------------------------------------------------------
  // Requirements:
  // - "on the doctor page filter the name": Matches `doctor.name` with `searchTerm`
  // - Filters by `activeDepartment` when a department button is selected
  const filteredDoctors = useMemo(() => {
    const nameQuery = searchTerm.trim().toLowerCase()

    return doctors.filter((doctor) => {
      // 1. Department condition
      const matchesDept =
        !activeDepartment ||
        doctor.department.toLowerCase() === activeDepartment.toLowerCase()

      // 2. Name condition (filters doctors by name)
      const matchesName =
        !nameQuery || doctor.name.toLowerCase().includes(nameQuery)

      return matchesDept && matchesName
    })
  }, [doctors, activeDepartment, searchTerm])

  // Updates the ?dept= query param in the URL
  const handleDepartmentChange = (dept) => {
    if (dept) {
      searchParams.set('dept', dept)
    } else {
      searchParams.delete('dept')
    }
    setSearchParams(searchParams)
  }

  // Resets all filters (both name search and department)
  const handleResetFilters = () => {
    setSearchTerm('')
    searchParams.delete('dept')
    setSearchParams(searchParams)
  }

  return (
    <section className="screen">
      <h1 className="screen-title">Doctor Directory</h1>

      {/* Search by doctor name & Filter by department */}
      <DepartmentFilter
        departments={departments}
        activeDepartment={activeDepartment}
        onDepartmentChange={handleDepartmentChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchClear={() => setSearchTerm('')}
      />

      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          {/* Dynamic doctor count indicator */}
          <p className="doctors-available">
            {isLoading
              ? 'Loading clinicians...'
              : `${filteredDoctors.length} ${
                  filteredDoctors.length === 1 ? 'doctor' : 'doctors'
                } available`}
            {activeDepartment && ` in ${activeDepartment}`}
            {searchTerm.trim() && ` matching "${searchTerm}"`}
          </p>

          {/* Renders the filtered doctor cards or empty state */}
          {isLoading ? (
            <p style={{ color: '#6b7280', padding: '1.5rem 0' }}>
              Fetching doctors from data.json...
            </p>
          ) : (
            <DoctorList
              doctors={filteredDoctors}
              searchTerm={searchTerm}
              onResetFilters={handleResetFilters}
            />
          )}
        </div>
      </div>
    </section>
  )
}
