// frontend/app/login.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock Alert
const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Automatically mock the modules using the __mocks__ directory
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ThemeContext');

// Mock expo-router
jest.mock('expo-router', () => ({
  Redirect: jest.fn(({ href }) => null),
  router: {
    push: jest.fn(),
  },
}));

// Mock Image component
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

// Mock Colors
jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: {
      text: '#11181C',
      background: '#f8f8ff',
      tint: '#1f3a7a',
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: '#1f3a7a',
      buttonText: '#ffffff',
      dropdownText: '#11181C',
      tintButtonText: '#ffffff',
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      tint: '#FF5C34',
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: '#FF5C34',
      buttonText: '#11181C',
      dropdownText: '#ECEDEE',
      tintButtonText: '#151718',
    },
  },
}));

// Import the component and mocked modules
import LoginScreen from './login';
import { useAuth } from '@/contexts/AuthContext';
import { router, Redirect } from 'expo-router';

describe('LoginScreen', () => {
  // Limpa o estado dos mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation to default values
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn(),
      isLoading: false,
      isAuthenticated: false,
    });
  });

  // Teste 1: Verificação de renderização do componente
  it('should render the login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
    expect(getByText('Registrar')).toBeTruthy();
  });

  // Teste 2: Validação de campos vazios
  it('should show an alert if email and password fields are empty on login', async () => {
    const { getByText } = render(<LoginScreen />);
    const loginButton = getByText('Entrar');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Atenção',
        'Por favor, preencha o e-mail e a senha.'
      );
    });
  });

  // Teste 3: Verificação do botão de registro
  it('should navigate to the register screen when the register button is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    const registerButton = getByText('Registrar');

    fireEvent.press(registerButton);

    expect(router.push).toHaveBeenCalledWith('/register');
  });

  // Teste 4: Verificação do redirecionamento
  it('should redirect to the home screen if the user is already authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    
    // Renderiza a tela para que o componente Redirect seja renderizado
    render(<LoginScreen />);
    
    expect(Redirect).toHaveBeenCalledWith(
      { href: '/(tabs)' }, 
      undefined
    );
  });
});