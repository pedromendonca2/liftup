// Jest setup file for Expo and React Native testing

import '@testing-library/jest-native/extend-expect';

// Mock the global object additions from Expo runtime
global.TextDecoder = class TextDecoder {
  decode() { return ''; }
};

global.URL = class URL {
  constructor(url) { this.href = url; }
};

global.URLSearchParams = class URLSearchParams {
  constructor() {}
  get() { return null; }
  set() {}
};

global.__ExpoImportMetaRegistry = {
  register: () => {},
  get: () => ({}),
};

// Mock FormData additions
global.FormData = class FormData {
  append() {}
  get() { return null; }
  getAll() { return []; }
};

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
    expoConfig: {},
  },
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo core modules
jest.mock('expo', () => ({
  default: {},
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Redirect: ({ href }) => null,
  Link: ({ children }) => children,
  Tabs: ({ children }) => children,
  Stack: ({ children }) => children,
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: Text,
    MaterialIcons: Text,
    FontAwesome: Text,
    AntDesign: Text,
    MaterialCommunityIcons: Text,
  };
});

// Mock React Native Image component specifically
jest.mock('react-native/Libraries/Image/Image', () => {
  const React = require('react');
  return React.forwardRef((props, ref) => {
    return React.createElement('Image', { ...props, ref });
  });
});

// Global mocks
global.__DEV__ = true;
