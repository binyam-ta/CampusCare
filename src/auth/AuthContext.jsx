import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createSearchParams } from 'react-router-dom'
import { fetchMockUsers } from '../api/client.js'

// Key used to persist session across page reloads
const AUTH_STORAGE_KEY = 'campuscare_auth_session'

// Create the AuthContext
const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  // `useState` #1: Active student session (null if anonymous/guest)
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.error('Failed to parse auth session from localStorage', e)
      return null
    }
  })

  // `useState` #2: Mock users list loaded from data.json
  const [mockUsers, setMockUsers] = useState([])

  // `useState` #3: Auth initialization loading state
  const [isLoading, setIsLoading] = useState(true)

  // `useEffect`: Fetch mock users from data.json on initial app mount
  useEffect(() => {
    let isMounted = true
    async function loadUsers() {
      try {
        const users = await fetchMockUsers()
        if (isMounted) {
          setMockUsers(users)
        }
      } catch (err) {
        console.error('Failed to load mock users for auth', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])


  const signIn = ({ email, password }) => {
    const cleanEmail = email?.trim().toLowerCase()
    
    // Look for matching user in data.json
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    )

    let profile
    if (found) {
      // If found in data.json, verify password if provided
      if (password && found.password && found.password !== password) {
        return { success: false, message: 'Invalid password. (Demo password: password123)' }
      }
      profile = {
        id: found.id,
        name: found.name,
        email: found.email,
        studentId: found.studentId,
        phone: found.phone || '0911 234 567',
        role: found.role || 'student'
      }
    } else {
      // In demo mode, accept any valid email format
      const generatedName = cleanEmail.split('@')[0]
        .replace('.', ' ')
        .replace(/^[a-z]/, (c) => c.toUpperCase())
      
      profile = {
        id: `stu-${Date.now()}`,
        name: generatedName || 'Student User',
        email: cleanEmail,
        studentId: `UGR/${Math.floor(1000 + Math.random() * 9000)}/14`,
        phone: '0911 234 567',
        role: 'student'
      }
    }

    setStudent(profile)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile))
    } catch (e) {
      console.warn('Could not persist session to localStorage', e)
    }

    return { success: true, student: profile }
  }

  /**
   * Quick 1-click Demo Login for effortless pairing / testing.
   */
  const signInAsDemo = () => {
    const demoUser = mockUsers[0] || {
      id: 'stu-0001',
      name: 'Eyob Mekonnen',
      email: 'eyob@campus.edu',
      studentId: 'UGR/1234/14',
      phone: '0911 234 567',
      role: 'student'
    }
    return signIn({ email: demoUser.email, password: demoUser.password || 'password123' })
  }

  /**
   * Sign Out function.
   * Clears state and removes cached session from localStorage.
   */
  const signOut = () => {
    setStudent(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (e) {
      console.warn('Could not clear session from localStorage', e)
    }
  }

  /**
   * Mock Sign Up function to register a new student account.
   */
  const signUp = ({ name, email, password, studentId, phone }) => {
    const newProfile = {
      id: `stu-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: studentId?.trim() || `UGR/${Math.floor(1000 + Math.random() * 9000)}/14`,
      phone: phone?.trim() || '0911 000 000',
      role: 'student'
    }
    setStudent(newProfile)
    setMockUsers((prev) => [...prev, { ...newProfile, password }])
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile))
    } catch (e) {
      console.warn('Could not persist session to localStorage', e)
    }
    return { success: true, student: newProfile }
  }

  /**
   * Simple check if student is authenticated.
   */
  const requireSignIn = () => {
    return student !== null
  }

  // `useMemo`: Memoize the context value object so consumers don't re-render unless values change
  const value = useMemo(
    () => ({
      student,
      isLoading,
      mockUsers,
      signIn,
      signInAsDemo,
      signOut,
      signUp,
      requireSignIn
    }),
    [student, isLoading, mockUsers]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to consume the AuthContext safely.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Helper to construct a URL with a redirectTo query parameter.
 */
export function buildSignInRedirectUrl(returnTo) {
  const params = { redirectTo: returnTo || '/appointments' }
  return `/signin?${createSearchParams(params)}`
}
