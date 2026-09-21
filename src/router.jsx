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
