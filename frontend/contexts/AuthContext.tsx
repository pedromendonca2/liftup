import { ReactNode } from 'react';

/**
 * @deprecated O produto atual é offline-first e não exige autenticação.
 * Mantido temporariamente para compatibilidade com integrações antigas.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return children;
}

/** @deprecated O produto atual não possui sessão remota. */
export function useAuth() {
  return { isAuthenticated: true, isLoading: false } as const;
}
