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
import DoctorDashboard from './doctor-dashboard/Doctordashboard.jsx'

// AppointmentHistory is lazy-loaded — it's only fetched when the user navigates
// to /appointments. This keeps it out of the initial JS bundle.
const AppointmentHistory = lazy(() =>
  import('./appointments/AppointmentHistory.jsx')
    .then((module) => ({ default: module.default }))
)

function LazyFallback() {
  return (
    <section className="screen">
      <h1 className="screen-title">Loading...</h1>
      <div className="screen-body" style={{ borderRadius: 10 }}>
        Fetching your appointment history.
      </div>
    </section>
  )
}

// All routes are children of Layout (navbar + footer + <Outlet />).
// Protected routes are wrapped in <RequireAuth> which redirects to /signin if unauthenticated.
// Public: /, /doctors, /doctors/:id, /signin, *
// Protected: /booking, /booking/confirmation, /appointments
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
        path: 'doctor-dashboard',
        element: <DoctorDashboard />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])
