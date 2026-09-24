import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './Home.jsx'
import DoctorDirectory from './doctors/DoctorDirectory.jsx'
import DoctorDetail from './doctors/DoctorDetail.jsx'
import BookingForm from './booking/BookingForm.jsx'
import BookingConfirmation from './booking/BookingConfirmation.jsx'
import SignIn from './auth/SignIn.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import NotFound from './NotFound.jsx'

// Lazy-load AppointmentHistory to demonstrate performance optimization & code-splitting
const AppointmentHistory = lazy(() =>
  import('./appointments/AppointmentHistory.jsx').then((module) => ({
    default: module.default
  }))
)

// Fallback spinner/placeholder while lazy route chunks download
function LazyFallback() {
  return (
    <section className="screen">
      <h1 className="screen-title">Loading...</h1>
      <div className="screen-body" style={{ borderRadius: 10, padding: '2rem', textAlign: 'center' }}>
        Fetching your appointment records...
      </div>
    </section>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'doctors',
        element: <DoctorDirectory />
      },
      {
        path: 'doctors/:id',
        element: <DoctorDetail />
      },
      {
        path: 'booking',
        element: (
          <RequireAuth>
            <BookingForm />
          </RequireAuth>
        )
      },
      {
        path: 'booking/confirmation',
        element: (
          <RequireAuth>
            <BookingConfirmation />
          </RequireAuth>
        )
      },
      {
        path: 'appointments',
        element: (
          <RequireAuth>
            <Suspense fallback={<LazyFallback />}>
              <AppointmentHistory />
            </Suspense>
          </RequireAuth>
        )
      },
      {
        path: 'signin',
        element: <SignIn />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export default router
