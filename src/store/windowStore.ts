import { create } from 'zustand'

export interface WindowInstance {
  id: string
  appId: string
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  /** Per-window data passed to the app component, e.g. a URL for the browser */
  params?: Record<string, string>
}

export interface AppLaunchConfig {
  appId: string
  title: string
  defaultSize: { width: number; height: number }
  params?: Record<string, string>
}

const sameParams = (a?: Record<string, string>, b?: Record<string, string>) =>
  JSON.stringify(a ?? {}) === JSON.stringify(b ?? {})

interface WindowStore {
  windows: WindowInstance[]
  focusedId: string | null
  zCounter: number
  openApp: (config: AppLaunchConfig) => void
  close: (id: string) => void
  focus: (id: string) => void
  restore: (id: string) => void
  minimize: (id: string) => void
  toggleMaximize: (id: string) => void
  setBounds: (id: string, bounds: Partial<Pick<WindowInstance, 'x' | 'y' | 'width' | 'height'>>) => void
}

const CASCADE_STEP = 32

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  focusedId: null,
  zCounter: 10,

  openApp: (config) => {
    const { windows, zCounter } = get()
    const existing = windows.find(
      (w) => w.appId === config.appId && sameParams(w.params, config.params),
    )
    if (existing) {
      // Un-minimize and bring to front instead of spawning a duplicate
      set({
        windows: windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, zIndex: zCounter + 1 } : w,
        ),
        focusedId: existing.id,
        zCounter: zCounter + 1,
      })
      return
    }

    const { width, height } = config.defaultSize
    const vw = window.innerWidth
    const vh = window.innerHeight
    const offset = (windows.length % 5) * CASCADE_STEP
    const win: WindowInstance = {
      id: `${config.appId}-${Date.now()}`,
      appId: config.appId,
      title: config.title,
      x: Math.max(12, (vw - width) / 2 + offset),
      y: Math.max(12, (vh - height) / 2.5 + offset),
      width: Math.min(width, vw - 24),
      height: Math.min(height, vh - 80),
      zIndex: zCounter + 1,
      minimized: false,
      maximized: false,
      params: config.params,
    }
    set({ windows: [...windows, win], focusedId: win.id, zCounter: zCounter + 1 })
  },

  close: (id) =>
    set((s) => ({
      windows: s.windows.filter((w) => w.id !== id),
      focusedId: s.focusedId === id ? null : s.focusedId,
    })),

  focus: (id) =>
    set((s) => {
      if (s.focusedId === id) return s
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, zIndex: s.zCounter + 1 } : w)),
        focusedId: id,
        zCounter: s.zCounter + 1,
      }
    }),

  restore: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: s.zCounter + 1 } : w,
      ),
      focusedId: id,
      zCounter: s.zCounter + 1,
    })),

  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      focusedId: s.focusedId === id ? null : s.focusedId,
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    })),

  setBounds: (id, bounds) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...bounds } : w)),
    })),
}))
