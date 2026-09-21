import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, buildSignInRedirectUrl } from './AuthContext.jsx'

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
