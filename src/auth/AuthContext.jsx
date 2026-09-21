import { createContext, useContext, useMemo, useState } from 'react'
import { createSearchParams } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null)

  const signIn = (profile) => {
    setStudent({
      id: profile?.id || 'stu-0001',
      name: profile?.name || 'Demo Student',
      email: profile?.email || 'student@university.edu',
      ...profile
    })
  }

  const signOut = () => {
    setStudent(null)
  }

  const requireSignIn = () => {
    return student !== null
  }

  const value = useMemo(() => ({
    student,
    signIn,
    signOut,
    requireSignIn
  }), [student])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function buildSignInRedirectUrl(returnTo) {
  const params = { redirectTo: returnTo || '/appointments' }
  return `/signin?${createSearchParams(params)}`
}
