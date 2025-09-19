import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Modo local: sem backend

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Em modo local, garantimos um token dummy para manter a sessão ativa
  useEffect(() => {
    const loadToken = async () => {
      try {
        let token = await AsyncStorage.getItem('@LiftUp:authToken');
        if (!token) {
          token = 'local-token';
          await AsyncStorage.setItem('@LiftUp:authToken', token);
        }
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Falha ao carregar o token de autenticação.', e);
        setIsAuthenticated(true); // Em caso de erro, ainda autentica localmente
      }
    };

    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
