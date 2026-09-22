import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone, faEnvelope, faStarOfLife } from '@fortawesome/free-solid-svg-icons'
import './footer.css';

export function Footer() {
    return (
        <footer className="layout-footer">
            <div className="footer-content">

                {/* Brand */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <FontAwesomeIcon icon={faStarOfLife} className="brand-icon" />
                        <h3>Campus Health Center</h3>
                    </div>

                    <p>
                        Student Clinic Booking Service
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>

                    <nav className="footer-links">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/doctors">Doctors</NavLink>
                        <NavLink to="/appointments">About</NavLink>
                        <NavLink to="/contact">Contact</NavLink>
                    </nav>
                </div>

                {/* Contact */}
                <div className="footer-section">
                    <h4>Contact Us</h4>

                    <div className="footer-contact">

                        <span>
                            <FontAwesomeIcon icon={faLocationDot} />
                            Campus Health Center
                        </span>

                        <span>
                            <FontAwesomeIcon icon={faPhone} />
                            +251 XXX XXX XXX
                        </span>

                        <span>
                            <FontAwesomeIcon icon={faEnvelope} />
                            healthcenter@campus.edu
                        </span>

                    </div>
                </div>

            </div>

            {/* Bottom */}
            <div className="footer-bottom">
                <p>© 2026 Campus Health Center</p>
                <p>Student Clinic Booking Service</p>
            </div>
        </footer>
    )
}