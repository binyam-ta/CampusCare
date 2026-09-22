import { useLocation, Link } from 'react-router-dom'

export default function BookingConfirmation() {
  const location = useLocation()
  // appointmentId arrives via ROUTE STATE, passed by BookingForm after
  // the user confirms. BookingForm does: navigate('/booking/confirmation', { state: { appointmentId, appointment } })
  const { appointmentId } = location.state || {}

  return (
    <section className="screen">
      <h1 className="screen-title">Booking Confirmation</h1>
      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          <p>This is the booking confirmation screen.</p>
          {appointmentId && (
            <p style={{ marginTop: '0.5rem', color: '#047857' }}>
              Confirmation ID: <code>{appointmentId}</code>
            </p>
          )}
          <p style={{ marginTop: '1rem' }}>
            <Link to="/appointments" className="btn btn-primary">Go to /appointments</Link>
            {' '}
            <Link to="/" className="btn btn-secondary">Back home</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
