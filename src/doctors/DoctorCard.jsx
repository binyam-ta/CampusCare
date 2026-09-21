import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <Link to={`/doctors/${doctor.id}`} style={{ display: 'block' }}>
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '1.25rem',
        background: '#fff',
        transition: 'box-shadow 0.15s ease'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#e0f2fe',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0369a1', fontWeight: 700
          }}>
            {doctor.name ? doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'DR'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>{doctor.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {doctor.department} · {doctor.specialization}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
