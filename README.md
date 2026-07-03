# HamidOS 🖥️

My personal site at [hrahmadi71.github.io](https://hrahmadi71.github.io) — a flat, animated, OS-like desktop in the browser. Icons open draggable windows: a resume viewer, a 2048 game, and more to come (terminal/chat, mini-games).

Built with **Vite + React + TypeScript + Tailwind CSS**, animated with **Framer Motion**, windows managed with **Zustand** + **react-rnd**.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

## Adding a new app

Every desktop app is one registry entry. Create a component in `src/apps/`, then register it in `src/apps/registry.tsx`:

```tsx
{
  id: 'terminal',
  label: 'terminal',
  title: 'Terminal',
  icon: TerminalIcon,           // flat SVG in src/components/icons/
  component: TerminalApp,
  defaultSize: { width: 600, height: 420 },
  accent: 'bg-accent-green',    // titlebar color
}
```

The window manager (drag, resize, minimize, maximize, z-order, mobile full-screen fallback) is handled for you.

## Editing the resume

Content lives in `src/data/resume.ts` — no JSX involved.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages.
