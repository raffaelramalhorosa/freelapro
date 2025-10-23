import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Animações críticas
    'animate-fadeIn',
    'animate-blob',
    'animate-shimmer',
    'animate-float',
    'animate-pulse',
    'animate-spin',
    'animate-gradient',
    'animate-growHeight',
    // Delays de animação
    'animation-delay-200',
    'animation-delay-500',
    'animation-delay-700',
    'animation-delay-1000',
    'animation-delay-2000',
    'animation-delay-4000',
    // Cores dinâmicas usadas em gradientes
    {
      pattern: /^(bg|text|border|from|to|via)-(primary|secondary|tertiary|purple|pink|indigo|green)/,
    },
  ],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-scale": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "glow-rotate": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "badge-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" 
          },
          "50%": { 
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.8), 0 0 60px rgba(168, 85, 247, 0.6)" 
          }
        },
        "float": {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px) translateZ(0)",
            opacity: "0.3"
          },
          "25%": { 
            transform: "translateY(-20px) translateX(10px) translateZ(0)",
            opacity: "0.6"
          },
          "50%": { 
            transform: "translateY(-40px) translateX(-10px) translateZ(0)",
            opacity: "0.4"
          },
          "75%": { 
            transform: "translateY(-20px) translateX(-15px) translateZ(0)",
            opacity: "0.5"
          }
        },
        "ripple-animation": {
          "to": {
            transform: "scale(4)",
            opacity: "0"
          }
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        "draw-checkmark": {
          "to": {
            strokeDashoffset: "0"
          }
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" }
        },
        "progress-shine": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" }
        },
        "bounce-in": {
          "0%": { 
            transform: "scale(0.9)",
            opacity: "0"
          },
          "50%": { 
            transform: "scale(1.05)"
          },
          "100%": { 
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "trail-fade": {
          "0%": {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1)"
          },
          "100%": {
            opacity: "0",
            transform: "translate(-50%, -50%) scale(0.5)"
          }
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translateY(0) rotate(0deg)"
          },
          "50%": {
            transform: "translateY(-30px) rotate(5deg)"
          }
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)"
          },
          "100%": {
            transform: "rotate(360deg)"
          }
        },
        "rise": {
          "0%": {
            transform: "translateY(0) scale(1)",
            opacity: "1"
          },
          "100%": {
            transform: "translateY(-100vh) scale(0.5)",
            opacity: "0"
          }
        },
        "blob": {
          "0%, 100%": { transform: "translate(0, 0) scale(1) translateZ(0)" },
          "25%": { transform: "translate(20px, -50px) scale(1.1) translateZ(0)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.9) translateZ(0)" },
          "75%": { transform: "translate(50px, 50px) scale(1.05) translateZ(0)" }
        },
        "gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "draw": {
          "to": { strokeDashoffset: "0" }
        },
        "growHeight": {
          "from": { 
            "transform": "scaleY(0) translateZ(0)",
            "transform-origin": "bottom"
          },
          "to": { 
            "transform": "scaleY(1) translateZ(0)",
            "transform-origin": "bottom"
          }
        },
        "fadeIn": {
          "from": { opacity: "0", transform: "translateY(20px) translateZ(0)" },
          "to": { opacity: "1", transform: "translateY(0) translateZ(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "fade-in-scale": "fade-in-scale 0.5s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow-rotate": "glow-rotate 3s linear infinite",
        "badge-pulse": "badge-pulse 2s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "ripple": "ripple-animation 0.6s ease-out",
        "shimmer": "shimmer 1.5s infinite",
        "checkmark": "draw-checkmark 0.6s ease-out forwards",
        "shake": "shake 0.5s ease-in-out",
        "progress-shine": "progress-shine 2s infinite",
        "bounce-in": "bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "trail-fade": "trail-fade 1s ease-out forwards",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        "rise": "rise 10s linear infinite",
        "blob": "blob 7s infinite",
        "gradient": "gradient 3s linear infinite",
        "draw": "draw 2s ease forwards",
        "growHeight": "growHeight 1s ease-out forwards",
        "fadeIn": "fadeIn 0.6s ease-out forwards",
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
