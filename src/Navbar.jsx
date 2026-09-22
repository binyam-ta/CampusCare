import { useState } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import { NavLink } from 'react-router-dom'
import './navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfLife, faHouse, faUserDoctor, faCalendarCheck, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons'


export function Navbar() {
    const { student, signOut } = useAuth()

    //controls whether the mobile navigation menu is open.
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    //toggle the mobile menu open/closed.
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    //close the mobile menu when a navigation link is clicked.
    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="brand">
                    <FontAwesomeIcon icon={faStarOfLife} className="brand-icon" />
                    <span>CampusCare</span>
                </div>
                <button
                    className={`burger-menu ${isMenuOpen ? 'is-open' : ''}`} onClick={toggleMenu}
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isMenuOpen}
                >
                    <span className="burger-bar"></span>
                    <span className="burger-bar"></span>
                    <span className="burger-bar"></span>
                </button>

                {/* Navigation links. On mobile this becomes a sliding menu.
                On tablet/desktop it becomes a normal horizontal navigation.
                */}
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
                        <NavLink to="/"
                            onClick={(e) => {
                                e.preventDefault()
                                signOut()
                                closeMenu()
                            }}
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <span>Sign out</span>
                        </NavLink>) : (
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