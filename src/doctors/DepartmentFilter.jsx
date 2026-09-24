import './Doctor.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function DepartmentFilter({
  departments = [],
  activeDepartment = null,
  onDepartmentChange,
  searchTerm = '',
  onSearchChange,
  onSearchClear
}) {
  return (
    <div className="Filter">
      {/* 
        Doctor Name Search Bar:
        Allows users to filter doctors by name in real time.
      */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctors by name (e.g. Abebe, Sarah, Selam)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Filter doctors by name"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={onSearchClear}
            title="Clear doctor search"
            style={{ background: 'transparent', color: '#6b7280' }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}

        <button
          type="button"
          onClick={() => {}}
          aria-label="Submit search"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      {/* 
        Department Filter Buttons:
        Toggles between 'All' and specific medical departments.
      */}
      <div className="Filter-buttons" role="group" aria-label="Filter by department">
        <button
          type="button"
          className={'btn ' + (activeDepartment ? 'btn-secondary' : 'btn-primary')}
          onClick={() => onDepartmentChange(null)}
          aria-pressed={!activeDepartment}
        >
          All Departments
        </button>

        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            className={'btn ' + (activeDepartment === dept ? 'btn-primary' : 'btn-secondary')}
            onClick={() => onDepartmentChange(dept)}
            aria-pressed={activeDepartment === dept}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  )
}
