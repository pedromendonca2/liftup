import { Redirect, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const { logout, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  const handleNewWorkout = () => {
    router.push('/newWorkout');
  };

  return (
    <View style={styles.container}>
      {/* Header com fundo colorido */}
      <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#1f3a7a' }]}>
        <ThemedText type="title" style={styles.headerTitle}>Treinos cadastrados</ThemedText>
      </View>
      
      {/* Conteúdo scrollável */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1 </ThemedText>
          <ThemedText>
            Aqui será a home, onde o usuário vai visualizar suas metas.
          </ThemedText>
        </ThemedView>

        {/* Botão para criar novo treino */}
        <TouchableOpacity 
          style={[styles.newWorkoutButton, { backgroundColor: colors.tint }]}
          onPress={handleNewWorkout}
        >
          <ThemedText style={styles.newWorkoutButtonText}>+ Novo Treino</ThemedText>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60, // Para status bar
    paddingBottom: 20,
    paddingHorizontal: 20,
    minHeight: 120,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
  },
  newWorkoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  newWorkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
