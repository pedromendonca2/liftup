import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// URLs para tentar em ordem - específicas para Expo Go
const API_URLS = [
  'http://10.0.2.2:8080/api',      // Para emulador Android
  'http://10.0.2.2:3001/api',      // Para emulador Android (porta 3001)
  'http://localhost:8080/api',      // Para web
  'http://localhost:3001/api',      // Para web (porta 3001)
  'http://127.0.0.1:8080/api',      // Fallback
  'http://127.0.0.1:3001/api',      // Fallback (porta 3001)
];

// URLs específicas para Expo Go com tunnel
const EXPO_GO_URLS = [
  'http://10.0.2.2:8080/api',      // Primeira tentativa (mais confiável)
  'http://10.0.2.2:3001/api',      // Segunda tentativa
  'http://localhost:8080/api',      // Terceira tentativa
  'http://localhost:3001/api',      // Quarta tentativa
];

// URLs para dispositivos físicos (priorizar LAN)
const PHYSICAL_DEVICE_URLS = [
  'http://192.168.1.2:3001/api',  // Windows LAN IP
  'http://192.168.1.2:3001/api',
  'http://172.20.173.132:8080/api',  // WSL IP as fallback
  'http://172.20.173.132:3001/api',
];

// Função para detectar se está usando Expo Go
const isExpoGo = () => {
  return Platform.OS !== 'web';
};

// Função para detectar se é um dispositivo físico
const isPhysicalDevice = () => Platform.OS !== 'web';

// Função para obter a URL base
const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Priorizar dispositivos físicos com IP local
  if (isPhysicalDevice()) {
    return 'http://192.168.1.2:3001/api';
  }
  // Para Expo Go em emulador, usar 10.0.2.2
  if (isExpoGo()) {
    return 'http://10.0.2.2:8080/api';
  }
  // Para web
  return 'http://localhost:8080/api';
};

// URL atual
let currentApiUrl = getApiBaseUrl();

console.log('🚀 API Base URL inicial:', currentApiUrl);
console.log('📱 Platform:', Platform.OS);
console.log('📱 É Expo Go:', isExpoGo());
console.log('📱 É Físico:', isPhysicalDevice());

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async tryMultipleUrls<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    // Para Expo Go, tentar URLs específicas
    const urlsToTry = isExpoGo() ? EXPO_GO_URLS : API_URLS;

    console.log('🔄 Tentando URLs:', urlsToTry);

    // Tentar todas as URLs até uma funcionar
    for (const baseUrl of urlsToTry) {
      const url = `${baseUrl}${endpoint}`;
      console.log(`🌐 Tentando requisição para: ${url}`);

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
        });

        console.log(`📡 Response status para ${url}:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Resposta recebida de ${url}:`, data);
          currentApiUrl = baseUrl; // Atualizar URL atual
          return data;
        }
      } catch (error: any) {
        console.log(`❌ Falha na requisição para ${url}:`, error.message);
        console.log(`💥 Error stack: ${error.stack}`);
        console.log(`💥 Error details: ${JSON.stringify(error)}`);
        continue; // Tentar próxima URL
      }
    }

    throw new Error('Todas as URLs da API falharam');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    const url = `${currentApiUrl}${endpoint}`;

    console.log('🌐 Fazendo requisição para:', url);
    console.log('📋 Headers:', headers);
    console.log('📦 Body:', options.body);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta recebida:', data);
      return data;
    } catch (error: any) {
      console.error('💥 Erro na requisição:', error);
      console.error('💥 Tipo do erro:', error.name);
      console.error('💥 Mensagem do erro:', error.message);
      console.error('💥 Stack trace:', error.stack);

      // Se for erro de rede, tentar múltiplas URLs
      if (error.message?.includes('Network request failed') ||
        error.message?.includes('Failed to fetch') ||
        error.name === 'TypeError') {
        console.log('🔄 Tentando múltiplas URLs como fallback...');
        return this.tryMultipleUrls<T>(endpoint, options);
      }

      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Workout endpoints
  async getWorkouts() {
    return this.request('/workouts');
  }

  async getWorkout(id: string) {
    return this.request(`/workouts/${id}`);
  }

  async createWorkout(data: {
    name: string;
    description?: string;
    date?: string;
  }) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkout(id: string, data: {
    name?: string;
    description?: string;
    date?: string;
  }) {
    return this.request(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkout(id: string) {
    return this.request(`/workouts/${id}`, {
      method: 'DELETE',
    });
  }

  // Exercise endpoints
  async getExercises(workoutId: string) {
    return this.request(`/exercises/workout/${workoutId}`);
  }

  async getExercise(id: string) {
    return this.request(`/exercises/${id}`);
  }

  async createExercise(data: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
    workoutId: string;
  }) {
    return this.request('/exercises', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExercise(id: string, data: {
    name?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    notes?: string;
  }) {
    return this.request(`/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExercise(id: string) {
    return this.request(`/exercises/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 