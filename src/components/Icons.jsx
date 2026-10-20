export function ArrowExternal(props) {
  return (
    <svg viewBox="0 0 17 17" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.958 12.042 12.042 4.958M12.042 10.625V4.958H6.375"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowDown(props) {
  return (
    <svg viewBox="0 0 19 19" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9.5 3.958v11.084M14.25 10.292 9.5 15.042l-4.75-4.75"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Play(props) {
  return (
    <svg viewBox="0 0 21 25" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.023 1.8C1.69 1.006 0 1.966 0 3.518v17.964c0 1.552 1.69 2.512 3.023 1.718l15.09-8.982c1.302-.775 1.302-2.662 0-3.437L3.023 1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Close(props) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function Check(props) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 7.3 5.8 10 11 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Spinner({ className = '' }) {
  return <span className={`spinner ${className}`.trim()} aria-hidden="true" />
}
