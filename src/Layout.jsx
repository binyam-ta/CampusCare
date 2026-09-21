import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function Layout() {
  const { student, signOut } = useAuth()

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="brand">CampusCare</div>
        <nav className="layout-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/appointments">My Appointments</NavLink>
          {student ? (
            <NavLink to="/" onClick={(e) => { e.preventDefault(); signOut() }}>Sign out</NavLink>
          ) : (
            <NavLink to="/signin">Sign in</NavLink>
          )}
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        Campus Health Center · Student Clinic Booking Service
      </footer>
    </div>
  )
}
