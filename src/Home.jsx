import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMagnifyingGlass,
  faArrowRight,
  faRunning,
  faHandDots,
  faHeadSideVirus,
  faStethoscope,
  faChild,
  faStar,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

import { useAuth } from './auth/AuthContext.jsx'
import { fetchSpecialties, fetchRecommendedDoctor } from './api/client.js'
import doctorImg from './assets/images/home-page-doctor.jpg'
import './Home.css'

// Map icon string names from data.json to FontAwesome icon objects
const ICON_MAP = {
  faHeadSideVirus,
  faHandDots,
  faRunning,
  faStethoscope,
  faChild
}

export default function Home() {
  const navigate = useNavigate()
  const { student } = useAuth()

  // --------------------------------------------------------------------------
  // 1. STATE MANAGEMENT (`useState`)
  // --------------------------------------------------------------------------
  // Tracks the live query typed into the search bar
  const [searchQuery, setSearchQuery] = useState('')
  // Stores specialties loaded from data.json (removes hardcoded array)
  const [specialties, setSpecialties] = useState([])
  // Stores the recommended doctor profile loaded from data.json
  const [recommendedDoctor, setRecommendedDoctor] = useState(null)
  // Loading state indicator
  const [isLoading, setIsLoading] = useState(true)

  // --------------------------------------------------------------------------
  // 2. DATA FETCHING SIDE EFFECT (`useEffect`)
  // --------------------------------------------------------------------------
  // Replaces all hardcoded page data by fetching directly from data.json on mount
  useEffect(() => {
    let isMounted = true

    async function loadHomeData() {
      try {
        const [specsData, recDocData] = await Promise.all([
          fetchSpecialties(),
          fetchRecommendedDoctor()
        ])

        if (isMounted) {
          setSpecialties(specsData)
          setRecommendedDoctor(recDocData)
        }
      } catch (error) {
        console.error('Failed to fetch home screen data from data.json', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  // --------------------------------------------------------------------------
  // 3. MEMOIZED FILTERING (`useMemo`)
  // --------------------------------------------------------------------------
  // Requirement: "the search bar on the hom screen should filtter specalities"
  // Efficiently recalculates the visible specialties only when the query or list changes.
  const filteredSpecialties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return specialties
    }
    return specialties.filter((spec) => {
      const nameMatch = spec.name.toLowerCase().includes(query)
      const descMatch = spec.description?.toLowerCase().includes(query)
      return nameMatch || descMatch
    })
  }, [specialties, searchQuery])

  // Handles search form submit (navigates to Doctor Directory if query is submitted)
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // If the query matches a specialty name, navigate with department filter
      const matchedDept = specialties.find(
        (s) => s.name.toLowerCase() === searchQuery.trim().toLowerCase()
      )
      if (matchedDept) {
        navigate(`/doctors?dept=${encodeURIComponent(matchedDept.name)}`)
      }
    }
  }

  // Personalized dynamic greeting replacing hardcoded "EYOB"
  const greetingName = student?.name ? student.name.toUpperCase() : 'STUDENT'

  return (
    <section className="screen">
      <div className="home-screen">
        {/* Dynamic greeting based on auth session */}
        <h2 className="greetings">GOOD MORNING, {greetingName}</h2>
        <h1 className="screen-title">How can we care for you today?</h1>

        <div className="screen-body">
          {/* 
            Search bar on Home Screen:
            Filters the specialties displayed below in real-time as the user types.
          */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search medical specialties (e.g. Psychiatry, Dermatology)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter specialties by name or keyword"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                style={{ background: 'transparent', color: '#6b7280' }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
            <button type="submit" aria-label="Search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>

          {/* Quick Care CTA Banner */}
          <div className="care-card">
            <div>
              <h2>Care that fits your day</h2>
              <p>Book a trusted campus clinician in minutes, online or in person.</p>
              <Link
                to="/doctors"
                style={{ color: 'inherit', textDecoration: 'none', display: 'inline-block' }}
              >
                <span>
                  Find a doctor <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </Link>
            </div>
            <img src={doctorImg} alt="Campus clinician" />
          </div>

          {/* 
            Specialists Section:
            Filtered dynamically by `useMemo` using the search bar above.
          */}
          <div className="specialists-section">
            <div className="section-header">
              <h2>
                Specialists
                {searchQuery.trim() && (
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 400,
                      color: '#6b7280',
                      marginLeft: '0.5rem'
                    }}
                  >
                    ({filteredSpecialties.length} matching &quot;{searchQuery}&quot;)
                  </span>
                )}
              </h2>

              <Link to="/doctors" className="see-all">
                See all
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            {isLoading ? (
              <p style={{ color: '#6b7280', padding: '1rem 0' }}>Loading specialties from database...</p>
            ) : filteredSpecialties.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}
              >
                <p>No specialties found matching &quot;{searchQuery}&quot;.</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => setSearchQuery('')}
                >
                  Show all specialties
                </button>
              </div>
            ) : (
              <div className="specialists-row">
                {filteredSpecialties.map((spec) => {
                  const Icon = ICON_MAP[spec.icon] || faStethoscope
                  return (
                    <Link
                      key={spec.id}
                      to={`/doctors?dept=${encodeURIComponent(spec.name)}`}
                      className="specialist-card"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      title={`Browse ${spec.name} specialists`}
                    >
                      <FontAwesomeIcon icon={Icon} className="specialist-icon" />
                      <h3>{spec.name}</h3>
                      <p>{spec.specialistCount} specialists</p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* 
            Recommended for You Section:
            Loaded from data.json (removes hardcoded Dr. Sarah Johnson card).
          */}
          {recommendedDoctor && (
            <div className="recommended-section">
              <h2>Recommended for You</h2>
              <Link
                to={`/doctors/${recommendedDoctor.id}`}
                className="doctor-card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="doctor-card">
                  <img
                    src={recommendedDoctor.photo}
                    alt={recommendedDoctor.name}
                    className="doctor-recommend-img"
                    style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div className="doctor-info">
                    <h3>{recommendedDoctor.name}</h3>
                    <p className="doctor-department">{recommendedDoctor.department}</p>
                    <p className="doctor-specialization">{recommendedDoctor.specialization}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.3rem 0' }}>
                      {recommendedDoctor.description}
                    </p>
                    <div className="doctor-rating">
                      <FontAwesomeIcon icon={faStar} className="doctor-stars" />
                      <span className="doctor-rating-value">{recommendedDoctor.rating}</span>
                      <span className="doctor-reviews">({recommendedDoctor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
