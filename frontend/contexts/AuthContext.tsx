import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native'; // Platform foi importado

// Tipos para o contexto e para o retorno da função de login
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: boolean; errorMessage?: string } | null>;
  logout: () => Promise<void>;
};

type LoginResult = {
  error: boolean;
  errorMessage?: string;
} | null;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL da sua API backend (verifique se está correta para o emulador/dispositivo)
const YOUR_NETWORK_IP = '192.168.0.12'; // <-- ATUALIZADO COM SEU IP
const API_PORT = 3000; // A porta que você expôs no docker-compose.yml

// Para o iOS Simulator, 'localhost' funciona. Para Android e dispositivos físicos, o IP da rede é necessário.
const API_URL = Platform.OS === 'ios' 
    ? `http://localhost:${API_PORT}` 
    : `http://${YOUR_NETWORK_IP}:${API_PORT}`;

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
      const response = await fetch(`${API_URL}/login`, {
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
