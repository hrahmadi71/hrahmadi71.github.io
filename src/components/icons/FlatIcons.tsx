// Flat SVG icons in the chunky 2D style: thick ink strokes, solid fills.

export function PdfFileIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <path d="M10 4h20l8 8v32H10z" fill="#fffdf8" stroke="#1f1a17" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 4l8 8h-8z" fill="#f9bd2b" stroke="#1f1a17" strokeWidth="3" strokeLinejoin="round" />
      <rect x="15" y="22" width="18" height="4" fill="#f54e00" />
      <rect x="15" y="30" width="18" height="4" fill="#1f1a17" />
      <rect x="15" y="38" width="12" height="4" fill="#1f1a17" />
    </svg>
  )
}

export function AppearanceIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <path
        d="M24 5C13 5 5 13 5 23.5 5 34 13 42 23 42c3 0 4.5-2 3.6-4.4-.9-2.3.4-4.6 3.4-4.6h5c4.5 0 8-3.5 8-8C43 13.5 34.5 5 24 5z"
        fill="#fffdf8"
        stroke="#1f1a17"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="18" r="4" fill="#f54e00" stroke="#1f1a17" strokeWidth="2.5" />
      <circle cx="28" cy="13" r="4" fill="#f9bd2b" stroke="#1f1a17" strokeWidth="2.5" />
      <circle cx="36" cy="22" r="4" fill="#2f80fa" stroke="#1f1a17" strokeWidth="2.5" />
      <circle cx="14" cy="30" r="4" fill="#36c46c" stroke="#1f1a17" strokeWidth="2.5" />
    </svg>
  )
}

export function AboutIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <circle cx="24" cy="24" r="20" fill="#2f80fa" stroke="#1f1a17" strokeWidth="3" />
      <rect x="21" y="11" width="6" height="6" fill="#fffdf8" stroke="#1f1a17" strokeWidth="2" />
      <rect x="21" y="21" width="6" height="16" fill="#fffdf8" stroke="#1f1a17" strokeWidth="2" />
    </svg>
  )
}

export function BrowserIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <circle cx="24" cy="24" r="20" fill="#2f80fa" stroke="#1f1a17" strokeWidth="3" />
      <ellipse cx="24" cy="24" rx="9" ry="20" fill="none" stroke="#1f1a17" strokeWidth="2.5" />
      <path d="M4 24h40M7 14h34M7 34h34" fill="none" stroke="#1f1a17" strokeWidth="2.5" />
    </svg>
  )
}

export function Game2048Icon() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <rect x="4" y="4" width="40" height="40" fill="#f9bd2b" stroke="#1f1a17" strokeWidth="3" strokeLinejoin="round" />
      <rect x="9" y="9" width="14" height="14" fill="#f54e00" stroke="#1f1a17" strokeWidth="2.5" />
      <rect x="25" y="9" width="14" height="14" fill="#fffdf8" stroke="#1f1a17" strokeWidth="2.5" />
      <rect x="9" y="25" width="14" height="14" fill="#fffdf8" stroke="#1f1a17" strokeWidth="2.5" />
      <rect x="25" y="25" width="14" height="14" fill="#2f80fa" stroke="#1f1a17" strokeWidth="2.5" />
      <text x="16" y="20" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#fffdf8">2</text>
      <text x="32" y="20" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#1f1a17">0</text>
      <text x="16" y="36" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#1f1a17">4</text>
      <text x="32" y="36" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill="#fffdf8">8</text>
    </svg>
  )
}
