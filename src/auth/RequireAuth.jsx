import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, buildSignInRedirectUrl } from './AuthContext.jsx'

// Route guard wrapping protected routes (/booking, /booking/confirmation, /appointments).
// If student is null, redirects to /signin?redirectTo=<current-path>.
// After sign-in, SignIn.jsx reads ?redirectTo and navigates back here.
export default function RequireAuth({ children }) {
  const { student } = useAuth()
  const location = useLocation()

  if (!student) {
    return (
      <Navigate
        to={buildSignInRedirectUrl(location.pathname + location.search)}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
