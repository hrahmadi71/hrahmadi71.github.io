import { useRef } from 'react'
import { motion } from 'framer-motion'
import { apps } from '../apps/registry'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from './WindowManager'
import { Taskbar } from './Taskbar'

// Slow-looping flat shapes so the desktop reads as a living 2D cartoon scene.
function BackgroundShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute h-40 w-40 rounded-full border-[3px] border-ink bg-accent-yellow"
        style={{ top: '12%', right: '14%' }}
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-24 w-24 border-[3px] border-ink bg-accent-blue"
        style={{ bottom: '22%', left: '10%', borderRadius: '30% 70% 60% 40% / 50% 40% 60% 50%' }}
        animate={{ y: [0, 14, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-16 w-32 border-[3px] border-ink bg-paper"
        style={{ top: '28%', left: '22%', borderRadius: 9999 }}
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute h-0 w-0 border-l-[36px] border-r-[36px] border-b-[60px] border-l-transparent border-r-transparent border-b-accent-green"
        style={{ bottom: '30%', right: '24%' }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      {/* Sun peeking from the top edge, clear of the icon column */}
      <motion.div
        className="absolute -top-12 h-32 w-32 rounded-full border-[3px] border-ink bg-accent-red"
        style={{ left: '42%' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

export function Desktop() {
  const desktopRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={desktopRef} className="relative h-full w-full select-none overflow-hidden bg-cream">
      <BackgroundShapes />

      <div className="absolute left-4 top-4 flex flex-col gap-4">
        {apps.map((app) => (
          <DesktopIcon key={app.id} app={app} dragArea={desktopRef} />
        ))}
      </div>

      <WindowManager />
      <Taskbar />
    </div>
  )
}
