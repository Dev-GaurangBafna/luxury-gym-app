/**
 * Luxury Gym App Design System
 * Royal + Modern + Luxurious Theme
 */

export const Colors = {
  // Primary Colors
  primary: '#4B0082', // Royal Purple
  secondary: '#0D0D2B', // Deep Navy
  background: '#121212', // Onyx Black
  
  // Accent Colors
  gold: '#FFD700',
  goldGradient: ['#FFD700', '#FFB347'],
  emerald: '#50C878', // Success/Positive
  crimson: '#FF4136', // Error
  
  // Macro Colors
  protein: '#1E90FF', // Blue
  carbs: '#FFD54F', // Yellow
  fat: '#43A047', // Green
  
  // Neutral Colors
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#8E8E93',
  darkGray: '#2C2C2E',
  black: '#000000',
  
  // Glassmorphism
  glassBackground: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  
  // Status Colors
  success: '#50C878',
  warning: '#FFD54F',
  error: '#FF4136',
  info: '#1E90FF',
} as const;

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 28,
  '2xl': 32,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  gold: {
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
} as const;

export const Layout = {
  // Screen padding
  screenPadding: Spacing.md,
  
  // Component dimensions
  buttonHeight: 48,
  inputHeight: 48,
  tabBarHeight: 80,
  headerHeight: 60,
  
  // Border widths
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
} as const;

export const Animation = {
  // Duration
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Easing
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Theme object combining all design tokens
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  animation: Animation,
} as const;

export type ThemeType = typeof Theme;
export type ColorType = keyof typeof Colors;
export type SpacingType = keyof typeof Spacing;
export type BorderRadiusType = keyof typeof BorderRadius;
