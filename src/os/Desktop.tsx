import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { apps, appById } from '../apps/registry'
import { DesktopIcon } from './DesktopIcon'
import { WindowManager } from './WindowManager'
import { Taskbar } from './Taskbar'
import { ContextMenu } from './ContextMenu'
import { useWindowStore } from '../store/windowStore'
import { useSettingsStore, wallpaperById } from '../store/settingsStore'
import { AppearanceIcon, AboutIcon } from '../components/icons/FlatIcons'

// Cave mode: everything is pitch black except a torch-lit circle around the cursor.
function CaveOverlay() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const paint = (x: number, y: number) => {
      if (ref.current) {
        ref.current.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent 0, rgba(8,6,4,0.15) 130px, rgba(8,6,4,0.94) 320px)`
      }
    }
    paint(window.innerWidth / 2, window.innerHeight / 3)
    const onMove = (e: MouseEvent) => paint(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) paint(t.clientX, t.clientY)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-none fixed inset-0 z-[10001]"
    />
  )
}

// Slow-looping flat shapes so the desktop reads as a living 2D cartoon scene.
// Shown only when no image wallpaper is active.
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
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const openApp = useWindowStore((s) => s.openApp)
  const mode = useSettingsStore((s) => s.mode)
  const wallpaperId = useSettingsStore((s) => s.wallpaperId)
  const wallpaper = wallpaperById(wallpaperId)

  useEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  const launch = (appId: string) => {
    const app = appById(appId)
    if (app) openApp({ appId: app.id, title: app.title, defaultSize: app.defaultSize })
    setMenu(null)
  }

  return (
    <div
      ref={desktopRef}
      className="relative h-full w-full select-none overflow-hidden bg-cream bg-cover bg-center"
      style={wallpaper ? { backgroundImage: `url(${wallpaper.src})` } : undefined}
      onContextMenu={(e) => {
        // Only the bare desktop (decorative layers are pointer-events-none)
        if (e.target !== e.currentTarget) return
        e.preventDefault()
        setMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      {!wallpaper && <BackgroundShapes />}
      {wallpaper && mode !== 'light' && (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/45" />
      )}

      <div className="absolute left-4 top-4 flex flex-col gap-4">
        {apps
          .filter((app) => app.desktop !== false)
          .map((app) => (
            <DesktopIcon key={app.id} app={app} dragArea={desktopRef} />
          ))}
      </div>

      <WindowManager />
      <Taskbar />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          items={[
            { label: 'Appearance Settings', icon: AppearanceIcon, onSelect: () => launch('appearance') },
            { label: 'About HamidOS', icon: AboutIcon, onSelect: () => launch('about') },
          ]}
        />
      )}

      {mode === 'cave' && <CaveOverlay />}
    </div>
  )
}
