// Pure note math + autocorrelation pitch detection for the Vocal Exercise app.

// Core 2-octave range per voice type (coreLow..coreLow+24 in MIDI).
// The piano displays one extra octave on each side: coreLow-12 .. coreLow+36 (49 keys).
export const VOICE_TYPES = [
  { id: 'bass', label: 'Bass', coreLow: 40 }, // E2–E4, shows E1–E5
  { id: 'baritone', label: 'Baritone', coreLow: 45 }, // A2–A4, shows A1–A5
  { id: 'tenor', label: 'Tenor', coreLow: 48 }, // C3–C5, shows C2–C6
  { id: 'countertenor', label: 'Countertenor', coreLow: 52 }, // E3–E5, shows E2–E6
  { id: 'contralto', label: 'Contralto', coreLow: 53 }, // F3–F5, shows F2–F6
  { id: 'mezzo-soprano', label: 'Mezzo-soprano', coreLow: 57 }, // A3–A5, shows A2–A6
  { id: 'soprano', label: 'Soprano', coreLow: 60 }, // C4–C6, shows C3–C7
] as const

export type VoiceTypeId = (typeof VOICE_TYPES)[number]['id']
export const DEFAULT_VOICE_TYPE: VoiceTypeId = 'tenor'

export const displayRange = (coreLow: number) => ({ low: coreLow - 12, high: coreLow + 36 })

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', cents: 20 },
  { id: 'hard', label: 'Hard', cents: 15 },
  { id: 'extra-hard', label: 'Extra hard', cents: 10 },
  { id: 'extreme', label: 'Extreme', cents: 5 },
] as const

export type DifficultyId = (typeof DIFFICULTIES)[number]['id']
export const DEFAULT_DIFFICULTY: DifficultyId = 'easy'

export const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)
export const freqToMidiFloat = (freq: number) => 69 + 12 * Math.log2(freq / 440)

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const noteName = (midi: number) =>
  `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`

export const isBlackKey = (midi: number) => NOTE_NAMES[midi % 12].includes('#')

/**
 * Autocorrelation pitch detector (cwilso/PitchDetect style) over a
 * time-domain buffer. Returns the detected frequency in Hz, or -1 when no
 * pitch inside [minFreq, maxFreq] is found.
 */
export function detectPitch(
  input: Float32Array,
  sampleRate: number,
  minFreq: number,
  maxFreq: number,
): number {
  // Silence gate
  let sumSq = 0
  for (let i = 0; i < input.length; i++) sumSq += input[i] * input[i]
  const rms = Math.sqrt(sumSq / input.length)
  if (rms < 0.01) return -1

  // Trim quiet edges to reduce transient bias
  const thres = 0.2 * rms
  let start = 0
  let end = input.length - 1
  while (start < input.length / 2 && Math.abs(input[start]) < thres) start++
  while (end > input.length / 2 && Math.abs(input[end]) < thres) end--
  const buf = input.subarray(start, end + 1)
  const n = buf.length

  // The longest lag we care about is the lowest allowed frequency
  const maxLag = Math.min(Math.ceil(sampleRate / minFreq), n - 2)
  if (maxLag < 4) return -1

  // Normalized by overlap length so long lags aren't penalized
  const c = new Float32Array(maxLag + 2)
  for (let lag = 0; lag <= maxLag + 1; lag++) {
    let sum = 0
    for (let i = 0; i + lag < n; i++) sum += buf[i] * buf[i + lag]
    c[lag] = sum / (n - lag)
  }

  // Skip the zero-lag hill: for low notes it is wide and nearly flat, so walk
  // to the ACF's first zero crossing (a zero-mean periodic signal always dips
  // negative before its first true peak), falling back to the first dip.
  let d = 0
  while (d < maxLag && c[d + 1] > 0) d++
  if (d >= maxLag) {
    d = 0
    while (d < maxLag && c[d] > c[d + 1]) d++
  }

  // The ACF of a periodic signal peaks at every multiple of the true period,
  // so the global max alone octave-errors down. Take the smallest local
  // maximum that is nearly as strong as the global one — that's the period.
  let globalMax = -Infinity
  for (let lag = d; lag <= maxLag; lag++) if (c[lag] > globalMax) globalMax = c[lag]
  if (globalMax <= 0) return -1
  let bestLag = -1
  for (let lag = Math.max(d, 2); lag <= maxLag; lag++) {
    if (c[lag] >= 0.9 * globalMax && c[lag] > c[lag - 1] && c[lag] >= c[lag + 1]) {
      bestLag = lag
      break
    }
  }
  if (bestLag <= 0) return -1

  // Clarity gate: weak periodicity means noise, not pitch
  if (c[bestLag] / c[0] < 0.5) return -1

  // Parabolic interpolation around the peak for sub-sample precision
  const a = c[bestLag - 1]
  const b = c[bestLag]
  const g = c[bestLag + 1]
  const denom = a - 2 * b + g
  const shift = denom === 0 ? 0 : Math.max(-1, Math.min(1, (a - g) / (2 * denom)))
  const period = bestLag + shift

  const freq = sampleRate / period
  if (freq < minFreq || freq > maxFreq) return -1
  return freq
}
