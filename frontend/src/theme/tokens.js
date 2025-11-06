/**
 * Design Tokens - Global Theme System
 *
 * This file contains all design tokens (colors, spacing, typography, animations, etc.)
 * Change values here to update the entire app's appearance.
 *
 * Structure:
 * - colors: Color palette for UI elements
 * - spacing: Consistent spacing scale
 * - typography: Font sizes and weights
 * - animations: Reusable animation definitions
 * - shadows: Depth and elevation
 * - borderRadius: Consistency across components
 * - transitions: Animation timings
 */

export const tokens = {
  // ============================================================================
  // COLORS - Update these to change the entire theme
  // ============================================================================
  colors: {
    // Primary - Main brand color (Learning, Problem-solving)
    primary: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6", // Main purple
      600: "#7c3aed", // Darker
      700: "#6d28d9", // Darkest
      800: "#5b21b6",
      900: "#4c1d95",
    },

    // Secondary - Accent color (Discovery, Hints)
    secondary: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6", // Main teal
      600: "#0d9488", // Darker
      700: "#0f766e", // Darkest
      800: "#115e59",
      900: "#134e4a",
    },

    // Success - Correct answers, positive feedback
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e", // Main green
      600: "#16a34a", // Darker
      700: "#15803d", // Darkest
      800: "#166534",
      900: "#145231",
    },

    // Warning - Hints, suggestions, explorations
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Main amber
      600: "#d97706", // Darker
      700: "#b45309", // Darkest
      800: "#92400e",
      900: "#78350f",
    },

    // Danger - Errors, critical feedback
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444", // Main red
      600: "#dc2626", // Darker
      700: "#b91c1c", // Darkest
      800: "#991b1b",
      900: "#7f1d1d",
    },

    // Neutral - Backgrounds, text, borders
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

    // Background colors
    bg: {
      light: "#ffffff",
      lighter: "#fafaf9", // Off-white
      page: "#f9f5ff", // Subtle purple tint
      sidebar: "#f5f5f4", // Light neutral
      dark: "#1c1917", // Dark mode option
    },

    // Text colors
    text: {
      primary: "#1c1917", // Very dark gray
      secondary: "#57534e", // Medium gray
      tertiary: "#a8a29e", // Light gray
      inverse: "#ffffff", // For light backgrounds
      muted: "#d6d3d1", // Very light gray
    },

    // AI/Assistant specific
    assistant: {
      bg: "#7c3aed", // Purple gradient start
      bgEnd: "#6d28d9", // Purple gradient end
      border: "#c4b5fd", // Light purple
      text: "#ffffff",
    },

    // User specific
    user: {
      bg: "#ffffff",
      text: "#1c1917",
      border: "#e7e5e4",
    },

    // Math-specific (for equation highlighting)
    math: {
      bg: "#f0f9ff", // Light blue background for math
      border: "#3b82f6", // Blue border
      glow: "#3b82f6", // Glow effect
    },

    // Status indicators
    status: {
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },

  // ============================================================================
  // SPACING - Consistent spacing scale (multiples of 4px)
  // ============================================================================
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

  // ============================================================================
  // TYPOGRAPHY
  // ============================================================================
  typography: {
    fontFamily: {
      sans: '"Inter", "system-ui", "sans-serif"',
      mono: '"Fira Code", "Courier New", "monospace"',
      math: '"STIX Two Math", "serif"', // Good for rendering math
    },

    fontSize: {
      xs: {
        size: "12px",
        lineHeight: "16px",
      },
      sm: {
        size: "14px",
        lineHeight: "20px",
      },
      base: {
        size: "16px",
        lineHeight: "24px",
      },
      lg: {
        size: "18px",
        lineHeight: "28px",
      },
      xl: {
        size: "20px",
        lineHeight: "28px",
      },
      "2xl": {
        size: "24px",
        lineHeight: "32px",
      },
      "3xl": {
        size: "30px",
        lineHeight: "36px",
      },
      "4xl": {
        size: "36px",
        lineHeight: "44px",
      },
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // ============================================================================
  // SHADOWS - For depth and elevation
  // ============================================================================
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glow: `0 0 20px rgba(123, 58, 237, 0.3)`, // Purple glow
    "glow-success": `0 0 20px rgba(34, 197, 94, 0.3)`, // Green glow
    "glow-warning": `0 0 20px rgba(245, 158, 11, 0.3)`, // Amber glow
  },

  // ============================================================================
  // BORDER RADIUS
  // ============================================================================
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

  // ============================================================================
  // TRANSITIONS & ANIMATIONS
  // ============================================================================
  transitions: {
    fast: "150ms ease-out",
    base: "200ms ease-out",
    slow: "300ms ease-out",
    slower: "500ms ease-out",
  },

  animations: {
    // Entrance animations
    fadeIn: {
      name: "fadeIn",
      duration: "200ms",
      timing: "ease-out",
    },
    slideInRight: {
      name: "slideInRight",
      duration: "300ms",
      timing: "ease-out",
    },
    slideInLeft: {
      name: "slideInLeft",
      duration: "300ms",
      timing: "ease-out",
    },
    slideInUp: {
      name: "slideInUp",
      duration: "300ms",
      timing: "ease-out",
    },
    slideInDown: {
      name: "slideInDown",
      duration: "300ms",
      timing: "ease-out",
    },
    scaleIn: {
      name: "scaleIn",
      duration: "200ms",
      timing: "ease-out",
    },

    // Interactive animations
    pulse: {
      name: "pulse",
      duration: "2s",
      timing: "cubic-bezier(0.4, 0, 0.6, 1)",
      iterationCount: "infinite",
    },
    shimmer: {
      name: "shimmer",
      duration: "2s",
      timing: "ease-in-out",
      iterationCount: "infinite",
    },
    bounce: {
      name: "bounce",
      duration: "1s",
      timing: "ease-in-out",
      iterationCount: "infinite",
    },
    spin: {
      name: "spin",
      duration: "1s",
      timing: "linear",
      iterationCount: "infinite",
    },

    // Celebration animations
    pop: {
      name: "pop",
      duration: "600ms",
      timing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    wiggle: {
      name: "wiggle",
      duration: "400ms",
      timing: "ease-in-out",
    },

    // Glow effect
    glow: {
      name: "glow",
      duration: "2s",
      timing: "ease-in-out",
      iterationCount: "infinite",
    },
  },

  // ============================================================================
  // Z-INDEX SCALE
  // ============================================================================
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

  // ============================================================================
  // LAYOUT BREAKPOINTS
  // ============================================================================
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

/**
 * Get a specific token value
 * Usage: getToken('colors.primary.500')
 */
export const getToken = (path) => {
  return path.split(".").reduce((obj, key) => obj?.[key], tokens);
};

/**
 * Quick access to colors
 */
export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const typography = tokens.typography;
export const shadows = tokens.shadows;
export const borderRadius = tokens.borderRadius;
export const transitions = tokens.transitions;
export const animations = tokens.animations;
export const zIndex = tokens.zIndex;
