import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  // Initialize state from localStorage or fallback
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err)
      return initialValue
    }
  })

  // Memoized setter that writes to both React state and localStorage
  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (err) {
        console.warn(`Error setting localStorage key "${key}":`, err)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

export default useLocalStorage
