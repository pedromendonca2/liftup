// Mock for AuthContext
export const useAuth = jest.fn(() => ({
  login: jest.fn(),
  isLoading: false,
  isAuthenticated: false,
  register: jest.fn(),
  logout: jest.fn(),
}));
