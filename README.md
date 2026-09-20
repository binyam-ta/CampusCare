### CampusCare

A student clinic booking application built to streamline how students find and schedule medical appointments on campus. 

####  The User Journey
This application is designed around a specific student journey:
* **Home Screen:** High-level clinic information, emergency contacts, and primary call-to-action buttons.
* **Doctor Directory (/doctors):** Displays available doctors, complete with the DepartmentFilter, search capabilities, and individual DoctorCard components
* **Doctor Detail (/doctors/:id):** Dynamic route showcasing specific doctor bios, specializations, and available time slots..
* **Booking Form (/booking):** Validated scheduling form where students pick appointment slots and enter visit details.
* **Booking Confirmation:** Success screen displaying appointment metadata and confirmation details.
* **Appointment History (/appointments):** Lazy-loaded view displaying all upcoming and past scheduled appointments.

####  Tech Stack
* **Frontend Framework:** React (bootstrapped with Vite)
* **Routing:** React Router DOM
* **State Management:** React Local State & Redux Toolkit (for shared appointment state)
* **Mock Backend:** `json-server` for REST API endpoints

####  Architecture

* Local State: Form fields, validation error messages, and active UI tab triggers.
* URL State: Selected department filter parameters (e.g.,dept=psychiatry) and dynamic route IDs (/doctors/:id).
* Shared State: Global appointments state to synchronize newly booked appointments with the history view.
* Session State: Authentication context tracking the active student profile and login status

The project is organized by feature domain rather than file type:

```text
src/
|-- api/
|-- hooks/
|-- ui/
|-- doctors/
|   |-- DepartmentFilter.jsx
|   |-- DoctorList.jsx
|   `-- DoctorCard.jsx
|-- booking/
|   `-- BookingForm.jsx
|-- appointments/
|   `-- AppointmentHistory.jsx
|-- auth/
|-- App.jsx
`-- Layout.jsx

#### Getting Started

1. Installation
Install the dependencies from the project root:
```
npm install
```
2. Run the Mock Database
Start the JSON server to serve the mock API on port 3000:

```
npm run server
```
3. Run the Development Server
In a separate terminal window, start the Vite development server:

```
npm run dev
```


