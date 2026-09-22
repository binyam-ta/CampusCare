# CampusCare — Project Guide

A quick-reference map of how the codebase fits together so you don't have to
reverse-engineer it file by file.

> **Status note:** The project is in a scaffold / wireframe stage. The routing
> structure, auth flow, and state management plumbing are all in place, but many
> page components are placeholder screens that will be fleshed out. Some utility
> files (like `client.js`) have been written but aren't wired up to components
> yet. This guide calls out which connections are live vs. planned.

---

## 1. Entry Point & Boot Sequence

```
index.html
  └─ src/main.jsx            ← JS entry point (loaded via Vite)
       ├─ <Provider>         ← makes the Redux store available to all components
       ├─ <AuthProvider>     ← makes auth context (user, signIn, signOut) available
       └─ <RouterProvider>   ← activates the route tree defined in router.jsx
```

`main.jsx` is the single entry point. It wraps everything in three nested providers:

| Provider | Source | Purpose |
|---|---|---|
| `<Provider store={store}>` | `react-redux` | Gives components access to the Redux store |
| `<AuthProvider>` | `auth/AuthContext.jsx` | Provides current user, sign in/out functions |
| `<RouterProvider router={router}>` | `react-router-dom` | Activates the client-side route tree |

> [!NOTE]
> `App.jsx` exists but is **not used** by `main.jsx`. The main entry point uses
> `RouterProvider` directly, and the router uses `Layout.jsx` as the root route
> element. `App.jsx` is essentially dead code right now.

---

## 2. Folder Map

```
src/
├── api/                    ← Shared API utilities
│   └── client.js           ← Fetch wrapper with get/post/patch helpers
│                              ⚠ Written but NOT imported by any component yet
│
├── auth/                   ← Authentication (React Context, NOT Redux)
│   ├── AuthContext.jsx     ← AuthProvider + useAuth hook + buildSignInRedirectUrl
│   ├── RequireAuth.jsx     ← Route guard for protected pages
│   └── SignIn.jsx          ← Sign-in form (currently mock, no real credentials)
│
├── doctors/                ← Doctor browsing feature
│   ├── DoctorDirectory.jsx ← Page: lists departments + links to doctor detail
│   ├── DoctorDetail.jsx    ← Page: single doctor view + "Book" button
│   ├── DoctorList.jsx      ← Renders an array of DoctorCards
│   │                          ⚠ Defined but NOT imported by any component yet
│   ├── DoctorCard.jsx      ← Single doctor card (links to /doctors/:id)
│   │                          ⚠ Only imported by DoctorList (which isn't used yet)
│   └── DepartmentFilter.jsx ← Filter buttons (reads/writes ?dept query param)
│
├── booking/                ← Booking flow
│   ├── BookingForm.jsx     ← Page: reads route state, has "Confirm" button
│   └── BookingConfirmation.jsx ← Page: shows confirmation ID from route state
│
├── appointments/           ← Appointment management (Redux slice)
│   ├── appointmentsSlice.js ← Redux slice with sync actions (no async thunks yet)
│   │                          ⚠ Actions exported but NOT dispatched by any component yet
│   └── AppointmentHistory.jsx ← Page: upcoming/past tabs (lazy-loaded)
│
├── hooks/                  ← Shared custom hooks
│   ├── useDebounce.js      ← Debounces a value (for search inputs)
│   └── useLocalStorage.js  ← useState backed by localStorage
│                              ⚠ Both defined but NOT used by any component yet
│
├── ui/                     ← Shared UI primitives
│   ├── Button.jsx          ← Styled button (primary/secondary variants)
│   └── Card.jsx            ← Generic card container with title/subtitle/footer
│                              ⚠ Both defined but NOT used by any component yet
│
├── main.jsx                ← JS entry point (Provider → AuthProvider → RouterProvider)
├── router.jsx              ← All route definitions (createBrowserRouter)
├── store.js                ← Redux store (one slice: appointments)
├── Layout.jsx              ← Shell: navbar + <Outlet /> + footer
├── Home.jsx                ← Landing page (placeholder)
├── NotFound.jsx            ← 404 catch-all
├── App.jsx                 ← ⚠ Dead code — not imported by main.jsx
└── index.css               ← Global styles
```

---

## 3. What `client.js` Does and Where It's Used

`api/client.js` is a thin wrapper around `fetch`. It provides these functions:

| Function | HTTP | Endpoint |
|---|---|---|
| `fetchDoctors(params)` | GET | `/doctors` (with optional `?department=`) |
| `fetchDoctor(id)` | GET | `/doctors/:id` |
| `fetchSlots(doctorId)` | GET | `/slots?doctorId=` |
| `fetchAppointments(studentId)` | GET | `/appointments?studentId=` |
| `createAppointment(payload)` | POST | `/appointments` |
| `cancelAppointment(id)` | PATCH | `/appointments/:id` |

The base URL defaults to `http://localhost:3001` (overridable via `VITE_API_BASE_URL`).

**Current status:** `client.js` is fully written and ready, but **no component imports
it yet**. The page components are still scaffolds. When fleshed out, `DoctorDirectory`
and `DoctorDetail` will use `fetchDoctors`/`fetchDoctor`/`fetchSlots`, and the
appointments flow will use `fetchAppointments`/`createAppointment`/`cancelAppointment`.

---

## 4. State Management — Three Strategies

The app uses **three different approaches** depending on the data:

| Data | Strategy | Where defined | Why |
|---|---|---|---|
| **Auth / current user** | React Context | `auth/AuthContext.jsx` | Simple object read in many places; doesn't need Redux |
| **Appointments** | Redux slice | `appointments/appointmentsSlice.js` | Shared across booking + history; survives navigation |
| **Booking slot** | React Router route state | Passed via `navigate(path, { state })` | Transient, only needed during the booking flow |
| **Doctors** | *(not yet implemented)* | Will be local state or Redux | Directory page will fetch on mount |

### Redux store shape

```js
// store.js — only one slice is registered
{
  appointments: {
    items: [],        // array of appointment objects
    status: 'idle',   // 'idle' | 'succeeded'
    error: null
  }
}
```

The slice defines **synchronous actions** (no async thunks yet):
- `appointmentAdded` — pushes a new appointment (with auto-generated `id` and `createdAt`)
- `appointmentCancelled` — sets an appointment's status to `'cancelled'`
- `appointmentsLoaded` — replaces the items array (for hydrating from the API)

> [!IMPORTANT]
> **Doctors are NOT in Redux.** There is no doctors slice. When the directory is
> fully built, doctors will likely live in component-level `useState` (fetched on
> mount) or be added as a second Redux slice.

---

## 5. Component & Data Flow Map

### Route tree (from `router.jsx`)

```
<Layout>                              ← always rendered (navbar + footer + Outlet)
  ├── /              → Home
  ├── /doctors       → DoctorDirectory
  ├── /doctors/:id   → DoctorDetail
  ├── /booking       → RequireAuth → BookingForm          ← protected
  ├── /booking/confirmation → RequireAuth → BookingConfirmation  ← protected
  ├── /appointments  → RequireAuth → Suspense → AppointmentHistory  ← protected + lazy
  ├── /signin        → SignIn
  └── *              → NotFound
```

### Where DoctorList fits (currently unwired)

`DoctorList.jsx` is a presentational component that accepts a `doctors` array prop
and renders a `DoctorCard` for each. **It is not imported or rendered anywhere yet.**

The intended wiring (based on `route-map.md`) is:

```
json-server (db.json)
  │  HTTP GET /doctors
  ▼
api/client.js → fetchDoctors()
  │
  ▼  called on mount
doctors/DoctorDirectory.jsx
  │  stores result in useState
  │  filters by dept + search
  │
  ▼  <DoctorList doctors={filteredDoctors} />     ← THIS IMPORT DOESN'T EXIST YET
doctors/DoctorList.jsx
  │
  ▼  maps each to:
doctors/DoctorCard.jsx
```

Right now `DoctorDirectory` just renders hardcoded placeholder links.

---

## 6. Booking Data Flow (End to End)

Data passes through **React Router route state** (not Redux) from doctor selection
all the way to confirmation:

```
Step 1: DoctorDetail.jsx
  └─ <Link to="/booking" state={{ doctorId: id, slotId, slotDateTime }}>
     ↓ passes booking data via ROUTE STATE

Step 2: BookingForm.jsx
  ├─ const { doctorId, slotId, slotDateTime } = useLocation().state
  │  (reads the data that DoctorDetail passed via route state)
  └─ navigate('/booking/confirmation', {
       state: { appointmentId: 'demo-appt-...', appointment: {...} }
     })
     ↓ passes confirmation data via ROUTE STATE

Step 3: BookingConfirmation.jsx
  └─ const { appointmentId } = useLocation().state
     (reads the ID that BookingForm passed)
```

> [!TIP]
> **Why route state instead of Redux for slot data?** The slot selection is
> transient — it only matters during the booking flow and doesn't need to
> persist or be shared globally. Route state keeps it out of the Redux store and
> automatically clears on fresh navigation.

Note: The `BookingForm` currently generates a fake appointment ID (`'demo-appt-' + Date.now()`)
and doesn't dispatch to Redux or call the API. When fully built, it will dispatch
`appointmentAdded` and/or call `createAppointment` via `client.js`.

---

## 7. Authentication Flow

Auth is managed entirely through **React Context** — not Redux.

### What `AuthContext.jsx` provides

```js
// Everything available via useAuth():
{
  student,        // null when signed out, { id, name, email } when signed in
  signIn(profile), // sets the student (currently mocked — accepts anything)
  signOut(),       // sets student back to null
  requireSignIn()  // returns true/false
}
```

### Who uses `useAuth()`

| File | What it uses |
|---|---|
| `Layout.jsx` | `student` + `signOut` — toggles Sign In / Sign Out in the navbar |
| `RequireAuth.jsx` | `student` — redirects to /signin if null |
| `SignIn.jsx` | `signIn` + `student` — calls signIn on form submit |
| `DoctorDetail.jsx` | *(will use)* — to check auth before allowing booking |
| `BookingForm.jsx` | *(will use)* — to attach student ID to the appointment |

### The route guard pattern

Protected routes (`/booking`, `/booking/confirmation`, `/appointments`) are wrapped
in `<RequireAuth>` in `router.jsx`. When a user is not signed in:

```
User visits /booking (not signed in)
  → RequireAuth sees student === null
  → Builds redirect URL: /signin?redirectTo=/booking
  → <Navigate to="/signin?redirectTo=/booking" replace />

User submits sign-in form
  → signIn() sets the student in context
  → SignIn reads redirectTo from ?redirectTo=...
  → navigate('/booking', { replace: true })
  → Back on the protected page, now authenticated
```

Also: `buildSignInRedirectUrl(returnTo)` in `AuthContext.jsx` is a helper that
builds the `/signin?redirectTo=...` URL. `RequireAuth` uses it.

> [!NOTE]
> **Auth is mocked.** `signIn()` accepts any profile object (or `{}`) and fills
> in defaults. There are no real credentials, no token storage, no API call.

---

## 8. Route Table Quick Reference

| Path | Component | Auth? | Key data source | Query params |
|---|---|---|---|---|
| `/` | `Home` | No | — | — |
| `/doctors` | `DoctorDirectory` | No | Placeholder (will use `client.js`) | `?dept=` filters by department |
| `/doctors/:id` | `DoctorDetail` | No | `:id` from URL params | — |
| `/booking` | `BookingForm` | **Yes** | `useLocation().state` from DoctorDetail | — |
| `/booking/confirmation` | `BookingConfirmation` | **Yes** | `useLocation().state` from BookingForm | — |
| `/appointments` | `AppointmentHistory` | **Yes** | Placeholder (will use Redux) | `?filter=upcoming\|past` |
| `/signin` | `SignIn` | No | — | `?redirectTo=` for post-login redirect |
| `*` | `NotFound` | No | — | — |

---

## 9. The Mock Backend

The app is set up to use `json-server` as a mock API:

```bash
npm run server    # starts json-server on port 3001
```

- **`db.json`** at the project root is the mock database (**not yet created**)
- `client.js` defaults to `http://localhost:3001` via `VITE_API_BASE_URL`
- Expected endpoints: `/doctors`, `/slots`, `/appointments`

---

## 10. Files That Are Ready but Not Wired Up Yet

These files are fully written and waiting to be imported when the scaffolds are
fleshed out:

| File | What it does | Will be used by |
|---|---|---|
| `api/client.js` | Fetch wrapper (6 API functions) | `DoctorDirectory`, `DoctorDetail`, `BookingForm`, `AppointmentHistory` |
| `doctors/DoctorList.jsx` | Renders array of `DoctorCard`s | `DoctorDirectory` |
| `doctors/DoctorCard.jsx` | Single doctor card UI | `DoctorList` |
| `appointments/appointmentsSlice.js` | Redux actions for appointments | `BookingForm` (dispatch), `AppointmentHistory` (select) |
| `hooks/useDebounce.js` | Debounce a value | Search input in `DoctorDirectory` |
| `hooks/useLocalStorage.js` | `useState` backed by `localStorage` | TBD |
| `ui/Button.jsx` | Styled button component | Any component (replaces inline `className` buttons) |
| `ui/Card.jsx` | Generic card layout | Any component |

---

## 11. Quick Reference — "Where does X come from?"

| If you're looking at... | It comes from / goes to... |
|---|---|
| `DoctorList`'s `doctors` prop | **Not yet connected.** Will come from `DoctorDirectory` after it calls `fetchDoctors()` |
| `DoctorCard`'s `doctor` prop | `DoctorList` maps the array and passes each item |
| `DoctorDetail`'s `:id` param | URL via `useParams()` — set when user clicks a `/doctors/:id` link |
| `BookingForm`'s `doctorId`, `slotId`, etc. | `useLocation().state` — passed by `DoctorDetail` via `<Link state={...}>` |
| `BookingConfirmation`'s `appointmentId` | `useLocation().state` — passed by `BookingForm` via `navigate(path, { state })` |
| `Layout`'s auth state (`student`) | `useAuth()` hook → reads from `AuthContext` |
| `RequireAuth`'s redirect URL | Built by `buildSignInRedirectUrl()` from `AuthContext.jsx` |
| `?dept=` query param | `DepartmentFilter` writes it via `setSearchParams`; `DoctorDirectory` reads it |
| `?filter=` query param | `AppointmentHistory` reads/writes it for upcoming/past tabs |
| `?redirectTo=` query param | `RequireAuth` writes it; `SignIn` reads it after login |
| `api/client.js` functions | **Not imported anywhere yet.** Ready for when pages are built out |
| Redux `appointmentAdded` action | **Not dispatched anywhere yet.** Will be used by `BookingForm` |
