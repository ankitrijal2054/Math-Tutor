/** @type {import('tailwindcss').Config} */

// Define tokens inline to avoid import issues at build time
const tokens = {
  colors: {
    primary: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },
    secondary: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#145231",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },
    neutral: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716b",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    "4xl": "64px",
  },
  typography: {
    fontFamily: {
      sans: '"Inter", "system-ui", "sans-serif"',
      mono: '"Fira Code", "Courier New", "monospace"',
      math: '"STIX Two Math", "serif"',
    },
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glow: "0 0 20px rgba(123, 58, 237, 0.3)",
    "glow-success": "0 0 20px rgba(34, 197, 94, 0.3)",
    "glow-warning": "0 0 20px rgba(245, 158, 11, 0.3)",
  },
  borderRadius: {
    none: "0px",
    sm: "4px",
    base: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    full: "9999px",
  },
  transitions: {
    fast: "150ms ease-out",
    base: "200ms ease-out",
    slow: "300ms ease-out",
    slower: "500ms ease-out",
  },
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // ========================================================================
      // COLORS - From centralized tokens
      // ========================================================================
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        danger: tokens.colors.danger,
        neutral: tokens.colors.neutral,
        "bg-light": tokens.colors.bg.light,
        "bg-lighter": tokens.colors.bg.lighter,
        "bg-page": tokens.colors.bg.page,
        "bg-sidebar": tokens.colors.bg.sidebar,
        "bg-dark": tokens.colors.bg.dark,
        "text-primary": tokens.colors.text.primary,
        "text-secondary": tokens.colors.text.secondary,
        "text-tertiary": tokens.colors.text.tertiary,
        "text-inverse": tokens.colors.text.inverse,
        "text-muted": tokens.colors.text.muted,
        "assistant-bg": tokens.colors.assistant.bg,
        "assistant-bg-end": tokens.colors.assistant.bgEnd,
        "user-bg": tokens.colors.user.bg,
        "math-bg": tokens.colors.math.bg,
        "math-border": tokens.colors.math.border,
      },

      // ========================================================================
      // SPACING - From centralized tokens
      // ========================================================================
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
        "2xl": tokens.spacing["2xl"],
        "3xl": tokens.spacing["3xl"],
        "4xl": tokens.spacing["4xl"],
      },

      // ========================================================================
      // TYPOGRAPHY
      // ========================================================================
      fontFamily: {
        sans: tokens.typography.fontFamily.sans,
        mono: tokens.typography.fontFamily.mono,
        math: tokens.typography.fontFamily.math,
      },

      fontSize: Object.entries(tokens.typography.fontSize).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: [value.size, value.lineHeight],
        }),
        {}
      ),

      fontWeight: tokens.typography.fontWeight,

      // ========================================================================
      // BORDER RADIUS - From centralized tokens
      // ========================================================================
      borderRadius: tokens.borderRadius,

      // ========================================================================
      // SHADOWS - From centralized tokens
      // ========================================================================
      boxShadow: {
        sm: tokens.shadows.sm,
        base: tokens.shadows.base,
        md: tokens.shadows.md,
        lg: tokens.shadows.lg,
        xl: tokens.shadows.xl,
        "2xl": tokens.shadows["2xl"],
        glow: tokens.shadows.glow,
        "glow-success": tokens.shadows["glow-success"],
        "glow-warning": tokens.shadows["glow-warning"],
      },

      // ========================================================================
      // TRANSITIONS
      // ========================================================================
      transitionDuration: {
        fast: tokens.transitions.fast,
        base: tokens.transitions.base,
        slow: tokens.transitions.slow,
        slower: tokens.transitions.slower,
      },

      // ========================================================================
      // ANIMATIONS & KEYFRAMES
      // ========================================================================
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
      },

      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        slideInRight: "slideInRight 300ms ease-out",
        slideInLeft: "slideInLeft 300ms ease-out",
        slideInUp: "slideInUp 300ms ease-out",
        slideInDown: "slideInDown 300ms ease-out",
        scaleIn: "scaleIn 200ms ease-out",
        shimmer: "shimmer 2s infinite",
        bounce: "bounce 1s ease-in-out infinite",
        pop: "pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        wiggle: "wiggle 400ms ease-in-out",
        glow: "glow 2s ease-in-out infinite",
      },

      // ========================================================================
      // Z-INDEX
      // ========================================================================
      zIndex: tokens.zIndex,
    },
  },
  plugins: [],
};
