export function Button({ children, variant = 'primary', ...props }) {
  const className = 'btn ' + (variant === 'primary' ? 'btn-primary' : 'btn-secondary')
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  )
}
