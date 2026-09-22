import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function BookingForm() {
  const location = useLocation()
  const navigate = useNavigate()
  // These values arrive via React Router ROUTE STATE, passed by DoctorDetail
  // when the user clicks the booking link: <Link to="/booking" state={{ doctorId, slotId, slotDateTime }}>
  const { doctorId, slotId, slotDateTime } = location.state || {}

  const handleConfirm = () => {
    navigate('/booking/confirmation', {
      state: {
        appointmentId: 'demo-appt-' + Date.now(),
        appointment: { doctorId, slotId, slotDateTime, status: 'scheduled' }
      }
    })
  }

  return (
    <section className="screen">
      <h1 className="screen-title">Booking Form</h1>
      <p className="screen-subtitle">
        Route: <code>/booking</code> · Protected: <strong>yes</strong>
      </p>
      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          <p>This is the booking form screen.</p>
          {doctorId && (
            <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>
              Route state: <code>doctorId={doctorId}, slotId={slotId}</code>
            </p>
          )}
          {!doctorId && (
            <p style={{ marginTop: '0.5rem', color: '#b91c1c' }}>
              Missing route state — visit /doctors/:id first, or click below.
            </p>
          )}
          <p style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={handleConfirm}>
              Confirm booking → /booking/confirmation
            </button>
            {' '}
            <Link to="/doctors" className="btn btn-secondary">Back to /doctors</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
