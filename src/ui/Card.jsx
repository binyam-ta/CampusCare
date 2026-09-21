export function Card({ title, subtitle, children, footer }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      {(title || subtitle) && (
        <div>
          {title && <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{title}</h3>}
          {subtitle && <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div style={{ marginTop: 'auto' }}>{footer}</div>}
    </div>
  )
}
