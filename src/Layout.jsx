import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar.jsx'
import { Footer } from './Footer.jsx'

export default function Layout() {
  return (
    <div className="layout">
      {/* Header section with accessible navigation bar */}
      <header className="layout-header">
        <Navbar />
      </header>

      {/* Main content viewport where nested route components mount */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Shared clinic footer */}
      <Footer />
    </div>
  )
}