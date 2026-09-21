# CampusCare Route Map

## Overview

Every route in CampusCare is rendered through a shared Layout wrapper that provides the top navigation bar, footer, and outlet for route content. Unauthenticated students can browse clinics and doctors but must sign in before they can submit a booking or view their appointment history. The router is configured with createBrowserRouter so that dynamic segments, query parameters, and protected routes are resolved through React Router's declarative API.

## Routes

### `/` — Home
- **Renders**: Home screen
- **Parameters**: None
- **Query String**: None consumed
- **Sign-in Required**: No
- **Behavior**: Landing page with clinic overview, emergency contact block, and two primary call-to-action buttons. The "Browse Doctors" button navigates to `/doctors` and the "My Appointments" button either routes to `/appointments` if the student is signed in or redirects to the sign-in flow with a return-to URL so the student lands in the history view immediately after authentication.

### `/doctors` — Doctor Directory
- **Renders**: DoctorDirectory screen, composing DepartmentFilter, search input, and a list of DoctorCard instances
- **Parameters**: None
- **Query String**: `dept` (string, optional) — the active department filter, e.g. `dept=psychiatry`. The DepartmentFilter component reads this value on mount and writes back to it when the student changes the selection, allowing deep links and back-button-safe navigation.
- **Sign-in Required**: No
- **Behavior**: Fetches the full doctor list on mount. An empty-state message is shown when no doctors match the combined department filter and search term. Each DoctorCard is an anchor that navigates to `/doctors/:id` using the clinician's unique id.

### `/doctors/:id` — Doctor Detail
- **Renders**: DoctorDetail screen with biography, specializations, and available time slots
- **Parameters**: `id` (string, required) — the doctor's unique identifier, used to fetch the specific doctor record and their associated appointment slots
- **Query String**: None consumed directly; however, the department context from the referring directory page can be surfaced in a breadcrumb if present in navigation state
- **Sign-in Required**: No for viewing; selecting a time slot requires sign-in before proceeding to the booking form
- **Behavior**: On mount, resolves the doctor by id and renders the profile. If the id does not match any doctor, a fallback 404 message is shown with a link back to the directory. Selecting an available time slot captures the slot datetime in local state. Clicking "Book this Slot" either advances directly to `/booking` with the doctor and slot carried in route state, or first prompts sign-in and then advances, preserving the selection.

### `/booking` — Booking Form
- **Renders**: BookingForm screen with read-only appointment summary and validated inputs for visit details
- **Parameters**: None
- **Query String**: None
- **Route State**: `doctorId`, `slotId`, and `slotDateTime` are expected to be present when arriving from DoctorDetail; if they are missing the form redirects back to the directory so the student always starts with a selected slot
- **Sign-in Required**: Yes — a route guard redirects unauthenticated visitors to the sign-in flow and returns them here after login
- **Behavior**: Validates the visit reason, notes length, and consent checkbox on both blur and submit. On submit, dispatches the appointment to the Redux store, posts to the mock backend, and navigates to `/booking/confirmation`, passing the new appointment id in route state for the confirmation view.

### `/booking/confirmation` — Booking Confirmation
- **Renders**: BookingConfirmation success screen with reference number, summary, and next-step links
- **Parameters**: None
- **Route State**: `appointmentId` and a cached copy of the appointment object are accepted; the view first reads from the appointments store by id and falls back to the cached state to guard against store hydration timing
- **Sign-in Required**: Yes — route guard enforces a signed-in student so the confirmation is always scoped to the booking student
- **Behavior**: Renders the confirmation code, appointment metadata, and action buttons for calendar export and jumping to `/appointments`. After ten seconds of inactivity the screen offers a gentle prompt to return home, but does not redirect automatically.

### `/appointments` — Appointment History
- **Renders**: AppointmentHistory screen, lazy-loaded via React.lazy and Suspense to keep the initial bundle lean
- **Parameters**: None
- **Query String**: `filter` (string, optional) — accepts `upcoming` or `past` to pre-select the active tab; defaults to `upcoming` on first load
- **Sign-in Required**: Yes — the route guard redirects anonymous visitors to sign-in with a return-to URL pointing here
- **Behavior**: Subscribes to the global appointments slice and filters rows by the signed-in student's id. The view splits into two tabs, upcoming and past, and each row exposes actions appropriate to its status. Cancel and reschedule actions route the student back to `/booking` with the relevant doctor and slot pre-populated.

### `/signin` — Sign-in
- **Renders**: SignIn screen (session authentication entry point)
- **Parameters**: None
- **Query String**: `redirectTo` (string, optional) — the path to visit after a successful sign-in; defaults to `/appointments` when not provided
- **Sign-in Required**: No — this route is explicitly open so anonymous students can authenticate
- **Behavior**: On successful authentication via the auth context, resolves the redirect target and navigates there. A student who is already signed in and reaches this route by accident is bounced directly to the redirect target.

### `*` — 404 Not Found
- **Renders**: NotFound catch-all screen
- **Parameters**: None
- **Sign-in Required**: No
- **Behavior**: Displays a friendly "page not found" message with a link back to the Home screen.

## Route Guard Summary

Protected routes — `/booking`, `/booking/confirmation`, and `/appointments` — are wrapped in a single RequireAuth route element that consults the authentication context. When a student is not signed in, the guard records the current location on the context, navigates to `/signin?redirectTo=…`, and restores the recorded location after a successful login. The public routes `/`, `/doctors`, `/doctors/:id`, and `/signin` always remain accessible so students can research providers before committing to sign in.
