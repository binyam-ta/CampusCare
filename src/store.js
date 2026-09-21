import { configureStore } from '@reduxjs/toolkit'
import appointmentsReducer from './appointments/appointmentsSlice.js'

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer
  }
})
