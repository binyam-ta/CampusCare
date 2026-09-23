import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faClock, faVideo, faHospital } from '@fortawesome/free-solid-svg-icons'
// Adjust this path to wherever your slice lives
import { appointmentsLoaded, appointmentCancelled } from './appointmentsSlice'
import './Appointments.css'

/* ------------------------------------------------------------------
   MOCK DATA: replace with an API fetch later.
   Same shape as what BookingForm dispatches via appointmentAdded.
------------------------------------------------------------------- */
const at = (daysFromNow, hour, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const MOCK_APPOINTMENTS = [
  { id: 'mock-1', doctorId: '1', doctorName: 'Dr. Abebe Kebede', department: 'Internal Medicine', visitType: 'video', slotDateTime: at(2, 15, 30), fee: 500, currency: 'ETB', status: 'scheduled' },
  { id: 'mock-2', doctorId: '2', doctorName: 'Dr. Selam Tesfaye', department: 'Pediatrics', visitType: 'in-person', slotDateTime: at(6, 10, 30), fee: 600, currency: 'ETB', status: 'scheduled' },
  { id: 'mock-3', doctorId: '1', doctorName: 'Dr. Abebe Kebede', department: 'Internal Medicine', visitType: 'in-person', slotDateTime: at(-12, 9), fee: 500, currency: 'ETB', status: 'completed' },
  { id: 'mock-4', doctorId: '3', doctorName: 'Dr. Hanna Bekele', department: 'Dermatology', visitType: 'video', slotDateTime: at(-30, 14), fee: 450, currency: 'ETB', status: 'cancelled' },
]

const VISIT_LABEL = { video: 'Video visit', 'in-person': 'In-person visit' }

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const byDate = (a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime)

export default function AppointmentHistory() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.appointments.items)
  const status = useSelector((state) => state.appointments.status)

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

  // Stand-in for the API call. Keeps anything already booked this session.
  useEffect(() => {
    if (status === 'idle') {
      dispatch(appointmentsLoaded([...items, ...MOCK_APPOINTMENTS]))
    }
  }, [status, items, dispatch])

  const now = new Date()
  const isUpcoming = (a) => a.status === 'scheduled' && new Date(a.slotDateTime) >= now

  const upcoming = items.filter(isUpcoming).sort(byDate)
  const past = items.filter((a) => !isUpcoming(a)).sort(byDate).reverse()
  const list = filter === 'past' ? past : upcoming

  const getBadge = (a) => {
    if (a.status === 'cancelled') return { key: 'cancelled', label: 'Cancelled' }
    if (a.status === 'completed') return { key: 'completed', label: 'Completed' }
    return isUpcoming(a)
      ? { key: 'scheduled', label: 'Scheduled' }
      : { key: 'completed', label: 'Past' }
  }

  const handleCancel = (id) => {
    if (window.confirm('Cancel this appointment?')) {
      dispatch(appointmentCancelled(id))
    }
  }

  return (
    <section className="screen">
      <h1 className="screen-title">My Appointments</h1>

      <div className="appt-tabs">
        <button
          className={'btn ' + (filter === 'upcoming' ? 'btn-primary' : 'btn-secondary')}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          className={'btn ' + (filter === 'past' ? 'btn-primary' : 'btn-secondary')}
          onClick={() => setTab('past')}
        >
          Past ({past.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="appt-empty">
          <FontAwesomeIcon icon={faCalendarDays} />
          <h2>{filter === 'past' ? 'No past appointments' : 'No upcoming appointments'}</h2>
          <p>
            {filter === 'past'
              ? 'Your completed and cancelled visits will show up here.'
              : 'Find a doctor and book your next visit.'}
          </p>
          {filter !== 'past' && (
            <Link to="/doctors" className="btn btn-primary">
              Find a doctor
            </Link>
          )}
        </div>
      ) : (
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
                    {a.visitType && ` · ${VISIT_LABEL[a.visitType]}`}
                  </p>
                </div>

                <div className="appt-actions">
                  {badge.key === 'scheduled' ? (
                    <button className="btn btn-secondary" onClick={() => handleCancel(a.id)}>
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