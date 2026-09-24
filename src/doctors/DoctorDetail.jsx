import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faPersonCircleCheck,
  faMoneyBills,
  faClock,
  faStar,
  faStarOfLife,
  faVideo,
  faPerson,
  faCalendarXmark
} from '@fortawesome/free-solid-svg-icons'

import { fetchDoctor } from '../api/client.js'
import defaultDoctorPhoto from '../assets/images/dr-abebe-kebede.jpg'
import './DoctorDetail.css'

// Standard clinic appointment time grid
const CLINIC_TIMES = ['09:00', '09:30', '10:30', '11:30', '14:00', '15:30', '16:00', '17:00']

// Mock availability algorithm: deterministic booking simulation per day/time
const isBooked = (dayIndex, timeIndex) => (dayIndex * 3 + timeIndex) % 4 === 3

// Formats 'HH:mm' strings into friendly 12-hour strings (e.g. "9:30 AM")
const fmtTime = (hhmm) =>
  new Date(`1970-01-01T${hhmm}:00`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

const MODE_LABEL = { video: 'Video visit', 'in-person': 'In-person' }

export default function DoctorDetail() {
  // --------------------------------------------------------------------------
  // 1. URL PARAMETERS (`useParams`)
  // --------------------------------------------------------------------------
  // Extracts the clinician ID from `/doctors/:id`
  const { id } = useParams()
  const navigate = useNavigate()

  // --------------------------------------------------------------------------
  // 2. STATE MANAGEMENT (`useState`)
  // --------------------------------------------------------------------------
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dayIndex, setDayIndex] = useState(0)
  const [time, setTime] = useState(null)
  const [mode, setMode] = useState('video')

  // --------------------------------------------------------------------------
  // 3. ASYNC DATA FETCHING (`useEffect`)
  // --------------------------------------------------------------------------
  // Fetches the specific doctor from data.json based on `id`
  useEffect(() => {
    let isMounted = true

    async function loadDoctorProfile() {
      setIsLoading(true)
      try {
        const fetchedDoc = await fetchDoctor(id)
        if (isMounted) {
          setDoctor(fetchedDoc)
          if (fetchedDoc && fetchedDoc.modes && fetchedDoc.modes.length > 0) {
            setMode(fetchedDoc.modes[0])
          }
        }
      } catch (err) {
        console.error(`Error loading doctor id ${id} from data.json`, err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDoctorProfile()

    return () => {
      isMounted = false
    }
  }, [id])

  // --------------------------------------------------------------------------
  // 4. MEMOIZED DATE GENERATION & TIME SLOTS (`useMemo`)
  // --------------------------------------------------------------------------
  // Generates 7 consecutive days starting from today
  const days = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d
    })
  }, [])

  const selectedDay = days[dayIndex]

  // Computes the combined Date object for the appointment slot
  const slotDateTime = useMemo(() => {
    if (!time || !selectedDay) return null
    const [h, m] = time.split(':').map(Number)
    const d = new Date(selectedDay)
    d.setHours(h, m, 0, 0)
    return d
  }, [selectedDay, time])

  const pickDay = (i) => {
    setDayIndex(i)
    setTime(null) // Reset time selection when day changes
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="screen dd">
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6b7280' }}>
          <p>Loading clinician profile from data.json...</p>
        </div>
      </section>
    )
  }

  // Doctor not found fallback state
  if (!doctor) {
    return (
      <section className="screen dd">
        <Link to="/doctors" className="dd-back">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to doctors
        </Link>
        <div
          className="screen-body"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            background: '#fff',
            borderRadius: '10px'
          }}
        >
          <FontAwesomeIcon
            icon={faCalendarXmark}
            style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }}
          />
          <h2>Clinician not found</h2>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem' }}>
            We could not find a doctor with ID &quot;{id}&quot; in our clinic directory.
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Browse all doctors
          </Link>
        </div>
      </section>
    )
  }

  const longDate = selectedDay.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const shortSelection = slotDateTime
    ? `${selectedDay.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric'
      })} · ${fmtTime(time)}`
    : null

  const doctorPhoto = doctor.photo || defaultDoctorPhoto

  return (
    <section className="screen dd">
      <Link to="/doctors" className="dd-back">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to doctors
      </Link>

      <div className="dd-layout">
        {/* ---------- Left column: Doctor Bio & Credentials ---------- */}
        <div className="dd-profile">
          <header className="dd-hero">
            <img
              className="dd-photo"
              src={doctorPhoto}
              alt={doctor.name}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = defaultDoctorPhoto
              }}
            />
            <div className="dd-hero-text">
              <h1 className="dd-name">{doctor.name}</h1>
              <p className="dd-dept">{doctor.department}</p>
              <p className="dd-meta">
                {doctor.education}
                <br />
                {doctor.yearsOfExperience} years of clinical experience
              </p>
              <p
                className="dd-rating"
                aria-label={`Rated ${doctor.rating} out of 5 from ${doctor.reviewCount} reviews`}
              >
                <FontAwesomeIcon icon={faStar} />
                <strong>{doctor.rating}</strong>
                <span>{doctor.reviewCount} reviews</span>
              </p>
            </div>
          </header>

          <ul className="dd-stats">
            <li>
              <FontAwesomeIcon icon={faMoneyBills} />
              <strong>
                {doctor.currency || 'ETB'} {doctor.fee || 500}
              </strong>
              <span>Visit fee</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faClock} />
              <strong>{doctor.durationMinutes || 30} min</strong>
              <span>Duration</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faPersonCircleCheck} />
              <strong>
                {(doctor.modes || ['video', 'in-person'])
                  .map((m) => (m === 'video' ? 'Video' : 'In-person'))
                  .join(' & ')}
              </strong>
              <span>Available</span>
            </li>
          </ul>

          <div className="dd-block">
            <h2 className="dd-h2">About</h2>
            <p className="dd-about">{doctor.about}</p>
            {doctor.languages && (
              <ul className="dd-chips" aria-label="Languages spoken">
                {doctor.languages.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )}
            {doctor.hospital && (
              <p className="dd-hospital">
                <FontAwesomeIcon icon={faStarOfLife} /> {doctor.hospital}
              </p>
            )}
          </div>
        </div>

        {/* ---------- Right column: Schedule & Slot Picker ---------- */}
        <div className="dd-booking">
          <h2 className="dd-h2">Select an appointment</h2>

          {/* Mode Selector (Video vs In-person) */}
          {doctor.modes && doctor.modes.length > 1 && (
            <div className="dd-modes" role="group" aria-label="Visit type">
              {doctor.modes.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`dd-mode ${mode === m ? 'is-active' : ''}`}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m === 'video' ? (
                    <FontAwesomeIcon icon={faVideo} />
                  ) : (
                    <FontAwesomeIcon icon={faPerson} />
                  )}
                  {MODE_LABEL[m] || m}
                </button>
              ))}
            </div>
          )}

          {/* Date Picker Grid */}
          <div className="dd-days" role="group" aria-label="Choose a date">
            {days.map((d, i) => (
              <button
                key={d.toISOString()}
                type="button"
                className={`dd-day ${i === dayIndex ? 'is-active' : ''}`}
                aria-pressed={i === dayIndex}
                onClick={() => pickDay(i)}
              >
                <span>
                  {i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <strong>{d.getDate()}</strong>
              </button>
            ))}
          </div>

          <p className="dd-slot-caption">
            {longDate} · {MODE_LABEL[mode] || mode}
          </p>

          {/* Time Slots Grid */}
          <div className="dd-times" role="group" aria-label="Choose a time">
            {CLINIC_TIMES.map((t, ti) => {
              const booked = isBooked(dayIndex, ti)
              return (
                <button
                  key={t}
                  type="button"
                  disabled={booked}
                  className={`dd-time ${time === t ? 'is-active' : ''}`}
                  aria-pressed={time === t}
                  onClick={() => setTime(t)}
                >
                  {fmtTime(t)}
                </button>
              )
            })}
          </div>

          {/* Selection summary */}
          <div className="dd-summary" aria-live="polite">
            <div>
              <span className="dd-summary-label">Your selection</span>
              <strong>{shortSelection ?? 'Pick a time slot'}</strong>
            </div>
            <strong className="dd-summary-price">
              {doctor.currency || 'ETB'} {doctor.fee || 500}
            </strong>
          </div>

          {/* Booking navigation CTA */}
          {slotDateTime ? (
            <Link
              to="/booking"
              state={{
                doctorId: doctor.id,
                slotId: `${doctor.id}-${slotDateTime.toISOString()}`,
                slotDateTime: slotDateTime.toISOString(),
                visitType: mode,
                fee: doctor.fee || 500,
                currency: doctor.currency || 'ETB',
                doctorName: doctor.name
              }}
              className="btn btn-primary dd-cta"
            >
              Continue to booking
            </Link>
          ) : (
            <button type="button" className="btn btn-primary dd-cta" disabled>
              Select a time to continue
            </button>
          )}
        </div>
      </div>
    </section>
  )
}