import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'
import { Footer } from './Footer.jsx'

export default function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <Navbar />
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}