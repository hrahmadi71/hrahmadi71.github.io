import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DEFAULT_DIFFICULTY,
  DEFAULT_VOICE_TYPE,
  DIFFICULTIES,
  VOICE_TYPES,
  detectPitch,
  displayRange,
  freqToMidiFloat,
  isBlackKey,
  midiToFreq,
  noteName,
  type DifficultyId,
  type VoiceTypeId,
} from './vocal-exercise/pitch'

interface KeyDef {
  midi: number
  black: boolean
  /** For white keys their index; for black keys the count of whites before them. */
  whiteIndex: number
}

interface Detection {
  midi: number
  cents: number
  inTune: boolean
}

type MicState = 'off' | 'on' | 'denied'

const VOICE_STORAGE_KEY = 'hamidos-vocal-voice'
const DIFFICULTY_STORAGE_KEY = 'hamidos-vocal-difficulty'

// Consecutive detected frames before the highlighted key switches
const NOTE_STABLE_FRAMES = 3
// Consecutive silent frames before the detection clears
const SILENCE_CLEAR_FRAMES = 10

function MicGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
      <path d="M3 8a5 5 0 0 0 10 0M8 13v2" strokeLinecap="round" />
    </svg>
  )
}

function CentsGauge({ detection }: { detection: Detection | null }) {
  const cents = detection ? Math.max(-50, Math.min(50, detection.cents)) : 0
  const angle = (cents / 50) * 45
  const needleClass = detection
    ? detection.inTune
      ? 'stroke-accent-green'
      : 'stroke-accent-red'
    : 'stroke-ink'

  return (
    <div className="flex items-center gap-2">
      <div className="text-right font-mono text-xs leading-tight">
        <div className="font-bold">{detection ? noteName(detection.midi) : '—'}</div>
        <div className="opacity-60">
          {detection ? `${detection.cents >= 0 ? '+' : '−'}${Math.abs(Math.round(detection.cents))}¢` : ''}
        </div>
      </div>
      <svg viewBox="0 0 100 58" className={`h-12 w-20 ${detection ? '' : 'opacity-30'}`}>
        <path d="M14 52A38 38 0 0 1 86 52" fill="none" className="stroke-ink" strokeWidth="3" />
        {[-45, -22.5, 0, 22.5, 45].map((deg) => {
          const rad = (deg * Math.PI) / 180
          const sin = Math.sin(rad)
          const cos = Math.cos(rad)
          return (
            <line
              key={deg}
              x1={50 + 38 * sin}
              y1={52 - 38 * cos}
              x2={50 + 32 * sin}
              y2={52 - 32 * cos}
              className="stroke-ink"
              strokeWidth={deg === 0 ? 2.5 : 1.5}
            />
          )
        })}
        <text x="6" y="56" fontSize="10" className="fill-ink font-mono">♭</text>
        <text x="88" y="56" fontSize="10" className="fill-ink font-mono">♯</text>
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: '50px 52px',
            transition: 'transform 80ms linear',
          }}
        >
          <line x1="50" y1="52" x2="50" y2="20" className={needleClass} strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="52" r="3.5" className="fill-ink" />
      </svg>
    </div>
  )
}

export function VocalExerciseApp() {
  const [voiceId, setVoiceId] = useState<VoiceTypeId>(() => {
    const stored = localStorage.getItem(VOICE_STORAGE_KEY)
    return VOICE_TYPES.some((v) => v.id === stored) ? (stored as VoiceTypeId) : DEFAULT_VOICE_TYPE
  })
  const [difficultyId, setDifficultyId] = useState<DifficultyId>(() => {
    const stored = localStorage.getItem(DIFFICULTY_STORAGE_KEY)
    return DIFFICULTIES.some((d) => d.id === stored) ? (stored as DifficultyId) : DEFAULT_DIFFICULTY
  })
  const [micState, setMicState] = useState<MicState>('off')
  const [detection, setDetection] = useState<Detection | null>(null)

  const voice = VOICE_TYPES.find((v) => v.id === voiceId) ?? VOICE_TYPES[2]
  const difficulty = DIFFICULTIES.find((d) => d.id === difficultyId) ?? DIFFICULTIES[0]
  const range = displayRange(voice.coreLow)

  // The rAF loop reads these refs so dropdown changes apply without a mic restart
  const centsThresholdRef = useRef(difficulty.cents)
  centsThresholdRef.current = difficulty.cents
  const freqRangeRef = useRef({ min: 0, max: 0 })
  freqRangeRef.current = {
    min: midiToFreq(range.low - 2),
    max: midiToFreq(range.high + 2),
  }

  const audioCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const bufRef = useRef<Float32Array<ArrayBuffer> | null>(null)
  const rafRef = useRef(0)
  const startingRef = useRef(false)
  // Pitch smoothing state
  const freqHistoryRef = useRef<number[]>([])
  const candidateRef = useRef({ midi: -1, frames: 0 })
  const shownMidiRef = useRef(-1)
  const silentFramesRef = useRef(0)
  const smoothCentsRef = useRef(0)
  const lastRenderedRef = useRef<Detection | null>(null)

  const { keys, whiteCount } = useMemo(() => {
    const list: KeyDef[] = []
    let whites = 0
    for (let midi = range.low; midi <= range.high; midi++) {
      const black = isBlackKey(midi)
      list.push({ midi, black, whiteIndex: whites })
      if (!black) whites++
    }
    return { keys: list, whiteCount: whites }
  }, [range.low, range.high])

  const ensureCtx = useCallback(() => {
    let ctx = audioCtxRef.current
    if (!ctx) {
      ctx = new AudioContext()
      audioCtxRef.current = ctx
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }, [])

  const playNote = useCallback(
    (midi: number) => {
      const ctx = ensureCtx()
      const t = ctx.currentTime
      const freq = midiToFreq(midi)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
      gain.connect(ctx.destination)

      const body = ctx.createOscillator()
      body.type = 'triangle'
      body.frequency.value = freq
      body.detune.value = 3
      body.connect(gain)

      const shimmerGain = ctx.createGain()
      shimmerGain.gain.value = 0.15
      shimmerGain.connect(gain)
      const shimmer = ctx.createOscillator()
      shimmer.type = 'sine'
      shimmer.frequency.value = freq * 2
      shimmer.connect(shimmerGain)

      body.start(t)
      shimmer.start(t)
      body.stop(t + 1.25)
      shimmer.stop(t + 1.25)
      body.onended = () => {
        shimmer.disconnect()
        shimmerGain.disconnect()
        body.disconnect()
        gain.disconnect()
      }
    },
    [ensureCtx],
  )

  const resetDetection = useCallback(() => {
    freqHistoryRef.current = []
    candidateRef.current = { midi: -1, frames: 0 }
    shownMidiRef.current = -1
    silentFramesRef.current = 0
    smoothCentsRef.current = 0
    lastRenderedRef.current = null
    setDetection(null)
  }, [])

  const tick = useCallback(() => {
    const analyser = analyserRef.current
    const ctx = audioCtxRef.current
    const buf = bufRef.current
    if (!analyser || !ctx || !buf) return

    analyser.getFloatTimeDomainData(buf)
    const { min, max } = freqRangeRef.current
    const freq = detectPitch(buf, ctx.sampleRate, min, max)

    if (freq > 0) {
      silentFramesRef.current = 0
      const history = freqHistoryRef.current
      history.push(freq)
      if (history.length > 5) history.shift()
      const median = [...history].sort((a, b) => a - b)[Math.floor(history.length / 2)]

      const midiFloat = freqToMidiFloat(median)
      const nearest = Math.round(midiFloat)
      if (nearest === candidateRef.current.midi) candidateRef.current.frames++
      else candidateRef.current = { midi: nearest, frames: 1 }
      if (candidateRef.current.frames >= NOTE_STABLE_FRAMES || shownMidiRef.current === -1) {
        shownMidiRef.current = nearest
      }

      const shown = shownMidiRef.current
      const cents = Math.max(-99, Math.min(99, (midiFloat - shown) * 100))
      smoothCentsRef.current = 0.7 * smoothCentsRef.current + 0.3 * cents

      const next: Detection = {
        midi: shown,
        cents: smoothCentsRef.current,
        inTune: Math.abs(cents) <= centsThresholdRef.current,
      }
      const prev = lastRenderedRef.current
      if (
        !prev ||
        prev.midi !== next.midi ||
        prev.inTune !== next.inTune ||
        Math.round(prev.cents) !== Math.round(next.cents)
      ) {
        lastRenderedRef.current = next
        setDetection(next)
      }
    } else {
      silentFramesRef.current++
      if (silentFramesRef.current === SILENCE_CLEAR_FRAMES && lastRenderedRef.current) {
        freqHistoryRef.current = []
        candidateRef.current = { midi: -1, frames: 0 }
        shownMidiRef.current = -1
        smoothCentsRef.current = 0
        lastRenderedRef.current = null
        setDetection(null)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stopTuner = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    sourceRef.current?.disconnect()
    sourceRef.current = null
    analyserRef.current?.disconnect()
    analyserRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    bufRef.current = null
    resetDetection()
    setMicState('off')
  }, [resetDetection])

  const startTuner = useCallback(async () => {
    if (startingRef.current) return
    startingRef.current = true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = ensureCtx()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      // Long window for precision on low notes (bass display reaches E1 ≈ 41 Hz)
      analyser.fftSize = 8192
      source.connect(analyser)
      streamRef.current = stream
      sourceRef.current = source
      analyserRef.current = analyser
      bufRef.current = new Float32Array(analyser.fftSize)
      resetDetection()
      setMicState('on')
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setMicState('denied')
    } finally {
      startingRef.current = false
    }
  }, [ensureCtx, resetDetection, tick])

  const toggleMic = useCallback(() => {
    if (micState === 'on') stopTuner()
    else void startTuner()
  }, [micState, startTuner, stopTuner])

  // Window close unmounts the app: release the mic and the audio context
  useEffect(
    () => () => {
      stopTuner()
      void audioCtxRef.current?.close().catch(() => {})
      audioCtxRef.current = null
    },
    [stopTuner],
  )

  const selectVoice = (id: VoiceTypeId) => {
    setVoiceId(id)
    localStorage.setItem(VOICE_STORAGE_KEY, id)
  }
  const selectDifficulty = (id: DifficultyId) => {
    setDifficultyId(id)
    localStorage.setItem(DIFFICULTY_STORAGE_KEY, id)
  }

  const inCoreRange = (midi: number) => midi >= voice.coreLow && midi <= voice.coreLow + 24

  const selectClass =
    'border-2 border-ink bg-paper px-2 py-1 font-mono text-xs shadow-flat-sm focus:outline-none'

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b-[3px] border-ink bg-cream px-3 py-2">
        <motion.button
          onClick={toggleMic}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className={`flex items-center gap-2 border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold shadow-flat-sm ${
            micState === 'on'
              ? 'bg-accent-green text-ink'
              : micState === 'denied'
                ? 'bg-accent-red text-paper'
                : 'bg-paper text-ink'
          }`}
        >
          <MicGlyph />
          {micState === 'on' ? (
            <>
              Tuner: on
              <span className="h-2 w-2 animate-pulse border border-ink bg-accent-red" />
            </>
          ) : micState === 'denied' ? (
            'Mic blocked'
          ) : (
            'Tuner: off'
          )}
        </motion.button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase">
            Voice
            <select
              value={voiceId}
              onChange={(e) => selectVoice(e.target.value as VoiceTypeId)}
              className={selectClass}
            >
              {VOICE_TYPES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase">
            Level
            <select
              value={difficultyId}
              onChange={(e) => selectDifficulty(e.target.value as DifficultyId)}
              className={selectClass}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} (±{d.cents}¢)
                </option>
              ))}
            </select>
          </label>
        </div>

        <CentsGauge detection={detection} />
      </div>

      {micState === 'denied' && (
        <p className="shrink-0 border-b-2 border-ink bg-accent-red/10 px-3 py-1 font-mono text-xs">
          Microphone access is blocked. Allow it in your browser settings, then click the button to retry.
        </p>
      )}

      <div className="min-h-0 grow overflow-x-auto bg-cream p-2">
        <div className="relative h-full" style={{ minWidth: 720 }}>
          {keys
            .filter((k) => !k.black)
            .map((k) => {
              const detected = detection?.midi === k.midi
              return (
                <button
                  key={k.midi}
                  onPointerDown={() => playNote(k.midi)}
                  aria-label={noteName(k.midi)}
                  className={`absolute top-0 h-full touch-manipulation select-none border-2 border-ink transition-colors duration-75 active:translate-y-[2px] ${
                    detected ? (detection.inTune ? 'bg-accent-green' : 'bg-accent-red') : 'bg-paper'
                  }`}
                  style={{
                    left: `${(k.whiteIndex / whiteCount) * 100}%`,
                    width: `${(1 / whiteCount) * 100}%`,
                  }}
                >
                  <span
                    className={`pointer-events-none absolute inset-x-0 bottom-1 text-center font-mono text-[9px] text-ink ${
                      inCoreRange(k.midi) ? 'opacity-70' : 'opacity-25'
                    }`}
                  >
                    {noteName(k.midi)}
                  </span>
                </button>
              )
            })}
          {keys
            .filter((k) => k.black)
            .map((k) => {
              const detected = detection?.midi === k.midi
              return (
                <button
                  key={k.midi}
                  onPointerDown={() => playNote(k.midi)}
                  aria-label={noteName(k.midi)}
                  className={`absolute top-0 z-10 h-[62%] touch-manipulation select-none border-2 border-ink transition-colors duration-75 active:translate-y-[2px] ${
                    detected ? (detection.inTune ? 'bg-accent-green' : 'bg-accent-red') : 'bg-ink'
                  }`}
                  style={{
                    left: `${((k.whiteIndex - 0.3) / whiteCount) * 100}%`,
                    width: `${(0.6 / whiteCount) * 100}%`,
                  }}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}
