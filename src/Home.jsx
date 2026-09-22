import { Link } from 'react-router-dom'
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowRight, faRunning, faHandDots, faHeadSideVirus } from '@fortawesome/free-solid-svg-icons';
import doctorImg from './assets/images/home-page-doctor.jpg'
import recommendedImg from './assets/images/recommended-doctor.jpg'
export default function Home() {
  return (
    <section className="screen">
      <div className='home-screen'>
        <h2 className='greetings'>GOOD MORNING, EYOB</h2>
        <h1 className="screen-title">How can we care for you today?</h1>
        <div className="screen-body">
          <div className="search-bar">
            <input type="text" placeholder="Find doctors or specialists" />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className='care-card'>
            <div>
              <h2>Care that fits your day</h2>
              <p>Book a trusted clinician in minutes,online or in person.</p>
              <span>Find a doctor <FontAwesomeIcon icon={faArrowRight} /></span>
            </div>
            <img src={doctorImg} alt='doctor' />
          </div>

          <div className="specialists-section">
            <h2>Specialists</h2>
            <div className="specialists-row">
              <div className="specialist-card">
                <FontAwesomeIcon icon={faHeadSideVirus} className="specialist-icon" />
                <h3>Psychiatry</h3>
                <p>12 specialists</p>
              </div>
              <div className="specialist-card">
                <FontAwesomeIcon icon={faHandDots} className="specialist-icon" />
                <h3>Dermatology</h3>
                <p>8 specialists</p>
              </div>
              <div className="specialist-card">
                <FontAwesomeIcon icon={faRunning} className="specialist-icon" />
                <h3>Sports Medicine</h3>
                <p>5 specialists</p>
              </div>
              {/* we can sdd more categories as needed or even fetch*/}
            </div>
          </div>

          <div className="recommended-section">
            <h2>Recommended for You</h2>
            <div className="doctor-card">
              <img src={recommendedImg} alt="Doctor" className="doctor-img" />
              <div className="doctor-info">
                <h3>Dr. Sarah Johnson</h3>
                <p>Dermatologist</p>
                <p>Expert in skin care and cosmetic treatments</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  )
}
