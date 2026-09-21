import { useParams, Link } from 'react-router-dom'

export default function DoctorDetail() {
  const { id } = useParams()

  return (
    <section className="screen">
      <p style={{ margin: 0, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
        <Link to="/doctors">&larr; Back to /doctors</Link>
      </p>
      <h1 className="screen-title">Doctor Detail</h1>
      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          <p>This is the doctor detail screen for doctor id: <strong>{id}</strong></p>
          <p style={{ marginTop: '1rem' }}>
            <Link
              to="/booking"
              state={{ doctorId: id, slotId: 'demo-slot', slotDateTime: new Date().toISOString() }}
              className="btn btn-primary"
            >
              Go to /booking (with route state)
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
