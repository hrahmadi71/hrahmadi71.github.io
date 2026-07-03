import { motion } from 'framer-motion'
import type { AppDef } from '../apps/registry'
import { useWindowStore } from '../store/windowStore'

export function DesktopIcon({ app }: { app: AppDef }) {
  const openApp = useWindowStore((s) => s.openApp)
  const Icon = app.icon

  return (
    <motion.button
      onClick={() => openApp({ appId: app.id, title: app.title, defaultSize: app.defaultSize })}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.12, rotate: -2 }}
      whileTap={{ scale: 0.88, rotate: 2 }}
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
