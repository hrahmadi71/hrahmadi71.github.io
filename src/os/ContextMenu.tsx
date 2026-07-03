import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'

export interface ContextMenuItem {
  label: string
  icon?: ComponentType
  onSelect: () => void
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

const MENU_WIDTH = 224
const ITEM_HEIGHT = 40

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Keep the menu inside the viewport when opened near an edge
  const left = Math.min(x, window.innerWidth - MENU_WIDTH - 8)
  const top = Math.min(y, window.innerHeight - items.length * ITEM_HEIGHT - 80)

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{ left, top, width: MENU_WIDTH, transformOrigin: 'top left' }}
      className="absolute z-[10000] border-[3px] border-ink bg-paper py-1 shadow-flat"
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            onClick={item.onSelect}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-sm font-bold hover:bg-accent-yellow hover:text-[#1f1a17]"
          >
            {Icon && (
              <span className="h-5 w-5 shrink-0">
                <Icon />
              </span>
            )}
            {item.label}
          </button>
        )
      })}
    </motion.div>
  )
}
