import { useState } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import { NavLink } from 'react-router-dom'
import './navbar.css'


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
                <div className="brand">CampusCare</div>
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
                    <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/doctors" onClick={closeMenu}> Doctors</NavLink>
                    <NavLink to="/appointments" onClick={closeMenu}> My Appointments</NavLink>
                    {student ? (
                        <NavLink to="/"
                            onClick={(e) => {
                                e.preventDefault()
                                signOut()
                                closeMenu()
                            }}
                        >
                            Sign out
                        </NavLink>) : (
                        <NavLink to="/signin" onClick={closeMenu}>Sign in </NavLink>
                    )}
                </div>
            </nav>
        </div>
    )
}