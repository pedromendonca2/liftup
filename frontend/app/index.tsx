import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/contexts/ThemeContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}
