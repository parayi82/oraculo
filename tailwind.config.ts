import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        oracle: {
          bg:          '#080614',
          surface:     '#110D28',
          up:          '#1A1540',
          hi:          '#231E55',
          gold:        '#F2A800',
          'gold-dim':  'rgba(242,168,0,0.14)',
          teal:        '#00D4B8',
          magenta:     '#D41880',
          violet:      '#8B5CF6',
          text:        '#EDE5FA',
          mid:         '#A290C4',
          dim:         '#6B5E8A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Palatino Linotype', 'serif'],
        sans:  ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float':      'float 5s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'fade-up':    'fadeUp .6s ease forwards',
        'reveal':     'reveal .8s ease forwards',
      },
      keyframes: {
        glowPulse: {
          '0%,100%': { opacity: '0.7' },
          '50%':     { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { opacity: '0', filter: 'blur(20px)', transform: 'scale(0.95)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
