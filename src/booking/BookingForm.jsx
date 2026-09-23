import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
// Adjust this path to wherever your slice lives
import { appointmentAdded } from '../appointments/appointmentsSlice'
import './Booking.css'

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const MODE_LABEL = { video: 'Video visit', 'in-person': 'In-person visit' }

function validate(v, forSelf) {
  const e = {}
  if (v.fullName.trim().length < 2) {
    e.fullName = forSelf ? 'Enter your full name.' : "Enter the patient's full name."
  }
  if (!/^\+?[0-9\s-]{9,15}$/.test(v.phone.trim())) {
    e.phone = 'Enter a valid phone number, e.g. 0911 234 567.'
  }
  if (v.email.trim() && !/^\S+@\S+\.\S+$/.test(v.email.trim())) {
    e.email = 'Enter a valid email address, or leave it empty.'
  }
  if (v.reason.trim().length < 5) {
    e.reason = 'Tell the doctor briefly why you are visiting.'
  }
  return e
}

export default function BookingForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Values arrive via ROUTE STATE, passed by DoctorDetail's <Link to="/booking" state={...}>.
  const { doctorId, slotId, slotDateTime, doctorName, visitType, fee, currency } =
    location.state || {}

  const [forSelf, setForSelf] = useState(true)
  const [values, setValues] = useState({ fullName: '', phone: '', email: '', reason: '' })
  const [errors, setErrors] = useState({})

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values, forSelf)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`bk-${first}`)?.focus()
      return
    }
    const appointmentId = 'demo-appt-' + Date.now()
    const appointment = {
      id: appointmentId,
      doctorId,
      slotId,
      slotDateTime,
      doctorName,
      visitType,
      fee,
      currency,
      patient: { ...values, forSelf },
      status: 'scheduled',
    }

    dispatch(appointmentAdded(appointment)) // saves it so /appointments can list it
    navigate('/booking/confirmation', { state: { appointmentId, appointment } })
  }

  if (!doctorId || !slotDateTime) {
    return (
      <section className="screen bk">
        <div className="bk-empty">
          <h1 className="bk-title">No appointment selected</h1>
          <p>Choose a doctor and a time slot first, then continue to booking.</p>
          <Link to="/doctors" className="btn btn-primary bk-cta">
            Find a doctor
          </Link>
        </div>
      </section>
    )
  }

  const field = (name, label, props = {}) => (
    <div className="bk-field">
      <label htmlFor={`bk-${name}`}>{label}</label>
      {props.multiline ? (
        <textarea
          id={`bk-${name}`}
          name={name}
          rows={4}
          maxLength={300}
          value={values[name]}
          onChange={onChange}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `bk-${name}-err` : undefined}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          id={`bk-${name}`}
          name={name}
          type={props.type || 'text'}
          inputMode={props.inputMode}
          autoComplete={props.autoComplete}
          value={values[name]}
          onChange={onChange}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `bk-${name}-err` : undefined}
          placeholder={props.placeholder}
        />
      )}
      {errors[name] && (
        <p id={`bk-${name}-err`} className="bk-error" role="alert">
          {errors[name]}
        </p>
      )}
      {props.multiline && <p className="bk-hint">{values[name].length}/300</p>}
    </div>
  )

  return (
    <section className="screen bk">
      <button type="button" className="bk-back" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h1 className="bk-title">Confirm your booking</h1>
      <p className="bk-sub">Check the details, then tell us who the visit is for.</p>

      <div className="bk-layout">
        {/* Appointment summary */}
        <aside className="bk-card bk-summary" aria-label="Appointment summary">
          <h2 className="bk-h2">Appointment</h2>
          <dl>
            <div>
              <dt>Doctor</dt>
              <dd>{doctorName || `Doctor #${doctorId}`}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{fmtDate(slotDateTime)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{fmtTime(slotDateTime)}</dd>
            </div>
            {visitType && (
              <div>
                <dt>Visit type</dt>
                <dd>{MODE_LABEL[visitType] ?? visitType}</dd>
              </div>
            )}
          </dl>
          {fee != null && (
            <p className="bk-total">
              <span>Visit fee</span>
              <strong>
                {currency} {fee}
              </strong>
            </p>
          )}
          <Link to={`/doctors/${doctorId}`} className="bk-link">
            Change time
          </Link>
        </aside>

        {/* Patient form */}
        <form className="bk-card bk-form" onSubmit={handleSubmit} noValidate>
          <h2 className="bk-h2">Patient details</h2>

          <div className="bk-seg" role="group" aria-label="Who is this visit for?">
            <button
              type="button"
              className={forSelf ? 'is-active' : ''}
              aria-pressed={forSelf}
              onClick={() => setForSelf(true)}
            >
              Myself
            </button>
            <button
              type="button"
              className={!forSelf ? 'is-active' : ''}
              aria-pressed={!forSelf}
              onClick={() => setForSelf(false)}
            >
              Someone else
            </button>
          </div>

          {field('fullName', forSelf ? 'Full name' : "Patient's full name", {
            autoComplete: forSelf ? 'name' : 'off',
          })}
          {field('phone', 'Phone number', {
            type: 'tel',
            inputMode: 'tel',
            autoComplete: 'tel',
            placeholder: '0911 234 567',
          })}
          {field('email', 'Email (optional)', {
            type: 'email',
            inputMode: 'email',
            autoComplete: 'email',
          })}
          {field('reason', 'Reason for visit', {
            multiline: true,
            placeholder: 'For example: recurring headaches for two weeks',
          })}

          <button type="submit" className="btn btn-primary bk-cta">
            Confirm booking
          </button>
        </form>
      </div>
    </section>
  )
}