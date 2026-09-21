export default function DepartmentFilter({ departments, activeDepartment, onDepartmentChange }) {
  return (
    <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
  )
}
