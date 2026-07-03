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
