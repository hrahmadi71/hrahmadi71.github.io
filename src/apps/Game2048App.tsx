import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SIZE = 4
const CELL = 72
const GAP = 8
const BOARD = SIZE * CELL + (SIZE + 1) * GAP

interface Tile {
  id: number
  value: number
  row: number
  col: number
  merged: boolean
  spawned: boolean
}

type Direction = 'up' | 'down' | 'left' | 'right'

let nextId = 1

function spawnTile(tiles: Tile[]): Tile[] {
  const occupied = new Set(tiles.map((t) => t.row * SIZE + t.col))
  const free: number[] = []
  for (let i = 0; i < SIZE * SIZE; i++) if (!occupied.has(i)) free.push(i)
  if (free.length === 0) return tiles
  const cell = free[Math.floor(Math.random() * free.length)]
  return [
    ...tiles,
    {
      id: nextId++,
      value: Math.random() < 0.9 ? 2 : 4,
      row: Math.floor(cell / SIZE),
      col: cell % SIZE,
      merged: false,
      spawned: true,
    },
  ]
}

function newGame(): Tile[] {
  return spawnTile(spawnTile([]))
}

// Slides and merges every line toward the given direction.
// Returns the new tiles, points gained, and whether anything moved.
function move(tiles: Tile[], dir: Direction): { tiles: Tile[]; gained: number; moved: boolean } {
  const horizontal = dir === 'left' || dir === 'right'
  const reverse = dir === 'right' || dir === 'down'
  const result: Tile[] = []
  let gained = 0
  let moved = false

  for (let line = 0; line < SIZE; line++) {
    const lineTiles = tiles
      .filter((t) => (horizontal ? t.row : t.col) === line)
      .sort((a, b) => (horizontal ? a.col - b.col : a.row - b.row))
    if (reverse) lineTiles.reverse()

    let target = 0
    let prev: Tile | null = null
    for (const tile of lineTiles) {
      if (prev && prev.value === tile.value && !prev.merged) {
        // Merge into prev's slot; prev survives with doubled value
        prev.value *= 2
        prev.merged = true
        gained += prev.value
        moved = true
        const pos = reverse ? SIZE - 1 - (target - 1) : target - 1
        result.push({
          ...tile,
          row: horizontal ? line : pos,
          col: horizontal ? pos : line,
          merged: false,
          spawned: false,
        })
        // Mark the pushed tile for removal after the slide animation
        result[result.length - 1].value = 0
        continue
      }
      const pos = reverse ? SIZE - 1 - target : target
      const next: Tile = {
        ...tile,
        row: horizontal ? line : pos,
        col: horizontal ? pos : line,
        merged: false,
        spawned: false,
      }
      if (next.row !== tile.row || next.col !== tile.col) moved = true
      result.push(next)
      prev = next
      target++
    }
  }
  return { tiles: result, gained, moved }
}

function hasMoves(tiles: Tile[]): boolean {
  if (tiles.length < SIZE * SIZE) return true
  const grid: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  for (const t of tiles) grid[t.row][t.col] = t.value
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true
    }
  return false
}

const TILE_STYLE: Record<number, string> = {
  2: 'bg-paper text-ink',
  4: 'bg-cream text-ink',
  8: 'bg-accent-yellow text-ink',
  16: 'bg-accent-yellow text-ink',
  32: 'bg-accent-red text-paper',
  64: 'bg-accent-red text-paper',
  128: 'bg-accent-blue text-paper',
  256: 'bg-accent-blue text-paper',
  512: 'bg-accent-purple text-paper',
  1024: 'bg-accent-purple text-paper',
  2048: 'bg-accent-green text-paper',
}

const pos = (i: number) => GAP + i * (CELL + GAP)

export function Game2048App() {
  const [tiles, setTiles] = useState<Tile[]>(newGame)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem('hamidos-2048-best') ?? 0))
  const [over, setOver] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const tilesRef = useRef(tiles)
  tilesRef.current = tiles
  const scoreRef = useRef(score)
  scoreRef.current = score

  const handleMove = useCallback((dir: Direction) => {
    const { tiles: slid, gained, moved } = move(tilesRef.current, dir)
    if (!moved) return
    // Drop merged-away tiles (value 0), then spawn a new one
    const settled = spawnTile(slid.filter((t) => t.value !== 0))
    setTiles(settled)
    if (gained > 0) {
      const ns = scoreRef.current + gained
      setScore(ns)
      setBest((b) => {
        const nb = Math.max(b, ns)
        localStorage.setItem('hamidos-2048-best', String(nb))
        return nb
      })
    }
    if (!hasMoves(settled)) setOver(true)
  }, [])

  const restart = () => {
    setTiles(newGame())
    setScore(0)
    setOver(false)
  }

  useEffect(() => {
    const keys: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    }
    const onKey = (e: KeyboardEvent) => {
      const dir = keys[e.key]
      if (!dir) return
      e.preventDefault()
      handleMove(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left')
    else handleMove(dy > 0 ? 'down' : 'up')
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-3" style={{ width: BOARD }}>
        <span className="text-2xl font-bold">2048</span>
        <div className="ml-auto border-2 border-ink bg-cream px-3 py-1 text-center shadow-flat-sm">
          <div className="font-mono text-[10px] uppercase">Score</div>
          <div className="font-mono font-bold leading-tight">{score}</div>
        </div>
        <div className="border-2 border-ink bg-cream px-3 py-1 text-center shadow-flat-sm">
          <div className="font-mono text-[10px] uppercase">Best</div>
          <div className="font-mono font-bold leading-tight">{best}</div>
        </div>
        <motion.button
          onClick={restart}
          whileHover={{ rotate: -3, scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="border-2 border-ink bg-accent-yellow px-3 py-2 font-mono text-sm font-bold shadow-flat-sm"
        >
          New
        </motion.button>
      </div>

      <div
        className="relative touch-none border-[3px] border-ink bg-ink/10 shadow-flat"
        style={{ width: BOARD, height: BOARD }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {Array.from({ length: SIZE * SIZE }, (_, i) => (
          <div
            key={i}
            className="absolute bg-cream"
            style={{
              width: CELL,
              height: CELL,
              left: pos(i % SIZE),
              top: pos(Math.floor(i / SIZE)),
            }}
          />
        ))}
        <AnimatePresence>
          {tiles.map((tile) => (
            <motion.div
              key={tile.id}
              initial={
                tile.spawned
                  ? { scale: 0, x: pos(tile.col), y: pos(tile.row) }
                  : false
              }
              animate={{ scale: 1, x: pos(tile.col), y: pos(tile.row) }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 34 }}
              className={`absolute left-0 top-0 flex items-center justify-center border-2 border-ink font-mono font-bold ${
                TILE_STYLE[tile.value] ?? 'bg-ink text-paper'
              } ${tile.value >= 1000 ? 'text-lg' : 'text-2xl'}`}
              style={{ width: CELL, height: CELL }}
            >
              {tile.value}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {over && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-cream/90"
            >
              <span className="text-2xl font-bold">Game over!</span>
              <motion.button
                onClick={restart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="border-[3px] border-ink bg-accent-red px-4 py-2 font-bold text-paper shadow-flat"
              >
                Try again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="font-mono text-xs opacity-60">arrows / WASD / swipe</p>
    </div>
  )
}
