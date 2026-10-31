export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#08090b', 900: '#0d0f12', 800: '#13161a', 700: '#1a1d23', 600: '#252932', 500: '#343945' },
        accent: { DEFAULT: '#7c8cff', strong: '#5b6cf0' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
