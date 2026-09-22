import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { store } from './store.js'
import { router } from './router.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import './index.css'

// Provider nesting order matters:
// 1. Redux Provider — makes the store available to all components
// 2. AuthProvider — makes auth context (student, signIn, signOut) available
// 3. RouterProvider — activates the route tree from router.jsx
//    (Layout.jsx is the root route element, NOT App.jsx)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)
