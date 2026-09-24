import { Link } from 'react-router-dom'
import './Doctor.css'
import drAbebeImg from '../assets/images/dr-abebe-kebede.jpg'

export function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/dr-${doctor.id}`}
      className="doctor-card-link"
    >
      <article className="doctor-card">

        <div className="doctor-avatar">
          <img
            className="doctor-img"
            src={drAbebeImg}
            alt={doctor.name}
          />
        </div>

        <div className="doctor-info">
          <h3>{doctor.name}</h3>

          <p className="doctor-department">
            {doctor.department}
          </p>

          <p className="doctor-specialization">
            {doctor.specialization}
          </p>

          <div className="doctor-rating">
            <span className="doctor-stars">★</span>
            <span className="doctor-rating-value">
              {doctor.rating}
            </span>
            <span className="doctor-reviews">
              ({doctor.reviews} reviews)
            </span>
          </div>

          <p className="doctor-experience">
            {doctor.department} <span>•</span> {doctor.experience} years
          </p>
        </div>

      </article>
    </Link>
  )
}