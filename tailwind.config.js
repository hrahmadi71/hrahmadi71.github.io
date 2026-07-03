/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base colors are CSS variables so dark/cave modes can swap them
        // (see :root[data-theme=...] in index.css).
        cream: 'rgb(var(--cream) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        accent: {
          red: '#f54e00',
          yellow: '#f9bd2b',
          blue: '#2f80fa',
          green: '#36c46c',
          purple: '#a970ff',
        },
      },
      boxShadow: {
        flat: '4px 4px 0 0 rgb(var(--ink))',
        'flat-sm': '2px 2px 0 0 rgb(var(--ink))',
        'flat-lg': '8px 8px 0 0 rgb(var(--ink))',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
