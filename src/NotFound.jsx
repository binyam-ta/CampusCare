import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="screen" style={{ textAlign: 'center' }}>
      <h1 className="screen-title" style={{ fontSize: '2.5rem' }}>404</h1>
      <p className="screen-subtitle">
        We couldn't find the page you were looking for.
      </p>
      <div className="screen-body" style={{ borderRadius: 10 }}>
        <div>
          <p>The route may have changed, or the page may be temporarily unavailable.</p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/" className="btn btn-primary">Back to home</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
