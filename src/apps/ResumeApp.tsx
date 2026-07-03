import { motion } from 'framer-motion'
import { resume } from '../data/resume'
import { appById } from './registry'
import { useWindowStore } from '../store/windowStore'

const section = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24, delay: 0.08 * i },
  }),
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-3 inline-block border-b-4 border-accent-red pb-0.5 text-lg font-bold uppercase tracking-widest">
      {children}
    </h2>
  )
}

export function ResumeApp() {
  const openApp = useWindowStore((s) => s.openApp)
  const openLink = (label: string, url: string) => {
    const browser = appById('browser')
    if (!browser) return
    openApp({
      appId: browser.id,
      title: `${label} — ${browser.title}`,
      defaultSize: browser.defaultSize,
      params: { url },
    })
  }
  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-8">
      <motion.header custom={0} variants={section} initial="hidden" animate="show">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{resume.name}</h1>
        <p className="mt-1 font-mono text-accent-red">{resume.title}</p>
        <p className="mt-4 leading-relaxed">{resume.summary}</p>
      </motion.header>

      <motion.section custom={1} variants={section} initial="hidden" animate="show" className="mt-8">
        <SectionTitle>Skills</SectionTitle>
        <ul className="flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <li
              key={skill}
              className="border-2 border-ink bg-cream px-2.5 py-1 font-mono text-sm shadow-flat-sm"
            >
              {skill}
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section custom={2} variants={section} initial="hidden" animate="show" className="mt-8">
        <SectionTitle>Experience</SectionTitle>
        <ol className="space-y-6">
          {resume.experience.map((job) => (
            <li key={`${job.company}-${job.role}`} className="border-l-4 border-ink pl-4">
              <h3 className="font-bold">{job.role}</h3>
              <p className="font-mono text-sm">
                {job.company} · {job.period}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.footer custom={3} variants={section} initial="hidden" animate="show" className="mt-8">
        <SectionTitle>Links</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {resume.links.map((link) => (
            <motion.button
              key={link.label}
              type="button"
              onClick={() => openLink(link.label, link.url)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="border-[3px] border-ink bg-accent-yellow px-4 py-1.5 font-bold shadow-flat"
            >
              {link.label} ↗
            </motion.button>
          ))}
        </div>
      </motion.footer>
    </div>
  )
}
