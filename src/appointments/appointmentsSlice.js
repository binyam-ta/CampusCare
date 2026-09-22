import { createSlice } from '@reduxjs/toolkit'

// Redux slice for appointment data. Registered in store.js as state.appointments.
// Provides sync actions: appointmentAdded, appointmentCancelled, appointmentsLoaded.
// NOTE: These actions are exported but NOT dispatched by any component yet —
// the booking/history pages are still scaffolds. When built out:
//   - BookingForm will dispatch appointmentAdded
//   - AppointmentHistory will dispatch appointmentsLoaded (after fetching from API)
const initialState = {
  items: [],
  status: 'idle',
  error: null
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    appointmentAdded: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare(payload) {
        return {
          payload: {
            id: payload.id || crypto?.randomUUID?.() || String(Date.now()),
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            ...payload
          }
        }
      }
    },
    appointmentCancelled(state, action) {
      const item = state.items.find(a => a.id === action.payload)
      if (item) {
        item.status = 'cancelled'
      }
    },
    appointmentsLoaded(state, action) {
      state.items = action.payload
      state.status = 'succeeded'
    }
  }
})

export const { appointmentAdded, appointmentCancelled, appointmentsLoaded } = appointmentsSlice.actions
export default appointmentsSlice.reducer
