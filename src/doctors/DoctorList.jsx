import DoctorCard from './DoctorCard.jsx'
import './Doctor.css'

export default function DoctorList({ doctors, searchTerm = '', onResetFilters }) {
  // Empty state handling when no doctors match the current search or filters
  if (!doctors || doctors.length === 0) {
    return (
      <div
        className="screen-body"
        style={{
          borderRadius: '10px',
          textAlign: 'center',
          padding: '2.5rem 1rem',
          background: '#fff',
          border: '1px solid #e4ebea'
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem', color: '#111827' }}>No doctors found</h3>
        <p style={{ color: '#6b7280', margin: '0 0 1rem', fontSize: '0.9rem' }}>
          {searchTerm
            ? `We couldn't find any doctor matching "${searchTerm}". Try checking the spelling or broadening your filter.`
            : 'No doctors are available under the selected department filter.'}
        </p>
        {onResetFilters && (
          <button type="button" className="btn btn-secondary" onClick={onResetFilters}>
            Clear all filters
          </button>
        )}
      </div>
    )
  }

  // Render the list of doctor cards
  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  )
}
