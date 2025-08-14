import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useTreino } from '@/contexts/TreinoContextLocal';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';

export default function HomeScreen() {
  const { logout, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { 
    treinos, 
    selectedTreino, 
    setSelectedTreino, 
    markTreinoAsCompleted, 
    isLoading,
    loadTreinos,
    getNextAvailableLetter 
  } = useTreino();

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Recarregar treinos quando a tela for focada
  useEffect(() => {
    loadTreinos();
  }, []);

  const handleNewWorkout = () => {
    router.push('/newWorkout');
  };

  const currentTreino = treinos[selectedTreino];

  // Renderizar todos os treinos existentes
  const renderTreinos = () => {
    const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const treinosExistentes = letters.filter(letter => treinos[letter] !== null);
    
    if (treinosExistentes.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>Nenhum treino criado ainda</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Crie seu primeiro treino para começar!
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.treinosGrid}>
        {treinosExistentes.map((letter) => {
          const treino = treinos[letter]!;
          return (
            <ThemedView key={letter} style={styles.treinoCard}>
              <View style={styles.treinoHeader}>
                <ThemedText style={styles.treinoTitle}>
                  Treino {letter}: {treino.nome}
                </ThemedText>
                <ThemedText style={styles.treinoSubtitle}>
                  3 séries com 8-15 repetições
                </ThemedText>
                {treino.ultimaExecucao && (
                  <ThemedText style={styles.completedBadge}>✅ Concluído</ThemedText>
                )}
              </View>
              
              <View style={styles.exerciciosList}>
                {treino.exercicios.map((exercicio: any, index: number) => (
                  <View key={index} style={styles.exercicioItem}>
                    <ThemedText style={styles.exercicioName}>{exercicio.nome}</ThemedText>
                    <ThemedText style={styles.exercicioDetails}>
                      {exercicio.peso}kg
                    </ThemedText>
                  </View>
                ))}
              </View>

              {!treino.ultimaExecucao && (
                <TouchableOpacity 
                  style={[styles.completeButton, { backgroundColor: colors.tint }]}
                  onPress={() => markTreinoAsCompleted(letter)}
                >
                  <ThemedText style={styles.completeButtonText}>Treino Concluído</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header com fundo colorido */}
      <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#1f3a7a' }]}>
        <ThemedText type="title" style={styles.headerTitle}>Treinos Cadastrados</ThemedText>
      </View>
      
      {/* Conteúdo scrollável */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <ThemedText style={styles.loadingText}>Carregando treinos...</ThemedText>
          </View>
        ) : (
          <>
            {/* Renderizar todos os treinos */}
            {renderTreinos()}
            
            {/* Botão para criar novo treino se houver slots disponíveis */}
            {getNextAvailableLetter() && (
              <TouchableOpacity 
                style={[styles.newWorkoutButton, { backgroundColor: colors.tint }]}
                onPress={handleNewWorkout}
              >
                <ThemedText style={styles.newWorkoutButtonText}>
                  + Criar Novo Treino
                </ThemedText>
              </TouchableOpacity>
            )}
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  emptyTreinoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  emptyTreinoText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    opacity: 0.7,
  },
  treinoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  treinoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  treinoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  treinoSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  completedBadge: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  exerciciosList: {
    marginBottom: 15,
  },
  exercicioItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exercicioName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  exercicioDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  completeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  letterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  letterButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  letterButtonWithTreino: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  letterTextSelected: {
    color: 'white',
  },
  letterTextWithTreino: {
    color: 'white',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  treinosGrid: {
    gap: 16,
  },
});
