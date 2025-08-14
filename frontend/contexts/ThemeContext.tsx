import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  // Determina o tema atual baseado no modo selecionado
  const getCurrentTheme = (mode: ThemeMode): 'light' | 'dark' => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  };

  const currentTheme = getCurrentTheme(themeMode);

  // Carrega o tema salvo no AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    };
    loadTheme();
  }, []);

  // Salva o tema no AsyncStorage quando alterado
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  // Função para alternar entre claro e escuro
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      themeMode,
      currentTheme,
      setThemeMode,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook compatível com o useColorScheme existente
export function useColorScheme() {
  const { currentTheme } = useTheme();
  return currentTheme;
}
