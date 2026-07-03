import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'cave'

export interface WallpaperDef {
  id: string
  label: string
  /** Path under public/, served from the site root */
  src: string
}

export const wallpapers: WallpaperDef[] = [
  { id: 'wallpaper-1', label: 'Wallpaper 1', src: '/wallpaper-1.jpg' },
]

export const wallpaperById = (id: string) => wallpapers.find((w) => w.id === id)

interface SettingsStore {
  mode: ThemeMode
  wallpaperId: string
  setMode: (mode: ThemeMode) => void
  setWallpaper: (wallpaperId: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      mode: 'light',
      wallpaperId: 'wallpaper-1',
      setMode: (mode) => set({ mode }),
      setWallpaper: (wallpaperId) => set({ wallpaperId }),
    }),
    { name: 'hamidos-settings' },
  ),
)
