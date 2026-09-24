import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { appointmentAdded } from '../appointments/appointmentsSlice.js'
import { useAuth } from '../auth/AuthContext.jsx'
import './Booking.css'

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

const MODE_LABEL = { video: 'Video visit', 'in-person': 'In-person visit' }

/**
 * Validates form fields according to clinic requirements
 */
function validate(values, forSelf) {
  const errors = {}
  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName = forSelf ? 'Enter your full name.' : "Enter the patient's full name."
  }
  if (!/^\+?[0-9\s-]{9,15}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number, e.g. 0911 234 567.'
  }
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, or leave it empty.'
  }
  if (!values.reason.trim() || values.reason.trim().length < 5) {
    errors.reason = 'Briefly describe the reason for your visit (min 5 characters).'
  }
  return errors
}

export default function BookingForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { student } = useAuth()

  // Retrieve transient slot selection carried from DoctorDetail
  const { doctorId, slotId, slotDateTime, doctorName, visitType, fee, currency } =
    location.state || {}

  // --------------------------------------------------------------------------
  // 1. STATE MANAGEMENT (`useState`)
  // --------------------------------------------------------------------------
  const [forSelf, setForSelf] = useState(true)
  const [values, setValues] = useState({
    fullName: student?.name || '',
    phone: student?.phone || '0911 234 567',
    email: student?.email || '',
    reason: ''
  })
  const [errors, setErrors] = useState({})

  // Prefill details if student signs in or changes
  useEffect(() => {
    if (forSelf && student) {
      setValues((prev) => ({
        ...prev,
        fullName: student.name || prev.fullName,
        email: student.email || prev.email,
        phone: student.phone || prev.phone
      }))
    }
  }, [forSelf, student])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // --------------------------------------------------------------------------
  // 2. SUBMISSION & REDUX STORE DISPATCH (`store`, `dispatch`)
  // --------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault()
    const foundErrors = validate(values, forSelf)
    setErrors(foundErrors)

    const firstField = Object.keys(foundErrors)[0]
    if (firstField) {
      document.getElementById(`bk-${firstField}`)?.focus()
      return
    }

    const appointmentId = `appt-${Date.now()}`
    const appointment = {
      id: appointmentId,
      doctorId,
      slotId,
      slotDateTime,
      doctorName,
      visitType,
      fee: fee || 500,
      currency: currency || 'ETB',
      patient: { ...values, forSelf },
      status: 'scheduled'
    }

    // Dispatch action to Redux store so the booking persists in the user's history
    dispatch(appointmentAdded(appointment))

    // Forward to confirmation view passing route state
    navigate('/booking/confirmation', {
      state: { appointmentId, appointment }
    })
  }

  // Fallback if accessed directly without selecting a slot
  if (!doctorId || !slotDateTime) {
    return (
      <section className="screen bk">
        <div className="bk-empty">
          <h1 className="bk-title">No appointment selected</h1>
          <p>Please select a doctor and an appointment time slot first before booking.</p>
          <Link to="/doctors" className="btn btn-primary bk-cta">
            Find a doctor
          </Link>
        </div>
      </section>
    )
  }

  // Helper renderer for styled form fields
  const renderField = (name, label, props = {}) => (
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
      <p className="bk-sub">Review consultation details and provide visit information.</p>

      <div className="bk-layout">
        {/* Appointment summary card */}
        <aside className="bk-card bk-summary" aria-label="Appointment summary">
          <h2 className="bk-h2">Appointment Summary</h2>
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
              <span>Consultation Fee</span>
              <strong>
                {currency} {fee}
              </strong>
            </p>
          )}
          <Link to={`/doctors/${doctorId}`} className="bk-link">
            Change time slot
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

          {renderField('fullName', forSelf ? 'Full name' : "Patient's full name", {
            autoComplete: forSelf ? 'name' : 'off'
          })}
          {renderField('phone', 'Phone number', {
            type: 'tel',
            inputMode: 'tel',
            autoComplete: 'tel',
            placeholder: '0911 234 567'
          })}
          {renderField('email', 'Email (optional)', {
            type: 'email',
            inputMode: 'email',
            autoComplete: 'email'
          })}
          {renderField('reason', 'Reason for visit', {
            multiline: true,
            placeholder: 'For example: recurring headaches, sports injury, or health checkup'
          })}

          <button type="submit" className="btn btn-primary bk-cta">
            Confirm booking
          </button>
        </form>
      </div>
    </section>
  )
}