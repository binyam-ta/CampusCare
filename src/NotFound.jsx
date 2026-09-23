import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound-screen">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">
          We couldn't find the page you were looking for.
        </p>
        <div className="notfound-body">
          <p>The route may have changed, or the page may be temporarily unavailable.</p>
          <Link to="/" className="btn-back">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}
