/**
 * ThemeContext - Global Theme Management
 *
 * This context allows you to:
 * - Swap entire color schemes
 * - Toggle between light/dark modes
 * - Override specific tokens
 *
 * Usage:
 * const { theme, tokens, switchTheme } = useTheme();
 */

import React, { createContext, useContext, useState } from "react";
import { tokens as defaultTokens } from "./tokens";

const ThemeContext = createContext();

// Theme presets for easy switching
export const THEME_PRESETS = {
  light: {
    name: "Light",
    tokens: defaultTokens,
  },
  mathFun: {
    name: "Math Fun",
    tokens: {
      ...defaultTokens,
      colors: {
        ...defaultTokens.colors,
        primary: defaultTokens.colors.primary,
        secondary: defaultTokens.colors.secondary,
        success: defaultTokens.colors.success,
        warning: defaultTokens.colors.warning,
      },
    },
  },
  // Add more presets as needed
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [tokenOverrides, setTokenOverrides] = useState({});

  // Get current tokens (merged with overrides)
  const getTokens = () => {
    const preset = THEME_PRESETS[currentTheme];
    if (!preset) return defaultTokens;

    // Deep merge tokens with overrides
    return mergeTokens(preset.tokens, tokenOverrides);
  };

  const switchTheme = (themeName) => {
    if (THEME_PRESETS[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const updateTokens = (overrides) => {
    setTokenOverrides(overrides);
  };

  const resetTheme = () => {
    setCurrentTheme("light");
    setTokenOverrides({});
  };

  const value = {
    currentTheme,
    tokens: getTokens(),
    switchTheme,
    updateTokens,
    resetTheme,
    availableThemes: Object.keys(THEME_PRESETS),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to use theme anywhere in the app
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

/**
 * Deep merge utility for tokens
 */
const mergeTokens = (base, overrides) => {
  const result = { ...base };

  Object.keys(overrides).forEach((key) => {
    if (
      typeof overrides[key] === "object" &&
      overrides[key] !== null &&
      !Array.isArray(overrides[key])
    ) {
      result[key] = mergeTokens(base[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  });

  return result;
};
