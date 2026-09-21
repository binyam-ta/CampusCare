import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function SignIn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, student } = useAuth()

  if (student) {
    const redirectTo = searchParams.get('redirectTo') || '/appointments'
    navigate(redirectTo, { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    signIn({})
    const redirectTo = searchParams.get('redirectTo') || '/appointments'
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="screen" style={{ maxWidth: 440, margin: '0 auto' }}>
      <h1 className="screen-title">Sign In</h1>
      <p className="screen-subtitle">
        Route: <code>/signin</code>
        {searchParams.get('redirectTo') && <> · Query: <code>redirectTo={searchParams.get('redirectTo')}</code></>}
      </p>
      <div className="screen-body" style={{ borderRadius: '10px' }}>
        <div>
          <p>This is the sign-in screen.</p>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Sign in (demo, no credentials)
            </button>
          </form>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            <Link to="/">&larr; Return home</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
