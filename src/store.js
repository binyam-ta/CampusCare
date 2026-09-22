import { configureStore } from '@reduxjs/toolkit'
// appointments is the ONLY Redux slice. Doctors use component-local state,
// and auth uses React Context (see auth/AuthContext.jsx).
import appointmentsReducer from './appointments/appointmentsSlice.js'

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer
  }
})
