/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Barlow Condensed', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: {
          DEFAULT: '#050505',
          paper: '#0B0E14',
          subtle: '#121212',
        },
        primary: {
          DEFAULT: '#00FF88',
          light: '#5CFFB1',
          dark: '#00CC6A',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#FF0055',
          light: '#FF5C8D',
          dark: '#CC0044',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#FAFF00',
          foreground: '#000000',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          tertiary: '#64748B',
          disabled: '#475569',
        },
        status: {
          live: '#00FF88',
          finished: '#94A3B8',
          scheduled: '#64748B',
          'card-yellow': '#FAFF00',
          'card-red': '#FF0055',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          active: 'rgba(0, 255, 136, 0.3)',
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 136, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        "pulse-glow": {
          "0%": { boxShadow: "0 0 0 0 rgba(0, 255, 136, 0.4)" },
          "70%": { boxShadow: "0 0 0 10px rgba(0, 255, 136, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(0, 255, 136, 0)" },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "score-flash": {
          "0%": { backgroundColor: "rgba(0, 255, 136, 0.3)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "score-flash": "score-flash 1s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
