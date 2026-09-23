import './Doctor.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function DepartmentFilter({ departments, activeDepartment, onDepartmentChange }) {
  return (
    <div className="Filter">
      <div className="search-bar">
        <input type="text" placeholder="Search for a doctor" />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <div className='Filter-buttons'>
        <button
          type="button"
          className={'btn ' + (activeDepartment ? 'btn-secondary' : 'btn-primary')}
          onClick={() => onDepartmentChange(null)}
        >
          All
        </button>
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            className={'btn ' + (activeDepartment === dept ? 'btn-primary' : 'btn-secondary')}
            onClick={() => onDepartmentChange(dept)}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  )
}
