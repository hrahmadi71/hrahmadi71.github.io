import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../store/windowStore'
import { appById } from '../apps/registry'
import { Window } from './Window'

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows)

  return (
    <div className="pointer-events-none absolute inset-0 bottom-14 overflow-hidden">
      <AnimatePresence>
        {windows.map((win) => {
          const app = appById(win.appId)
          if (!app) return null
          const Body = app.component
          return (
            <Window key={win.id} win={win} accent={app.accent}>
              <Body params={win.params} />
            </Window>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
