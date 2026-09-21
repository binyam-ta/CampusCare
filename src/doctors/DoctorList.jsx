import DoctorCard from './DoctorCard.jsx'

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
