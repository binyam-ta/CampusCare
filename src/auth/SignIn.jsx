import { useState } from 'react'
import { useNavigate, useSearchParams, Navigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStarOfLife,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faUserCheck,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from './AuthContext.jsx'
import heroImage from '../assets/images/login-male3.jpg'
import './SignIn.css'

/**
 * Reusable brand logo component for the authentication screens.
 */
function Logo() {
  return (
    <div className="auth-logo">
      <FontAwesomeIcon icon={faStarOfLife} />
      <span>CampusCare</span>
    </div>
  )
}

export default function SignIn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, signInAsDemo, student } = useAuth()

  // `useState` hooks for input fields, password toggle, and error states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')

  // Resolve safe redirect destination
  const requested = searchParams.get('redirectTo')
  const redirectTo =
    requested && requested.startsWith('/') && !requested.startsWith('//')
      ? requested
      : '/appointments'

  // If already authenticated, redirect to destination
  if (student) {
    return <Navigate to={redirectTo} replace />
  }

  /**
   * Validates form inputs before invoking mock sign in
   */
  const validateForm = () => {
    const errs = {}
    if (!email.trim()) {
      errs.email = 'Please enter your student email address.'
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. name@campus.edu).'
    }

    if (!password) {
      errs.password = 'Please enter your password.'
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters.'
    }

    return errs
  }

  /**
   * Handles mock sign in form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    setAuthError('')

    const foundErrors = validateForm()
    setErrors(foundErrors)

    if (Object.keys(foundErrors).length > 0) {
      return
    }

    // Call mock auth signIn
    const result = signIn({ email: email.trim(), password })
    if (result.success) {
      navigate(redirectTo, { replace: true })
    } else {
      setAuthError(result.message || 'Authentication failed. Please verify credentials.')
    }
  }

  /**
   * Handles quick 1-click Demo Sign-In
   */
  const handleQuickDemo = () => {
    signInAsDemo()
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="screen auth">
      <div className="auth-shell">
        {/* Left hero banner panel */}
        <aside className="auth-hero">
          <img className="auth-hero-img" src={heroImage} alt="Campus medical professionals" />
          <div className="auth-hero-overlay" />
          <div className="auth-hero-top">
            <Logo />
          </div>
          <div className="auth-hero-bottom">
            <p className="auth-hero-text">
              Care feels better when everything is in one trusted place.
            </p>
            <p className="auth-hero-text2">
              Secure access to your campus clinic and doctor appointments.
            </p>
          </div>
        </aside>

        {/* Right form panel */}
        <div className="auth-panel">
          <Logo />

          <div className="auth-main">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              {requested
                ? 'Sign in to access your requested page.'
                : 'Sign in to book and manage your appointments.'}
            </p>

            {/* Quick Demo Sign In Button */}
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem'
                }}
                onClick={handleQuickDemo}
              >
                <FontAwesomeIcon icon={faUserCheck} />
                <span>Quick Sign-In as Demo Student (Eyob)</span>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '1rem 0',
                color: '#6b7280',
                fontSize: '0.8rem'
              }}
            >
              <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></span>
              <span>OR ENTER CREDENTIALS</span>
              <span style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></span>
            </div>

            {/* Global auth error feedback */}
            {authError && (
              <div
                style={{
                  padding: '0.6rem 0.8rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#b91c1c',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FontAwesomeIcon icon={faCircleExclamation} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email field */}
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="eyob@campus.edu or student@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="auth-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-password">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter password (e.g. password123)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
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
                {errors.password && (
                  <p className="auth-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me & forgot password */}
              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => alert('Demo hint: Use eyob@campus.edu with password123')}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button type="submit" className="btn btn-primary auth-submit">
                Sign in
              </button>
              <p className="auth-note">
                Mock Auth: Pre-seeded account is <strong>eyob@campus.edu</strong> / <strong>password123</strong>, or sign in with any valid email.
              </p>
            </form>
          </div>

          <div className="auth-footer">
            <p className="auth-switch">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: 0
                }}
                onClick={handleQuickDemo}
              >
                Sign in with demo account
              </button>
            </p>
            <p className="auth-secure">
              <FontAwesomeIcon icon={faShieldHalved} />
              Your health information is private, encrypted, and protected.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}