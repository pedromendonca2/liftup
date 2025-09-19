// Mock for AuthContext
export const useAuth = jest.fn(() => ({
  isLoading: false,
  isAuthenticated: true,
}));
