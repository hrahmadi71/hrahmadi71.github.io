/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5f0e8',
        paper: '#fffdf8',
        ink: '#1f1a17',
        accent: {
          red: '#f54e00',
          yellow: '#f9bd2b',
          blue: '#2f80fa',
          green: '#36c46c',
          purple: '#a970ff',
        },
      },
      boxShadow: {
        flat: '4px 4px 0 0 #1f1a17',
        'flat-sm': '2px 2px 0 0 #1f1a17',
        'flat-lg': '8px 8px 0 0 #1f1a17',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
