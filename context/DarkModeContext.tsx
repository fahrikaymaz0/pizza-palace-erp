'use client';

import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  isLightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({ isLightMode: true });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ isLightMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
