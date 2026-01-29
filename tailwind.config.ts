// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Match your theme-provider logic
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#eb1616',
          'primary-light': '#EF4444',
          'primary-dark': '#B91C1C',
        },
        bg: {
          primary: 'var(--bg-primary)', // Map to CSS variables in globals.css
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
        },
      },
      fontFamily: {
        primary: ['var(--font-primary)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-mono)'],
      }
    },
  },
  plugins: [],
};
export default config;