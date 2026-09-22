import DoctorCard from './DoctorCard.jsx'

// `doctors` prop: array of doctor objects.
// Will be passed by DoctorDirectory after it fetches from the API and filters.
// Not imported/rendered by any parent yet — DoctorDirectory still uses placeholder UI.
export default function DoctorList({ doctors }) {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="screen-body" style={{ borderRadius: '10px' }}>
        No doctors match your current filters.
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1rem'
    }}>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  )
}
