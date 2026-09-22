import { Outlet, NavLink } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'

export default function Layout() {

  return (
    <div className="layout">
      <header className="layout-header">
        <Navbar />
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
