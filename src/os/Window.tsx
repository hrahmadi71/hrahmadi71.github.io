import { motion } from 'framer-motion'
import { Rnd } from 'react-rnd'
import type { ReactNode } from 'react'
import { useWindowStore, type WindowInstance } from '../store/windowStore'
import { useIsMobile } from '../hooks/useMediaQuery'

const TASKBAR_HEIGHT = 56

interface WindowProps {
  win: WindowInstance
  accent: string
  children: ReactNode
}

function TitleBarButton({
  label,
  color,
  onClick,
}: {
  label: string
  color: string
  onClick: () => void
}) {
  return (
    <motion.button
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      whileHover={{ scale: 1.2, rotate: -6 }}
      whileTap={{ scale: 0.85 }}
      className={`h-4 w-4 border-2 border-ink ${color}`}
    />
  )
}

export function Window({ win, accent, children }: WindowProps) {
  const { close, focus, minimize, toggleMaximize, setBounds, focusedId } = useWindowStore()
  const isMobile = useIsMobile()
  const focused = focusedId === win.id

  const frame = (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, y: 40 }}
      animate={{
        scale: win.minimized ? 0.6 : 1,
        opacity: win.minimized ? 0 : 1,
        y: win.minimized ? 200 : 0,
      }}
      exit={{ scale: 0.6, opacity: 0, y: 60 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{ pointerEvents: win.minimized ? 'none' : 'auto' }}
      className={`flex h-full w-full flex-col border-[3px] border-ink bg-paper ${
        focused ? 'shadow-flat-lg' : 'shadow-flat'
      }`}
    >
      <div
        className={`window-titlebar flex shrink-0 cursor-grab items-center gap-2 border-b-[3px] border-ink px-3 py-2 active:cursor-grabbing ${accent}`}
        onDoubleClick={() => !isMobile && toggleMaximize(win.id)}
      >
        <span className="mr-auto select-none font-mono text-sm font-bold tracking-tight">
          {win.title}
        </span>
        {!isMobile && (
          <>
            <TitleBarButton label="Minimize" color="bg-accent-yellow" onClick={() => minimize(win.id)} />
            <TitleBarButton label="Maximize" color="bg-accent-green" onClick={() => toggleMaximize(win.id)} />
          </>
        )}
        <TitleBarButton label="Close" color="bg-accent-red" onClick={() => close(win.id)} />
      </div>
      <div className="window-body min-h-0 grow overflow-auto">{children}</div>
    </motion.div>
  )

  // Mobile: full-screen sheet, no drag/resize
  if (isMobile) {
    return (
      <div
        className="fixed inset-x-0 top-0"
        style={{ bottom: TASKBAR_HEIGHT, zIndex: win.zIndex }}
        onMouseDown={() => focus(win.id)}
      >
        {frame}
      </div>
    )
  }

  const maximized = win.maximized
  return (
    <Rnd
      size={
        maximized
          ? { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT }
          : { width: win.width, height: win.height }
      }
      position={maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
      style={{ zIndex: win.zIndex }}
      minWidth={280}
      minHeight={180}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      cancel="button"
      enableResizing={!maximized}
      disableDragging={maximized}
      onDragStop={(_, d) => setBounds(win.id, { x: d.x, y: d.y })}
      onResizeStop={(_, __, ref, ___, pos) =>
        setBounds(win.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: pos.x,
          y: pos.y,
        })
      }
      onMouseDown={() => focus(win.id)}
    >
      {frame}
    </Rnd>
  )
}
