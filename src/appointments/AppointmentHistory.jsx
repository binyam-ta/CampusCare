import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faClock, faVideo, faHospital } from '@fortawesome/free-solid-svg-icons'

import { appointmentsLoaded, appointmentCancelled } from './appointmentsSlice.js'
import { fetchAppointments } from '../api/client.js'
import './Appointments.css'

const VISIT_LABEL = { video: 'Video visit', 'in-person': 'In-person visit' }

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

const byDate = (a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime)

export default function AppointmentHistory() {
  // --------------------------------------------------------------------------
  // 1. REDUX STORE INTEGRATION (`store`, `useDispatch`, `useSelector`)
  // --------------------------------------------------------------------------
  const dispatch = useDispatch()
  const items = useSelector((state) => state.appointments.items)
  const status = useSelector((state) => state.appointments.status)

  // --------------------------------------------------------------------------
  // 2. QUERY PARAMETERS
  // --------------------------------------------------------------------------
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'upcoming'

  const setTab = (tab) => {
    if (tab === 'upcoming') {
      searchParams.delete('filter')
    } else {
      searchParams.set('filter', tab)
    }
    setSearchParams(searchParams)
  }

  // --------------------------------------------------------------------------
  // 3. ASYNC INITIAL DATA FETCHING (`useEffect`)
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true

    async function loadInitialAppointments() {
      if (status === 'idle') {
        try {
          const apptsFromData = await fetchAppointments()
          if (isMounted) {
            // Populate Redux store with data fetched from data.json
            dispatch(appointmentsLoaded(apptsFromData))
          }
        } catch (err) {
          console.error('Failed to load appointments from data.json', err)
        }
      }
    }

    loadInitialAppointments()

    return () => {
      isMounted = false
    }
  }, [status, dispatch])

  // --------------------------------------------------------------------------
  // 4. MEMOIZED PARTITIONING & SORTING (`useMemo`)
  // --------------------------------------------------------------------------
  const upcoming = useMemo(() => {
    const now = new Date()
    return items
      .filter((a) => a.status === 'scheduled' && new Date(a.slotDateTime) >= now)
      .sort(byDate)
  }, [items])

  const past = useMemo(() => {
    const now = new Date()
    return items
      .filter((a) => !(a.status === 'scheduled' && new Date(a.slotDateTime) >= now))
      .sort(byDate)
      .reverse()
  }, [items])

  const list = filter === 'past' ? past : upcoming

  // Derives badge label and styling variant
  const getBadge = (a) => {
    if (a.status === 'cancelled') return { key: 'cancelled', label: 'Cancelled' }
    if (a.status === 'completed') return { key: 'completed', label: 'Completed' }
    const now = new Date()
    const isFuture = a.status === 'scheduled' && new Date(a.slotDateTime) >= now
    return isFuture ? { key: 'scheduled', label: 'Scheduled' } : { key: 'completed', label: 'Past' }
  }

  // Dispatches cancellation action to the Redux store
  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(appointmentCancelled(id))
    }
  }

  return (
    <section className="screen">
      <h1 className="screen-title">My Appointments</h1>

      {/* Tabs */}
      <div className="appt-tabs" role="tablist" aria-label="Appointment categories">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'upcoming'}
          className={'btn ' + (filter === 'upcoming' ? 'btn-primary' : 'btn-secondary')}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'past'}
          className={'btn ' + (filter === 'past' ? 'btn-primary' : 'btn-secondary')}
          onClick={() => setTab('past')}
        >
          Past ({past.length})
        </button>
      </div>

      {/* Empty State */}
      {list.length === 0 ? (
        <div className="appt-empty">
          <FontAwesomeIcon icon={faCalendarDays} />
          <h2>{filter === 'past' ? 'No past appointments' : 'No upcoming appointments'}</h2>
          <p>
            {filter === 'past'
              ? 'Your completed and cancelled clinic visits will show up here.'
              : 'Find a doctor and book your next campus clinic visit.'}
          </p>
          {filter !== 'past' && (
            <Link to="/doctors" className="btn btn-primary">
              Find a doctor
            </Link>
          )}
        </div>
      ) : (
        /* Appointment Cards List */
        <ul className="appt-list">
          {list.map((a) => {
            const badge = getBadge(a)
            return (
              <li key={a.id} className="appt-card">
                <div className="appt-top">
                  <span className="appt-icon">
                    <FontAwesomeIcon icon={a.visitType === 'video' ? faVideo : faHospital} />
                  </span>
                  <div className="appt-who">
                    <h3>{a.doctorName || `Doctor #${a.doctorId}`}</h3>
                    {a.department && <p className="appt-dept">{a.department}</p>}
                  </div>
                  <span className={`appt-badge appt-badge-${badge.key}`}>{badge.label}</span>
                </div>

                <div className="appt-details">
                  <p>
                    <FontAwesomeIcon icon={faCalendarDays} /> {fmtDate(a.slotDateTime)}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faClock} /> {fmtTime(a.slotDateTime)}
                    {a.visitType && ` · ${VISIT_LABEL[a.visitType] || a.visitType}`}
                  </p>
                </div>

                <div className="appt-actions">
                  {badge.key === 'scheduled' ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleCancel(a.id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <Link to={`/doctors/${a.doctorId}`} className="btn btn-primary">
                      Book again
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}