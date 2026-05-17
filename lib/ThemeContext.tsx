import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  darkColors,
  darkStyles,
  lightColors,
  lightStyles,
} from "@/styles/AkunStyles";

// ============================================================
//  TYPES
// ============================================================

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: (value: boolean) => Promise<void>;
  colors: typeof lightColors;
  styles: typeof lightStyles;
  loading: boolean;
}

// ============================================================
//  CONTEXT
// ============================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================
//  PROVIDER
// ============================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load theme preference dari AsyncStorage saat mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const stored = await AsyncStorage.getItem("app_settings");
      const settings = stored ? JSON.parse(stored) : null;
      setIsDark(settings?.modeMalam ?? false);
    } catch (error) {
      console.error("Error loading theme preference:", error);
      setIsDark(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async (value: boolean) => {
    try {
      // Update state dulu
      setIsDark(value);

      // Simpan ke AsyncStorage
      const current = await AsyncStorage.getItem("app_settings");
      const settings = current ? JSON.parse(current) : {};
      settings.modeMalam = value;
      await AsyncStorage.setItem("app_settings", JSON.stringify(settings));

      console.log("Theme toggled:", value ? "dark" : "light");
    } catch (error) {
      console.error("Error toggling theme:", error);
      throw error;
    }
  };

  const colors = isDark ? darkColors : lightColors;
  const styles = isDark ? darkStyles : lightStyles;

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    colors,
    styles,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ============================================================
//  HOOK
// ============================================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
