import type { ComponentType } from 'react'
import { ResumeApp } from './ResumeApp'
import { Game2048App } from './Game2048App'
import { AppearanceApp } from './AppearanceApp'
import { AboutApp } from './AboutApp'
import { BrowserApp } from './BrowserApp'
import { VocalExerciseApp } from './VocalExerciseApp'
import {
  PdfFileIcon,
  Game2048Icon,
  AppearanceIcon,
  AboutIcon,
  BrowserIcon,
  PianoIcon,
} from '../components/icons/FlatIcons'

/** Props every app component receives; `params` comes from the window instance. */
export interface AppProps {
  params?: Record<string, string>
}

export interface AppDef {
  id: string
  /** Label under the desktop icon */
  label: string
  /** Window titlebar text */
  title: string
  icon: ComponentType
  component: ComponentType<AppProps>
  defaultSize: { width: number; height: number }
  /** Tailwind bg class for the window titlebar */
  accent: string
  /** Show an icon on the desktop (default true); false = launched elsewhere, e.g. context menu */
  desktop?: boolean
}

export const apps: AppDef[] = [
  {
    id: 'resume',
    label: 'resume.pdf',
    title: 'resume.pdf — Viewer',
    icon: PdfFileIcon,
    component: ResumeApp,
    defaultSize: { width: 680, height: 620 },
    accent: 'bg-accent-yellow',
  },
  {
    id: '2048',
    label: '2048',
    title: '2048',
    icon: Game2048Icon,
    component: Game2048App,
    defaultSize: { width: 480, height: 560 },
    accent: 'bg-accent-blue',
  },
  {
    id: 'vocal-exercise',
    label: 'Vocal Exercise',
    title: 'Vocal Exercise',
    icon: PianoIcon,
    component: VocalExerciseApp,
    defaultSize: { width: 860, height: 420 },
    accent: 'bg-accent-purple',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    title: 'Appearance Settings',
    icon: AppearanceIcon,
    component: AppearanceApp,
    defaultSize: { width: 480, height: 560 },
    accent: 'bg-accent-purple',
    desktop: false,
  },
  {
    id: 'browser',
    label: 'Browser',
    title: 'Browser',
    icon: BrowserIcon,
    component: BrowserApp,
    defaultSize: { width: 900, height: 640 },
    accent: 'bg-accent-blue',
    desktop: false,
  },
  {
    id: 'about',
    label: 'About',
    title: 'About HamidOS',
    icon: AboutIcon,
    component: AboutApp,
    defaultSize: { width: 440, height: 520 },
    accent: 'bg-accent-green',
    desktop: false,
  },
]

export const appById = (id: string) => apps.find((a) => a.id === id)
