/**
 * useTokens - Hook for accessing design tokens in components
 *
 * Usage:
 * const { colors, spacing, borderRadius, getColorClass } = useTokens();
 *
 * className={getColorClass('primary', 500, 'bg')}
 */

import { useTheme } from "./ThemeContext";

export const useTokens = () => {
  const { tokens } = useTheme();

  /**
   * Get a specific token value by path
   * Usage: getToken('colors.primary.500')
   */
  const getToken = (path) => {
    return path.split(".").reduce((obj, key) => obj?.[key], tokens);
  };

  /**
   * Get CSS class for color
   * Usage: getColorClass('primary', 500, 'bg') -> class for background color
   * Types: 'text', 'bg', 'border'
   */
  const getColorClass = (colorFamily, shade, type = "text") => {
    const colorValue = tokens.colors[colorFamily]?.[shade];
    if (!colorValue) return "";

    // This assumes you're using Tailwind, so we return hex values to use in style
    // In a real app, you'd want to use CSS-in-JS or dynamic classes
    return colorValue;
  };

  /**
   * Get color value directly
   */
  const getColor = (family, shade = 500) => {
    return tokens.colors[family]?.[shade];
  };

  /**
   * Get spacing value
   */
  const getSpacing = (size) => {
    return tokens.spacing[size];
  };

  /**
   * Get animation definition
   */
  const getAnimation = (name) => {
    return tokens.animations[name];
  };

  /**
   * Get shadow definition
   */
  const getShadow = (level) => {
    return tokens.shadows[level];
  };

  /**
   * Get border radius
   */
  const getBorderRadius = (size) => {
    return tokens.borderRadius[size];
  };

  /**
   * Get transition
   */
  const getTransition = (speed) => {
    return tokens.transitions[speed];
  };

  /**
   * Get z-index
   */
  const getZIndex = (level) => {
    return tokens.zIndex[level];
  };

  return {
    tokens,
    getToken,
    getColorClass,
    getColor,
    getSpacing,
    getAnimation,
    getShadow,
    getBorderRadius,
    getTransition,
    getZIndex,
    // Direct access
    colors: tokens.colors,
    spacing: tokens.spacing,
    typography: tokens.typography,
    shadows: tokens.shadows,
    borderRadius: tokens.borderRadius,
    transitions: tokens.transitions,
    animations: tokens.animations,
    zIndex: tokens.zIndex,
  };
};
