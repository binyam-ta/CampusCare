import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { appointmentAdded } from '../appointments/appointmentsSlice'
import './Booking.css'

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const MODE_LABEL = { video: 'Video visit', 'in-person': 'In-person visit' }

export default function BookingForm() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { doctorId, slotId, slotDateTime, doctorName, visitType, fee, currency } =
    location.state || {}

  const [forSelf, setForSelf] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: '', phone: '', email: '', reason: '' },
  })

  const reasonText = watch('reason') || ''

  // 1. Correct onSubmit handler
  const onSubmit = (data) => {
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
      patient: { ...data, forSelf },
      status: 'scheduled',
    }

    dispatch(appointmentAdded(appointment))
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

  // 2. Helper receiving name, label, rules, and props
  const field = (name, label, rules = {}, props = {}) => (
    <div className="bk-field">
      <label htmlFor={`bk-${name}`}>{label}</label>
      {props.multiline ? (
        <textarea
          id={`bk-${name}`}
          rows={4}
          maxLength={300}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `bk-${name}-err` : undefined}
          placeholder={props.placeholder}
          {...register(name, rules)}
        />
      ) : (
        <input
          id={`bk-${name}`}
          type={props.type || 'text'}
          inputMode={props.inputMode}
          autoComplete={props.autoComplete}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `bk-${name}-err` : undefined}
          placeholder={props.placeholder}
          {...register(name, rules)}
        />
      )}
      {errors[name] && (
        <p id={`bk-${name}-err`} className="bk-error" role="alert">
          {errors[name].message}
        </p>
      )}
      {props.multiline && <p className="bk-hint">{reasonText.length}/300</p>}
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

        {/* 3. Pass onSubmit into handleSubmit */}
        <form className="bk-card bk-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

          {/* 4. Correct 3rd argument (rules) and 4th argument (props) */}
          {field(
            'fullName',
            forSelf ? 'Full name' : "Patient's full name",
            {
              required: forSelf ? 'Enter your full name.' : "Enter the patient's full name.",
              minLength: { value: 2, message: 'Name must be at least 2 characters.' },
            },
            { autoComplete: forSelf ? 'name' : 'off' }
          )}

          {field(
            'phone',
            'Phone number',
            {
              required: 'Enter a valid phone number, e.g. 0911 234 567.',
              pattern: {
                value: /^\+?[0-9\s-]{9,15}$/,
                message: 'Enter a valid phone number, e.g. 0911 234 567.',
              },
            },
            { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '0911 234 567' }
          )}

          {field(
            'email',
            'Email (optional)',
            {
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address, or leave it empty.',
              },
            },
            { type: 'email', inputMode: 'email', autoComplete: 'email' }
          )}

          {field(
            'reason',
            'Reason for visit',
            {
              required: 'Tell the doctor briefly why you are visiting.',
              minLength: { value: 5, message: 'Tell the doctor briefly why you are visiting.' },
            },
            { multiline: true, placeholder: 'For example: recurring headaches for two weeks' }
          )}

          <button type="submit" className="btn btn-primary bk-cta">
            Confirm booking
          </button>
        </form>
      </div>
    </section>
  )
}