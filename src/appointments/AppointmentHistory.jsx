import { useSearchParams, Link } from 'react-router-dom'

export default function AppointmentHistory() {
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

  return (
    <section className="screen">
      <h1 className="screen-title">Appointment History</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button className={'btn ' + (filter === 'upcoming' ? 'btn-primary' : 'btn-secondary')} onClick={() => setTab('upcoming')}>
          Upcoming
        </button>
        <button className={'btn ' + (filter === 'past' ? 'btn-primary' : 'btn-secondary')} onClick={() => setTab('past')}>
          Past
        </button>
      </div>

      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          <p>This is the appointment history screen (lazy-loaded).</p>
          <p>Current tab: <strong>{filter}</strong></p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/booking" className="btn btn-primary">Go to /booking</Link>
            {' '}
            <Link to="/" className="btn btn-secondary">Back home</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
