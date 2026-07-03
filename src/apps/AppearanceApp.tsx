import { motion } from 'framer-motion'
import { useSettingsStore, wallpapers, type ThemeMode } from '../store/settingsStore'

const modes: { id: ThemeMode; label: string; blurb: string }[] = [
  { id: 'light', label: 'Light', blurb: 'Classic cream & ink' },
  { id: 'dark', label: 'Dark', blurb: 'Flat night palette' },
  { id: 'cave', label: 'Cave', blurb: 'Your cursor is the torch' },
]

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-3 inline-block border-b-4 border-accent-purple pb-0.5 text-lg font-bold uppercase tracking-widest">
      {children}
    </h2>
  )
}

function SelectedBadge() {
  return (
    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border-2 border-ink bg-accent-green font-mono text-sm font-bold text-[#1f1a17]">
      ✓
    </span>
  )
}

// Fixed-color swatches: each preview shows its own mode regardless of the active theme.
function ModePreview({ id }: { id: ThemeMode }) {
  if (id === 'light') {
    return (
      <div className="relative h-16 overflow-hidden border-b-[3px] border-ink" style={{ background: '#f5f0e8' }}>
        <div
          className="absolute left-2 top-2 h-8 w-8 rounded-full"
          style={{ background: '#f9bd2b', border: '2px solid #1f1a17' }}
        />
        <div className="absolute bottom-2 right-2 h-4 w-10" style={{ background: '#fffdf8', border: '2px solid #1f1a17' }} />
      </div>
    )
  }
  if (id === 'dark') {
    return (
      <div className="relative h-16 overflow-hidden border-b-[3px] border-ink" style={{ background: '#211e1b' }}>
        <div
          className="absolute left-2 top-2 h-8 w-8 rounded-full"
          style={{ background: '#f0eadf', border: '2px solid #0d0b09' }}
        />
        <div className="absolute bottom-2 right-2 h-4 w-10" style={{ background: '#2d2925', border: '2px solid #f0eadf' }} />
      </div>
    )
  }
  return (
    <div className="relative h-16 overflow-hidden border-b-[3px] border-ink" style={{ background: '#0c0a08' }}>
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,189,43,0.9) 0%, rgba(249,189,43,0.25) 55%, transparent 75%)' }}
      />
    </div>
  )
}

export function AppearanceApp() {
  const { mode, setMode, wallpaperId, setWallpaper } = useSettingsStore()

  return (
    <div className="p-6 sm:p-8">
      <section>
        <SectionTitle>Mode</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {modes.map((m) => {
            const selected = mode === m.id
            return (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`relative border-[3px] border-ink bg-paper text-left ${
                  selected ? 'shadow-flat' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <ModePreview id={m.id} />
                <div className="p-2">
                  <p className="font-mono text-sm font-bold">{m.label}</p>
                  <p className="mt-0.5 text-xs leading-snug opacity-70">{m.blurb}</p>
                </div>
                {selected && <SelectedBadge />}
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>Wallpaper</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((w) => {
            const selected = wallpaperId === w.id
            return (
              <motion.button
                key={w.id}
                onClick={() => setWallpaper(w.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`relative border-[3px] border-ink bg-paper ${
                  selected ? 'shadow-flat' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={w.src}
                  alt={w.label}
                  className="h-24 w-full border-b-[3px] border-ink object-cover"
                  draggable={false}
                />
                <p className="p-2 text-left font-mono text-sm font-bold">{w.label}</p>
                {selected && <SelectedBadge />}
              </motion.button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
