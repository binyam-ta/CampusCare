import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faEnvelope, faStarOfLife, faClock } from '@fortawesome/free-solid-svg-icons'
import { fetchClinicInfo } from './api/client.js'
import './Footer.css'

export function Footer() {
  const [clinic, setClinic] = useState({
    name: 'Campus Health Center',
    subtitle: 'Student Clinic Booking Service',
    phone: '+251 11 123 4567',
    emergencyPhone: '911 / 907 (Campus Security)',
    email: 'healthcenter@campus.edu',
    location: 'Campus Health Center, Building C, Main Campus',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM'
  })

  // Fetch clinic info from data.json on mount
  useEffect(() => {
    let isMounted = true
    async function loadInfo() {
      try {
        const info = await fetchClinicInfo()
        if (isMounted && info && Object.keys(info).length > 0) {
          setClinic((prev) => ({ ...prev, ...info }))
        }
      } catch (e) {
        console.warn('Could not fetch clinic info for footer', e)
      }
    }
    loadInfo()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="layout-footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faStarOfLife} className="brand-icon" />
            <h3>{clinic.name}</h3>
          </div>
          <p>{clinic.subtitle}</p>
          {clinic.emergencyPhone && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#f87171' }}>
              Emergency: {clinic.emergencyPhone}
            </p>
          )}
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Navigation</h4>
          <nav className="footer-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/doctors">Find Doctors</NavLink>
            <NavLink to="/appointments">My Appointments</NavLink>
            <NavLink to="/signin">Student Portal</NavLink>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact & Hours</h4>
          <div className="footer-contact">
            <span>
              <FontAwesomeIcon icon={faLocationDot} />
              {clinic.location}
            </span>
            <span>
              <FontAwesomeIcon icon={faPhone} />
              {clinic.phone}
            </span>
            <span>
              <FontAwesomeIcon icon={faEnvelope} />
              {clinic.email}
            </span>
            {clinic.hours && (
              <span>
                <FontAwesomeIcon icon={faClock} />
                {clinic.hours}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="footer-bottom">
        <p>© 2026 {clinic.name}. All rights reserved.</p>
        <p>University Student Healthcare & Clinic Scheduling Service</p>
      </div>
    </footer>
  )
}

export default Footer