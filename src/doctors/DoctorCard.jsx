// import { Link } from 'react-router-dom'

// export default function DoctorCard({ doctor }) {
//   return (
//     
//   )
// }
import { Link } from 'react-router-dom'
import './Doctor.css'
import drAbebeImg from '../assets/images/dr-abebe-kebede.jpg'

export function DoctorCard() {
  return (
    <Link to="/doctors/1" className="doctor-card-link">
      <article className="doctor-card">

        <div className="doctor-avatar">
          <img
            className="doctor-img"
            src={drAbebeImg}
            alt="Dr. Abebe Kebede"
          />
        </div>

        <div className="doctor-info">
          <h3>Dr. Abebe Kebede</h3>

          <p className="doctor-department">
            Cardiology
          </p>

          <p className="doctor-specialization">
            Interventional Cardiology
          </p>

          <div className="doctor-rating">
            <span className="doctor-stars">★</span>
            <span className="doctor-rating-value">4.8</span>
            <span className="doctor-reviews">
              (124 reviews)
            </span>
          </div>

          <p className="doctor-experience">
            Cardiology <span>•</span> 8 years
          </p>
        </div>

      </article>
    </Link>
  )
}
