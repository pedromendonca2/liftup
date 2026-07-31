import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useColorScheme } from '@/contexts/ThemeContext';
import { TreinoProvider } from '@/contexts/TreinoContextLocal';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TreinoProvider>
        <RootLayoutContent />
      </TreinoProvider>
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="newWorkout" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}
