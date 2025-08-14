import { RegisterFormData } from '@/types/register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native'; // Platform foi importado

// Tipos para o contexto e para o retorno da função de login
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: boolean; errorMessage?: string } | null>;
  register: (data: RegisterFormData) => Promise<any>;
  logout: () => Promise<void>;
};

type LoginResult = {
  error: boolean;
  errorMessage?: string;
} | null;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A URL agora é lida a partir das variáveis de ambiente do Expo.
// Certifique-se de que seu arquivo .env na raiz do frontend contém a linha:
// EXPO_PUBLIC_API_URL=http://SEU_IP_DE_REDE:3000
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Validação para garantir que a variável de ambiente foi definida.
if (!API_URL) {
  throw new Error(
    'A variável de ambiente EXPO_PUBLIC_API_URL não está definida. Por favor, crie um arquivo .env na pasta do frontend e adicione a URL da sua API.'
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Para ações de login/logout
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true); // Para o carregamento inicial do token

  // Efeito para verificar o token no AsyncStorage quando o app inicia
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Falha ao carregar o token de autenticação.', e);
      } finally {
        // Finaliza o carregamento inicial
        setIsAuthLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Falha no login:', data.error);
        return { error: true, errorMessage: data.error || 'Credenciais inválidas' };
      }

      if (data.token) {
        // Usa AsyncStorage para salvar o token
        await AsyncStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        return null; // Sucesso
      }

      return { error: true, errorMessage: 'Token não recebido do servidor.' };
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      return { error: true, errorMessage: 'Não foi possível conectar ao servidor.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: true, errorMessage: data.error || 'Erro ao registrar' };
      }
      // (Opcional) Login automático após registro:
      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        return null;
      }
      return null; // Sucesso, sem login automático
    } catch (error) {
      return { error: true, errorMessage: 'Erro de conexão' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Usa AsyncStorage para remover o token
      await AsyncStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Falha ao fazer logout.', e);
    }
  };

  // Mostra um indicador de carregamento enquanto verifica o token
  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
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
