import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import './Doctor.css'
import defaultDoctorPhoto from '../assets/images/dr-abebe-kebede.jpg'

export function DoctorCard({ doctor }) {
  // Graceful fallback if no doctor prop is passed
  if (!doctor) {
    return null
  }

  const {
    id,
    name,
    department,
    specialization,
    rating = 4.8,
    reviewCount = 0,
    yearsOfExperience = 5,
    photo = defaultDoctorPhoto,
    fee,
    currency = 'ETB'
  } = doctor

  return (
    <Link
      to={`/doctors/${id}`}
      className="doctor-card-link"
      aria-label={`View profile and schedule with ${name}, ${department}`}
    >
      <article className="doctor-card">
        {/* Clinician avatar photo */}
        <div className="doctor-avatar">
          <img
            className="doctor-img"
            src={photo}
            alt={name}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.onerror = null
              e.target.src = defaultDoctorPhoto
            }}
          />
        </div>

        {/* Clinician details */}
        <div className="doctor-info">
          <h3>{name}</h3>

          <p className="doctor-department">{department}</p>

          <p className="doctor-specialization">{specialization}</p>

          {/* Rating and review metrics */}
          <div className="doctor-rating">
            <FontAwesomeIcon icon={faStar} className="doctor-stars" />
            <span className="doctor-rating-value">{rating}</span>
            <span className="doctor-reviews">({reviewCount} reviews)</span>
          </div>

          {/* Experience and optional fee */}
          <p className="doctor-experience">
            <span>{yearsOfExperience} yrs experience</span>
            {fee && (
              <>
                <span>•</span>
                <span>{currency} {fee}</span>
              </>
            )}
          </p>
        </div>
      </article>
    </Link>
  )
}

// Support both default and named imports for flexible usage
export default DoctorCard
