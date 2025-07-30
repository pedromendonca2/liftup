import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
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