// Design System Configuration
// Központi színpaletta és design tokenek a teljes alkalmazáshoz

export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  
  // Gray colors - Javított kontraszttal
  gray: {
    50: '#f9fafb',
    100: '#f0f0f0',  // Módosítva #F3F4F6-ról #f0f0f0-ra (példa)
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',  // Helyett a halvány #EDEDED
    500: '#6b7280',  // Jobban látható alapértelmezett szürke
    600: '#4b5563',  // Sötétebb szöveghez
    700: '#374151',
    800: '#1f2937',  // Erős kontrasztú szöveg
    900: '#111827'
  },
  
  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    800: '#166534'
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706'
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626'
  }
};

// Typography scales
export const typography = {
  // Javított szöveg színek
  text: {
    primary: colors.gray[800],     // Helyett #EDEDED
    secondary: colors.gray[600],   // Helyett halvány szürke
    muted: colors.gray[500],       // Még mindig olvasható
    disabled: colors.gray[400]
  }
};

// Border colors
export const borders = {
  default: colors.gray[400],       // Helyett halvány border
  focus: colors.primary[500],
  error: colors.error[500]
};

// Background colors
export const backgrounds = {
  primary: '#ffffff',
  secondary: colors.gray[50],
  muted: colors.gray[100],
  disabled: colors.gray[200]
};

// Component variants
export const variants = {
  button: {
    primary: {
      bg: colors.primary[600],
      text: '#ffffff',
      hover: colors.primary[700]
    },
    secondary: {
      bg: colors.gray[100],
      text: colors.gray[800],      // Helyett halvány szöveg
      hover: colors.gray[200]
    },
    outline: {
      border: colors.gray[400],    // Helyett halvány border
      text: colors.gray[700],      // Sötétebb szöveg
      hover: colors.gray[50]
    }
  },
  
  input: {
    border: colors.gray[400],      // Helyett halvány border
    text: colors.gray[800],        // Sötét, jól olvasható szöveg
    placeholder: colors.gray[500]  // Látható placeholder
  }
};

export default {
  colors,
  typography,
  borders,
  backgrounds,
  variants
};
