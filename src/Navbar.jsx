import { useState } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStarOfLife,
  faHouse,
  faUserDoctor,
  faCalendarCheck,
  faRightFromBracket,
  faRightToBracket,
  faUser
} from '@fortawesome/free-solid-svg-icons'

export function Navbar() {
  const { student, signOut } = useAuth()

  // Controls whether the mobile navigation menu drawer is open
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Toggle the mobile drawer
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // Close drawer on link navigation
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* Brand / Logo */}
        <NavLink to="/" className="brand" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
          <FontAwesomeIcon icon={faStarOfLife} className="brand-icon" />
          <span>CampusCare</span>
        </NavLink>

        {/* Mobile Hamburger Button */}
        <button
          className={`burger-menu ${isMenuOpen ? 'is-open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            <FontAwesomeIcon icon={faHouse} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/doctors" onClick={closeMenu}>
            <FontAwesomeIcon icon={faUserDoctor} />
            <span>Doctors</span>
          </NavLink>

          <NavLink to="/appointments" onClick={closeMenu}>
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>My Appointments</span>
          </NavLink>

          {student ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--color-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0 0.5rem'
                }}
                title={`Signed in as ${student.email}`}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>{student.name}</span>
              </span>

              <NavLink
                to="/"
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                  closeMenu()
                }}
                title="Sign out of CampusCare"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Sign out</span>
              </NavLink>
            </div>
          ) : (
            <NavLink to="/signin" onClick={closeMenu}>
              <FontAwesomeIcon icon={faRightToBracket} />
              <span>Sign in</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar