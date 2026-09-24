import { createSlice } from '@reduxjs/toolkit'

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
        state.items.unshift(action.payload)
      },
      prepare(payload) {
        return {
          payload: {
            id: payload.id || `appt-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            ...payload
          }
        }
      }
    },

    /**
     * Updates an appointment's status to 'cancelled'.
     */
    appointmentCancelled(state, action) {
      const appointmentId = action.payload
      const item = state.items.find((a) => a.id === appointmentId)
      if (item) {
        item.status = 'cancelled'
      }
    },

    /**
     * Hydrates the slice with appointments loaded from data.json.
     */
    appointmentsLoaded(state, action) {
      // Avoid duplicating appointments if items already exist
      const existingIds = new Set(state.items.map((i) => i.id))
      const newItems = action.payload.filter((item) => !existingIds.has(item.id))
      state.items = [...state.items, ...newItems]
      state.status = 'succeeded'
    }
  }
})

export const { appointmentAdded, appointmentCancelled, appointmentsLoaded } =
  appointmentsSlice.actions

export default appointmentsSlice.reducer
