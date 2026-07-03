import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'
import { appById } from '../apps/registry'

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="font-mono text-sm font-bold tabular-nums">
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export function Taskbar() {
  const { windows, focusedId, restore, minimize } = useWindowStore()

  return (
    <motion.footer
      initial={{ y: 64 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26, delay: 0.2 }}
      className="absolute inset-x-0 bottom-0 z-[9999] flex h-14 items-center gap-2 border-t-[3px] border-ink bg-paper px-3"
    >
      <span className="mr-1 select-none border-2 border-ink bg-accent-red px-2 py-1 font-mono text-sm font-bold text-paper shadow-flat-sm">
        HamidOS
      </span>

      <div className="flex min-w-0 grow gap-2 overflow-x-auto">
        {windows.map((win) => {
          const app = appById(win.appId)
          const active = focusedId === win.id && !win.minimized
          return (
            <motion.button
              key={win.id}
              onClick={() => (active ? minimize(win.id) : restore(win.id))}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              className={`flex shrink-0 items-center gap-2 border-2 border-ink px-3 py-1 font-mono text-xs font-bold ${
                active ? `${app?.accent ?? 'bg-cream'} shadow-flat-sm` : 'bg-cream opacity-70'
              }`}
            >
              {win.title}
            </motion.button>
          )
        })}
      </div>

      <Clock />
    </motion.footer>
  )
}
