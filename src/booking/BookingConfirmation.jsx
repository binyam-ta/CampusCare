import { useLocation, Link } from 'react-router-dom'
import './Booking.css'

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const MODE_LABEL = { video: 'Video visit', 'in-person': 'In-person visit' }

export default function BookingConfirmation() {
  const location = useLocation()
  // Arrives via ROUTE STATE from BookingForm:
  // navigate('/booking/confirmation', { state: { appointmentId, appointment } })
  const { appointmentId, appointment } = location.state || {}

  if (!appointmentId || !appointment) {
    return (
      <section className="screen bk">
        <div className="bk-empty">
          <h1 className="bk-title">Nothing to show here</h1>
          <p>We couldn&apos;t find a recent booking. You can review your bookings in appointments.</p>
          <Link to="/appointments" className="btn btn-primary bk-cta">
            Go to appointments
          </Link>
        </div>
      </section>
    )
  }

  const { doctorName, doctorId, slotDateTime, visitType, fee, currency, patient } = appointment

  return (
    <section className="screen bk bk-done">
      <div className="bk-success" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="bk-title bk-center">Booking confirmed</h1>
      <p className="bk-sub bk-center">
        Your appointment with {doctorName || `doctor #${doctorId}`} is scheduled.
      </p>

      <div className="bk-card bk-receipt">
        <dl>
          <div>
            <dt>Date</dt>
            <dd>{fmtDate(slotDateTime)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{fmtTime(slotDateTime)}</dd>
          </div>
          {visitType && (
            <div>
              <dt>Visit type</dt>
              <dd>{MODE_LABEL[visitType] ?? visitType}</dd>
            </div>
          )}
          {patient?.fullName && (
            <div>
              <dt>Patient</dt>
              <dd>{patient.fullName}</dd>
            </div>
          )}
          {fee != null && (
            <div>
              <dt>Visit fee</dt>
              <dd>
                {currency} {fee}
              </dd>
            </div>
          )}
          <div>
            <dt>Confirmation ID</dt>
            <dd className="bk-ref">{appointmentId}</dd>
          </div>
        </dl>
      </div>

      <div className="bk-actions">
        <Link to="/appointments" className="btn btn-primary bk-cta">
          View my appointments
        </Link>
        <Link to="/" className="btn btn-secondary bk-cta">
          Back home
        </Link>
      </div>
    </section>
  )
}