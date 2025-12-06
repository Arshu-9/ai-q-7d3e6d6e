import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Stranger Things Theme Colors
        "neon-red": {
          DEFAULT: "hsl(var(--neon-red))",
          glow: "hsl(var(--neon-red-glow))",
        },
        "demogorgon": "hsl(var(--demogorgon-purple))",
        "electric-blue": "hsl(var(--electric-blue))",
        "upside-down": "hsl(var(--upside-down))",
        "hawkins-dark": "hsl(var(--hawkins-dark))",
        "christmas": {
          red: "hsl(var(--christmas-light-red))",
          blue: "hsl(var(--christmas-light-blue))",
          green: "hsl(var(--christmas-light-green))",
          yellow: "hsl(var(--christmas-light-yellow))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            textShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary))",
            opacity: "1",
          },
          "20%, 24%, 55%": {
            textShadow: "none",
            opacity: "0.8",
          },
        },
        "christmas-flicker": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "10%": { opacity: "0.4" },
          "20%": { opacity: "1" },
          "30%": { opacity: "0.6" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "70%": { opacity: "0.5" },
          "80%": { opacity: "1" },
          "90%": { opacity: "0.7" },
        },
        "portal-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 30px hsl(var(--primary) / 0.5), 0 0 60px hsl(var(--secondary) / 0.3)",
          },
          "50%": {
            boxShadow: "0 0 50px hsl(var(--primary) / 0.7), 0 0 100px hsl(var(--secondary) / 0.5)",
          },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--secondary) / 0.3)" },
        },
        "vhs-static": {
          "0%": { transform: "translateX(0)" },
          "10%": { transform: "translateX(-2px)" },
          "20%": { transform: "translateX(2px)" },
          "30%": { transform: "translateX(-1px)" },
          "40%": { transform: "translateX(1px)" },
          "50%": { transform: "translateX(0)" },
          "60%": { transform: "translateX(-2px)" },
          "70%": { transform: "translateX(1px)" },
          "80%": { transform: "translateX(-1px)" },
          "90%": { transform: "translateX(2px)" },
          "100%": { transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "sound-wave": {
          "0%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.5)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-flicker": "neon-flicker 3s ease-in-out infinite",
        "christmas-flicker": "christmas-flicker 1.5s ease-in-out infinite",
        "portal-pulse": "portal-pulse 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "vhs-static": "vhs-static 0.5s steps(10) infinite",
        "float": "float 6s ease-in-out infinite",
        "sound-wave": "sound-wave 0.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-upside-down": "linear-gradient(180deg, hsl(280 80% 8%), hsl(220 50% 3%))",
        "gradient-portal": "radial-gradient(ellipse at center, hsl(0 100% 30% / 0.3), transparent 70%)",
        "gradient-fog": "linear-gradient(180deg, transparent, hsl(220 50% 3% / 0.8))",
        "gradient-neon-red": "linear-gradient(135deg, hsl(0 100% 50%), hsl(0 100% 40%))",
        "gradient-neon-purple": "linear-gradient(135deg, hsl(280 100% 60%), hsl(300 100% 40%))",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "neon-red": "0 0 20px hsl(0 100% 50% / 0.6), 0 0 40px hsl(0 100% 50% / 0.3)",
        "neon-purple": "0 0 20px hsl(280 100% 60% / 0.6), 0 0 40px hsl(280 100% 60% / 0.3)",
        "neon-blue": "0 0 20px hsl(200 100% 55% / 0.6), 0 0 40px hsl(200 100% 55% / 0.3)",
        "portal": "0 0 60px hsl(0 100% 50% / 0.4), 0 0 100px hsl(280 100% 60% / 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
