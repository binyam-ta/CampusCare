### CampusCare

A student clinic booking application built to streamline how students find and schedule medical appointments on campus. 

####  The User Journey
This application is designed around a specific student journey:
* **Browse Doctors:** View a list of available campus clinic doctors.
* **Filter by Department:** Narrow down the doctor list by medical department.
* **Doctor Details:** Open a specific doctor's profile to view their information.
* **Book Appointment:** Choose an appointment slot and submit a validated booking form.
* **Confirmation:** View a success screen confirming the appointment.

####  Tech Stack
* **Frontend Framework:** React (bootstrapped with Vite)
* **Routing:** React Router DOM
* **State Management:** React Local State & Redux Toolkit (for shared appointment state)
* **Mock Backend:** `json-server` for REST API endpoints

####  Architecture
The project is organized by feature domain rather than file type:

```text
src/
|-- api/
|-- hooks/
|-- ui/
|-- doctors/
|-- booking/
|-- appointments/
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


