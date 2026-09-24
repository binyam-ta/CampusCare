import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faClock,
  faHourglassHalf,
  faCircleCheck,
  faCircleXmark,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import { doctor, patients, appointments } from './doctorDashboardData'
import './DoctorDashboard.css'

/* UI only: nothing here fetches data or saves anything.
   Buttons are placeholders for the developer who wires up the real logic. */

const STATUS_LABEL = { scheduled: 'Scheduled', completed: 'Completed', cancelled: 'Cancelled' }

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const byDate = (a, b) => new Date(a.slotDateTime) - new Date(b.slotDateTime)
const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

function StatusBadge({ status }) {
  return <span className={`dash-badge dash-badge-${status}`}>{STATUS_LABEL[status]}</span>
}

function StatCard({ icon, value, label, danger = false }) {
  return (
    <div className="dash-card dash-stat">
      <span className={'dash-stat-icon' + (danger ? ' dash-stat-icon-danger' : '')}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <strong className="dash-stat-value">{value}</strong>
      <span className="dash-stat-label">{label}</span>
    </div>
  )
}

// One row in the Today / Upcoming lists
function AppointmentItem({ a, variant }) {
  const date = new Date(a.slotDateTime)
  const [time, period] = fmtTime(a.slotDateTime).split(' ')

  return (
    <li className="dash-item">
      <div className="dash-item-lead">
        {variant === 'today' ? (
          <>
            <strong>{time}</strong>
            <span>{period}</span>
          </>
        ) : (
          <>
            <strong>{date.getDate()}</strong>
            <span>{date.toLocaleDateString('en-US', { month: 'short' })}</span>
          </>
        )}
      </div>
      <div className="dash-item-body">
        <h3>{a.patient.fullName}</h3>
        <p>{a.reason}</p>
        {variant === 'upcoming' && (
          <p className="dash-item-when">
            {date.toLocaleDateString('en-US', { weekday: 'short' })} · {fmtTime(a.slotDateTime)}
          </p>
        )}
      </div>
      {variant === 'today' && <StatusBadge status={a.status} />}
    </li>
  )
}

export default function DoctorDashboard() {
  // Numbers are worked out from the mock arrays, so they stay consistent
  // when real data replaces them.
  const startOfTomorrow = new Date()
  startOfTomorrow.setHours(24, 0, 0, 0)
  const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString()

  const todayList = appointments.filter((a) => isToday(a.slotDateTime)).sort(byDate)
  const upcomingList = appointments
    .filter((a) => a.status === 'scheduled' && new Date(a.slotDateTime) >= startOfTomorrow)
    .sort(byDate)
  const tableRows = [...appointments].sort(byDate).reverse() // newest first
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
    .slice(0, 5)

  const count = (status) => appointments.filter((a) => a.status === status).length
  const total = appointments.length

  const overview = [
    { key: 'scheduled', label: 'Scheduled', value: count('scheduled') },
    { key: 'completed', label: 'Completed', value: count('completed') },
    { key: 'cancelled', label: 'Cancelled', value: count('cancelled') },
  ]

  const todayText = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className="screen dash">
      {/* Header */}
      <header className="dash-header">
        <h1 className="screen-title">Doctor Dashboard</h1>
        <p className="dash-welcome">
          Welcome back, {doctor.name}. You have {todayList.length}{' '}
          {todayList.length === 1 ? 'appointment' : 'appointments'} today.
        </p>
        <p className="dash-date">{todayText}</p>
      </header>

      {/* Summary cards */}
      <div className="dash-stats">
        <StatCard icon={faCalendarDays} value={total} label="Total Appointments" />
        <StatCard icon={faClock} value={todayList.length} label="Today's Appointments" />
        <StatCard icon={faHourglassHalf} value={upcomingList.length} label="Upcoming Appointments" />
        <StatCard icon={faCircleCheck} value={count('completed')} label="Completed Appointments" />
        <StatCard icon={faCircleXmark} value={count('cancelled')} label="Cancelled Appointments" danger />
        <StatCard icon={faUserGroup} value={patients.length} label="Total Patients" />
      </div>

      {/* Today + status overview */}
      <div className="dash-row dash-row-wide-left">
        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Today&apos;s Appointments</h2>
            <span>{todayList.length} total</span>
          </div>
          {todayList.length === 0 ? (
            <p className="dash-empty">No appointments scheduled for today.</p>
          ) : (
            <ul className="dash-list">
              {todayList.map((a) => (
                <AppointmentItem key={a.id} a={a} variant="today" />
              ))}
            </ul>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Status Overview</h2>
            <span>{total} appointments</span>
          </div>
          <div className="dash-bar" aria-hidden="true">
            {overview.map((o) => (
              <span
                key={o.key}
                className={`dash-bar-${o.key}`}
                style={{ width: `${(o.value / total) * 100}%` }}
              />
            ))}
          </div>
          <ul className="dash-legend">
            {overview.map((o) => (
              <li key={o.key}>
                <span className={`dash-dot dash-bar-${o.key}`} />
                <span className="dash-legend-label">{o.label}</span>
                <strong>{o.value}</strong>
                <span className="dash-legend-pct">{Math.round((o.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Appointments table */}
      <div className="dash-card dash-table-card">
        <div className="dash-card-head">
          <h2>All Appointments</h2>
          <span>{tableRows.length} total</span>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Reason for visit</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((a) => (
                <tr key={a.id}>
                  <td data-label="Patient" className="dash-cell-name">{a.patient.fullName}</td>
                  <td data-label="Phone">{a.patient.phone}</td>
                  <td data-label="Email" className="dash-cell-email">{a.patient.email}</td>
                  <td data-label="Reason">{a.reason}</td>
                  <td data-label="Date">{fmtDate(a.slotDateTime)}</td>
                  <td data-label="Time">{fmtTime(a.slotDateTime)}</td>
                  <td data-label="Status"><StatusBadge status={a.status} /></td>
                  <td data-label="Actions">
                    <div className="dash-actions">
                      <button type="button" className="btn btn-secondary">View</button>
                      {a.status === 'scheduled' && (
                        <button type="button" className="btn btn-primary">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming + recent patients */}
      <div className="dash-row">
        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Upcoming Appointments</h2>
            <span>{upcomingList.length} scheduled</span>
          </div>
          {upcomingList.length === 0 ? (
            <p className="dash-empty">No upcoming appointments.</p>
          ) : (
            <ul className="dash-list">
              {upcomingList.map((a) => (
                <AppointmentItem key={a.id} a={a} variant="upcoming" />
              ))}
            </ul>
          )}
        </div>

        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Recent Patients</h2>
            <span>Last 5</span>
          </div>
          <ul className="dash-list">
            {recentPatients.map((p) => (
              <li key={p.id} className="dash-item">
                <span className="dash-avatar">{initials(p.fullName)}</span>
                <div className="dash-item-body">
                  <h3>{p.fullName}</h3>
                  <p>{p.lastReason}</p>
                </div>
                <div className="dash-item-side">
                  <span>{fmtDate(p.lastVisit)}</span>
                  <span>{p.totalVisits} {p.totalVisits === 1 ? 'visit' : 'visits'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}