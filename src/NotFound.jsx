import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faHouse } from '@fortawesome/free-solid-svg-icons'

export default function NotFound() {
  return (
    <section className="notfound-screen">
      <div className="notfound-content">
        <FontAwesomeIcon
          icon={faCircleQuestion}
          style={{ fontSize: '3rem', color: 'var(--color-main)', marginBottom: '1rem' }}
        />
        <h1 className="notfound-title">404 - Page Not Found</h1>
        <p className="notfound-subtitle">
          We couldn&apos;t find the clinic page or service you were looking for.
        </p>
        <div className="notfound-body">
          <p>The route may have changed or the resource may be temporarily unavailable.</p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <FontAwesomeIcon icon={faHouse} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
