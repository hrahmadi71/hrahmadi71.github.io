import { motion } from 'framer-motion'
import type { RefObject } from 'react'
import type { AppDef } from '../apps/registry'
import { useWindowStore } from '../store/windowStore'

interface DesktopIconProps {
  app: AppDef
  /** Bounds for icon dragging (the desktop element) */
  dragArea: RefObject<HTMLDivElement | null>
}

export function DesktopIcon({ app, dragArea }: DesktopIconProps) {
  const openApp = useWindowStore((s) => s.openApp)
  const Icon = app.icon

  return (
    <motion.button
      // Double-click to open, so releasing a drag (or a single click) doesn't launch the app
      onDoubleClick={() => openApp({ appId: app.id, title: app.title, defaultSize: app.defaultSize })}
      drag
      dragConstraints={dragArea}
      dragMomentum={false}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.12, rotate: -2 }}
      whileDrag={{ scale: 1.15, rotate: 3, cursor: 'grabbing' }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex w-24 flex-col items-center gap-1.5 p-2 focus:outline-none"
    >
      <span className="h-14 w-14 drop-shadow-[3px_3px_0_rgba(31,26,23,0.25)]">
        <Icon />
      </span>
      <span className="border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-xs font-bold shadow-flat-sm">
        {app.label}
      </span>
    </motion.button>
  )
}
