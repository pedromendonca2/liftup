import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';

type User = {
  id: string;
  email: string;
  name: string;
};
type AuthResponse = { token: string; user: User };
type MeResponse = { user: User };

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Verificar token salvo ao iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const data = await apiService.getMe() as MeResponse;
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      console.error('Erro ao verificar status de autenticação:', error);
      await AsyncStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiService.login(email, password) as AuthResponse;
      await AsyncStorage.setItem('authToken', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      console.error('Tipo do erro:', (error as Error).name);
      console.error('Mensagem:', (error as Error).message);
      console.error('Stack:', (error as Error).stack);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await apiService.register(email, password, name) as AuthResponse;
      await AsyncStorage.setItem('authToken', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      console.error('Tipo do erro:', (error as Error).name);
      console.error('Mensagem:', (error as Error).message);
      console.error('Stack:', (error as Error).stack);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: unknown) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      register,
      logout,
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
