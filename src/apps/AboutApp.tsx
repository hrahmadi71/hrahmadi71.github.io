import { motion } from 'framer-motion'
import { resume } from '../data/resume'

const stack = ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Vite']

const item = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24, delay: 0.08 * i },
  }),
}

export function AboutApp() {
  return (
    <div className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
      <motion.div
        initial={{ scale: 0, rotate: -14 }}
        animate={{ scale: 1, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        className="border-[3px] border-ink bg-accent-red px-5 py-3 font-mono text-3xl font-bold text-[#fffdf8] shadow-flat-lg"
      >
        HamidOS
      </motion.div>

      <motion.p custom={1} variants={item} initial="hidden" animate="show" className="font-mono text-sm font-bold">
        version 1.0 — “Flat Cartoon”
      </motion.p>

      <motion.p custom={2} variants={item} initial="hidden" animate="show" className="max-w-sm leading-relaxed">
        A tiny operating system living in your browser — the portfolio of {resume.name},{' '}
        {resume.title.toLowerCase()}. Windows drag, icons wander, and the taskbar keeps time.
      </motion.p>

      <motion.ul custom={3} variants={item} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-2">
        {stack.map((tech) => (
          <li key={tech} className="border-2 border-ink bg-cream px-2.5 py-1 font-mono text-xs shadow-flat-sm">
            {tech}
          </li>
        ))}
      </motion.ul>

      <motion.div custom={4} variants={item} initial="hidden" animate="show" className="flex flex-wrap justify-center gap-3">
        {resume.links.map((link) => (
          <motion.a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="border-[3px] border-ink bg-accent-yellow px-4 py-1.5 font-bold text-[#1f1a17] shadow-flat"
          >
            {link.label} ↗
          </motion.a>
        ))}
      </motion.div>

      <motion.p custom={5} variants={item} initial="hidden" animate="show" className="font-mono text-xs opacity-60">
        © {new Date().getFullYear()} {resume.name}. All windows reserved.
      </motion.p>
    </div>
  )
}
