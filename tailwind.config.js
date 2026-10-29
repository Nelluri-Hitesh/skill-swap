/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#fefefe',
        surface: '#f7f8fa',
        surface2: '#f0f1f5',
        border: '#e4e6eb',
        'border-light': '#ededf0',
        text: '#0f1117',
        muted: '#5c6370',
        faint: '#a0a6b1',
        accent: {
          DEFAULT: '#00ABF0',
          dark: '#0090cc',
          light: '#e8f6ff',
          mid: '#b3e5fc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
        focus: '0 0 0 3px rgba(0,171,240,0.15)',
      },
      fontSize: {
        '2xs': '10px',
        xs: '12px',
        sm: '13px',
      },
    },
  },
  plugins: [],
}
