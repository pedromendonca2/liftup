/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#1f3a7a';
const tintColorDark = '#FF5C34';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f8f8ff', // Ghost white
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    buttonText: '#ffffff', // Texto branco para botões em modo claro
    dropdownText: '#11181C', // Texto escuro para dropdown em modo claro
    // Texto para botões com fundo tint (sempre contrasta)
    tintButtonText: '#ffffff', // Branco sobre azul escuro
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    buttonText: '#11181C', // Texto escuro para botões genéricos
    dropdownText: '#ECEDEE', // Texto claro para dropdown em modo escuro
    // Texto para botões com fundo tint (sempre contrasta)
    tintButtonText: '#ffffff', // Branco sobre laranja (#FF5C34)
  },
};
