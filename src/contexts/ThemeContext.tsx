import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUserConfiguration } from './UserConfigurationContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { config } = useUserConfiguration();
  const theme = config.displayPreferences.theme;

  // The resolved theme is the same as the selected theme since we removed auto
  const resolvedTheme = theme;

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Only update if the theme class is different from what's already applied
    if (!root.classList.contains(resolvedTheme)) {
      // Remove existing theme classes
      root.classList.remove('light', 'dark');
      
      // Add the resolved theme class
      root.classList.add(resolvedTheme);
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#1a1d23' : '#ffffff');
    }
  }, [resolvedTheme]);

  // No need to listen for system theme changes since we removed auto mode

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
