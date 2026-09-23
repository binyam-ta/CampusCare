import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowLeft, faPersonCircleCheck, faMoneyBills, faClock, faStar, faStarOfLife, faVideo, faPerson  } from '@fortawesome/free-solid-svg-icons';

import doctorPhoto from '../assets/images/dr-abebe-kebede.jpg'
import './DoctorDetail.css'

/* ------------------------------------------------------------------
   MOCK DATA: replace with an API call (e.g. getDoctorById(id)) later.
   Keep the same field names so the JSX below keeps working.
------------------------------------------------------------------- */
const MOCK_DOCTORS = {
  1: {
    id: '1',
    name: 'Dr. Abebe Kebede',
    department: 'Internal Medicine',
    education: 'MD, Addis Ababa University',
    hospital: 'CampusCare Health Center',
    yearsOfExperience: 12,
    rating: 4.9,
    reviewCount: 182,
    fee: 500,
    currency: 'ETB',
    durationMinutes: 30,
    modes: ['video', 'in-person'],
    languages: ['Amharic', 'Afaan Oromo', 'English'],
    photo: doctorPhoto,
    about:
      'Dr. Abebe provides thoughtful, evidence-based primary care with a focus on prevention, chronic conditions, and long-term wellbeing. He takes time to explain each diagnosis and treatment plan in plain language.',
  },
}
// Any other id falls back to the same mock doctor so every card in your list opens something.
const getMockDoctor = (id) => MOCK_DOCTORS[id] ?? { ...MOCK_DOCTORS[1], id: String(id) }

/* Mock availability: next 7 days, fixed time grid, some slots "booked". */
const TIMES = ['09:00', '09:30', '10:30', '11:30', '14:00', '15:30', '16:00', '17:00']
const isBooked = (dayIndex, timeIndex) => (dayIndex * 3 + timeIndex) % 4 === 3

const fmtTime = (hhmm) =>
  new Date(`1970-01-01T${hhmm}:00`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

const MODE_LABEL = { video: 'Video visit', 'in-person': 'In-person' }



export default function DoctorDetail() {
  const { id } = useParams()
  const doctor = getMockDoctor(id)

  const days = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d
    })
  }, [])

  const [dayIndex, setDayIndex] = useState(0)
  const [time, setTime] = useState(null)
  const [mode, setMode] = useState(doctor.modes[0])

  const selectedDay = days[dayIndex]
  const slotDateTime = useMemo(() => {
    if (!time) return null
    const [h, m] = time.split(':').map(Number)
    const d = new Date(selectedDay)
    d.setHours(h, m, 0, 0)
    return d
  }, [selectedDay, time])

  const pickDay = (i) => {
    setDayIndex(i)
    setTime(null) // times differ per day, so clear the old choice
  }

  const longDate = selectedDay.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const shortSelection = slotDateTime
    ? `${selectedDay.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })} · ${fmtTime(time)}`
    : null

  return (
    <section className="screen dd">
      <Link to="/doctors" className="dd-back">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to doctors
      </Link>

      <div className="dd-layout">
        {/* ---------- Left column: who the doctor is ---------- */}
        <div className="dd-profile">
          <header className="dd-hero">
            <img className="dd-photo" src={doctor.photo} alt={doctor.name} />
            <div className="dd-hero-text">
              <h1 className="dd-name">{doctor.name}</h1>
              <p className="dd-dept">{doctor.department}</p>
              <p className="dd-meta">
                {doctor.education}
                <br />
                {doctor.yearsOfExperience} years of experience
              </p>
              <p className="dd-rating" aria-label={`Rated ${doctor.rating} out of 5 from ${doctor.reviewCount} reviews`}>
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
                {doctor.currency} {doctor.fee}
              </strong>
              <span>Visit fee</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faClock} />
              <strong>{doctor.durationMinutes} min</strong>
              <span>Duration</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faPersonCircleCheck} />
              <strong>{doctor.modes.map((m) => (m === 'video' ? 'Video' : 'In-person')).join(' & ')}</strong>
              <span>Available</span>
            </li>
          </ul>

          <div className="dd-block">
            <h2 className="dd-h2">About</h2>
            <p className="dd-about">{doctor.about}</p>
            <ul className="dd-chips" aria-label="Languages spoken">
              {doctor.languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="dd-hospital">
              <FontAwesomeIcon icon={faStarOfLife} /> {doctor.hospital}
            </p>
          </div>
        </div>

        {/* ---------- Right column: pick a time ---------- */}
        <div className="dd-booking">
          <h2 className="dd-h2">Select an appointment</h2>

          {doctor.modes.length > 1 && (
            <div className="dd-modes" role="group" aria-label="Visit type">
              {doctor.modes.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`dd-mode ${mode === m ? 'is-active' : ''}`}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m === 'video' ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faPerson} />}
                  {/* <Icon name={m === 'video' ? 'video' : 'clinic'} size={16} /> */}
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
          )}

          <div className="dd-days" role="group" aria-label="Choose a date">
            {days.map((d, i) => (
              <button
                key={d.toISOString()}
                type="button"
                className={`dd-day ${i === dayIndex ? 'is-active' : ''}`}
                aria-pressed={i === dayIndex}
                onClick={() => pickDay(i)}
              >
                <span>{i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <strong>{d.getDate()}</strong>
              </button>
            ))}
          </div>

          <p className="dd-slot-caption">
            {longDate} · {MODE_LABEL[mode]}
          </p>

          <div className="dd-times" role="group" aria-label="Choose a time">
            {TIMES.map((t, ti) => {
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

          <div className="dd-summary" aria-live="polite">
            <div>
              <span className="dd-summary-label">Your selection</span>
              <strong>{shortSelection ?? 'Pick a time slot'}</strong>
            </div>
            <strong className="dd-summary-price">
              {doctor.currency} {doctor.fee}
            </strong>
          </div>

          {/* Booking data goes to BookingForm via ROUTE STATE (not Redux);
              BookingForm reads it with useLocation().state. */}
          {slotDateTime ? (
            <Link
              to="/booking"
              state={{
                doctorId: doctor.id,
                slotId: `${doctor.id}-${slotDateTime.toISOString()}`,
                slotDateTime: slotDateTime.toISOString(),
                visitType: mode,
                fee: doctor.fee,
                currency: doctor.currency,
                doctorName: doctor.name,
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