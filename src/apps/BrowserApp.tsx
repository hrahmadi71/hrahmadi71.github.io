import { motion } from 'framer-motion'
import { BrowserIcon } from '../components/icons/FlatIcons'
import type { AppProps } from './registry'

// Sites that send X-Frame-Options / CSP frame-ancestors and therefore
// refuse to render inside an iframe. For these we show a friendly panel
// instead of the browser's gray "refused to connect" error page.
const EMBED_BLOCKED_HOSTS = ['github.com', 'linkedin.com', 'stackoverflow.com']

function blockedHost(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const blocked = EMBED_BLOCKED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
    return blocked ? host : null
  } catch {
    return null
  }
}

// Minimal in-OS browser: a read-only address bar plus an iframe.
export function BrowserApp({ params }: AppProps) {
  const url = params?.url
  if (!url) {
    return <div className="p-6 font-mono text-sm">Nothing to show — no URL given.</div>
  }
  const blocked = blockedHost(url)
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b-[3px] border-ink bg-cream px-2 py-1.5">
        <span
          className="min-w-0 grow truncate border-2 border-ink bg-paper px-2 py-1 font-mono text-xs"
          title={url}
        >
          {url}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          title="Open in new tab"
          aria-label="Open in new tab"
          className="shrink-0 border-2 border-ink bg-accent-yellow px-2 py-1 font-bold leading-none shadow-flat-sm"
        >
          ↗
        </a>
      </div>
      {blocked ? (
        <div className="flex min-h-0 grow flex-col items-center justify-center gap-5 bg-cream p-6 text-center">
          <div className="h-16 w-16 opacity-80">
            <BrowserIcon />
          </div>
          <p className="max-w-sm font-mono text-sm leading-relaxed">
            <span className="font-bold">{blocked}</span> doesn’t allow itself to be embedded
            inside other sites, so it can’t be shown here.
          </p>
          <motion.a
            href={url}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="border-[3px] border-ink bg-accent-yellow px-4 py-1.5 font-bold shadow-flat"
          >
            Open in new tab ↗
          </motion.a>
        </div>
      ) : (
        <iframe src={url} title={url} className="min-h-0 w-full grow border-0 bg-white" />
      )}
    </div>
  )
}
