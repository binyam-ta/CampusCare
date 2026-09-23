import { useState } from 'react'
import { useNavigate, useSearchParams, Navigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStethoscope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from './AuthContext.jsx'
import './SignIn.css'

export default function SignIn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, student } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Only allow redirects to pages inside the app (must start with a single "/").
  const requested = searchParams.get('redirectTo')
  const redirectTo =
    requested && requested.startsWith('/') && !requested.startsWith('//')
      ? requested
      : '/appointments'

  // Already signed in: <Navigate> redirects safely (calling navigate() during render is not allowed)
  if (student) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const found = {}
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = 'Enter a valid email address.'
    if (!password) found.password = 'Enter your password.'
    setErrors(found)
    if (Object.keys(found).length) return

    signIn({ email: email.trim() }) // demo: no real credential check yet
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="screen auth">
      <div className="auth-logo">
        <FontAwesomeIcon icon={faStethoscope} />
      </div>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">
        {requested
          ? 'Sign in to continue.'
          : 'Sign in to book and manage your appointments.'}
      </p>

      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="auth-error" role="alert">{errors.email}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <div className="auth-password">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.password && <p className="auth-error" role="alert">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary auth-submit">
          Sign in
        </button>

        <p className="auth-note">Demo mode: any email and password will work.</p>
      </form>

      <p className="auth-back">
        <Link to="/">&larr; Return home</Link>
      </p>
    </section>
  )
}