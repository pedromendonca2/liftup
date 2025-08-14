import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useTreino } from '@/contexts/TreinoContextLocal';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';

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
    getNextAvailableLetter,
    deleteTreino,
    updateTreinoExercicios
  } = useTreino();

  // Estados para o timer e modal
  const [activeTimers, setActiveTimers] = useState<{[key: string]: { isRunning: boolean, startTime: number, elapsed: number }}>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentWorkoutData, setCurrentWorkoutData] = useState<any>(null);
  const [feedbackData, setFeedbackData] = useState<{[key: string]: number | 'skip'}>({});

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Recarregar treinos quando a tela for focada
  useEffect(() => {
    loadTreinos();
  }, []);

  // Timer update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].isRunning) {
            // Force re-render para atualizar o display do timer
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Função para deletar treino
  const handleDeleteTreino = (letter: 'A' | 'B' | 'C' | 'D') => {
    Alert.alert(
      "Excluir Treino",
      `Tem certeza que deseja excluir o Treino ${letter}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTreino(letter);
              console.log(`Treino ${letter} excluído com sucesso`);
            } catch (error) {
              console.error('Erro ao excluir treino:', error);
              Alert.alert('Erro', 'Não foi possível excluir o treino');
            }
          }
        }
      ]
    );
  };

  // Funções do timer
  const startTimer = (letter: string) => {
    setActiveTimers(prev => ({
      ...prev,
      [letter]: {
        isRunning: true,
        startTime: Date.now(),
        elapsed: 0
      }
    }));
  };

  const stopTimer = (letter: string) => {
    const timer = activeTimers[letter];
    if (timer) {
      const totalTime = Date.now() - timer.startTime;
      setActiveTimers(prev => ({
        ...prev,
        [letter]: {
          ...timer,
          isRunning: false,
          elapsed: totalTime
        }
      }));
      
      // Mostrar modal de tempo e preparar feedback
      const treino = treinos[letter as 'A' | 'B' | 'C' | 'D'];
      setCurrentWorkoutData({
        letter,
        treino,
        totalTime: Math.floor(totalTime / 1000) // em segundos
      });
      setShowFeedbackModal(true);
      
      // Inicializar dados de feedback
      const initialFeedback: {[key: string]: number | 'skip'} = {};
      treino?.exercicios.forEach((ex: any, index: number) => {
        initialFeedback[`${letter}_${index}`] = 0;
      });
      setFeedbackData(initialFeedback);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerDisplay = (letter: string) => {
    const timer = activeTimers[letter];
    if (!timer || !timer.isRunning) return '00:00';
    
    const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
    return formatTime(elapsed);
  };

  // Função para calcular novo peso baseado na fórmula
  const calculateNewWeight = (currentWeight: number, reps: number): number => {
    if (reps <= 0) return currentWeight;
    const newWeight = (currentWeight / (1.0278 - (0.0278 * reps)))*0.85;
    return Math.round(newWeight * 10) / 10; // Arredondar para 2 casas decimais
  };

  // Função para processar feedback e atualizar pesos
  const processFeedback = async () => {
    if (!currentWorkoutData) return;
    
    const { letter, treino } = currentWorkoutData;
    const updatedExercicios = treino.exercicios.map((exercicio: any, index: number) => {
      const feedbackKey = `${letter}_${index}`;
      const reps = feedbackData[feedbackKey];
      
      if (reps === 'skip' || reps === 0) {
        return exercicio; // Não altera o peso
      }
      
      const newWeight = calculateNewWeight(exercicio.peso, reps as number);
      return {
        ...exercicio,
        peso: newWeight
      };
    });

    try {
      // Atualizar o treino no contexto com os novos pesos
      await updateTreinoExercicios(letter as 'A' | 'B' | 'C' | 'D', updatedExercicios);
      
      setShowFeedbackForm(false);
      setShowFeedbackModal(false);
      Alert.alert('Sucesso!', 'Pesos atualizados baseados no seu feedback.');
    } catch (error) {
      console.error('Erro ao atualizar pesos:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os pesos.');
    }
  };

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
          const timer = activeTimers[letter];
          const isTimerRunning = timer?.isRunning || false;
          
          return (
            <ThemedView key={letter} style={styles.treinoCard}>
              <View style={styles.treinoHeader}>
                <View style={styles.treinoTitleContainer}>
                  <ThemedText style={styles.treinoTitle}>
                    Treino {letter}: {treino.nome}
                  </ThemedText>
                  <ThemedText style={styles.treinoSubtitle}>
                    3 séries com 8-15 repetições
                  </ThemedText>
                </View>
                
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTreino(letter)}
                >
                  <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
                </TouchableOpacity>
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

              {isTimerRunning ? (
                <View style={styles.timerContainer}>
                  <ThemedText style={styles.timerText}>
                    ⏱️ {getTimerDisplay(letter)}
                  </ThemedText>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.stopButton]}
                    onPress={() => stopTimer(letter)}
                  >
                    <ThemedText style={styles.actionButtonText}>Terminar Treino</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.tint }]}
                  onPress={() => startTimer(letter)}
                >
                  <ThemedText style={styles.actionButtonText}>Iniciar Treino</ThemedText>
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

      {/* Modal de Feedback */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            {currentWorkoutData && !showFeedbackForm && (
              <>
                <ThemedText style={styles.modalTitle}>
                  Treino Concluído! 🎉
                </ThemedText>
                <ThemedText style={styles.modalSubtitle}>
                  Tempo total: {formatTime(currentWorkoutData.totalTime)}
                </ThemedText>
                
                <TouchableOpacity 
                  style={[styles.feedbackButton, { backgroundColor: colors.tint }]}
                  onPress={() => setShowFeedbackForm(true)}
                >
                  <ThemedText style={styles.feedbackButtonText}>Dar Feedback</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowFeedbackModal(false)}
                >
                  <ThemedText style={styles.modalCloseText}>Fechar</ThemedText>
                </TouchableOpacity>
              </>
            )}

            {/* Formulário de Feedback */}
            {currentWorkoutData && showFeedbackForm && (
              <>
                <ThemedText style={styles.modalTitle}>
                  Como foi o treino?
                </ThemedText>
                <ThemedText style={styles.modalSubtitle}>
                  Marque quantas repetições conseguiu fazer:
                </ThemedText>
                
                <ScrollView style={styles.feedbackForm}>
                  {currentWorkoutData.treino.exercicios.map((exercicio: any, index: number) => {
                    const feedbackKey = `${currentWorkoutData.letter}_${index}`;
                    return (
                      <View key={index} style={styles.exerciseRepSection}>
                        <ThemedText style={styles.exerciseRepName}>
                          {exercicio.nome} ({exercicio.peso}kg)
                        </ThemedText>
                        
                        <View style={styles.pickerContainer}>
                          <Picker
                            selectedValue={feedbackData[feedbackKey] || 'skip'}
                            onValueChange={(itemValue) => setFeedbackData(prev => ({
                              ...prev,
                              [feedbackKey]: itemValue
                            }))}
                            style={styles.picker}
                          >
                            <Picker.Item label="Pular exercício" value="skip" />
                            {Array.from({length: 16}, (_, i) => i + 1).map(rep => (
                              <Picker.Item key={rep} label={`${rep} repetições`} value={rep} />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={styles.feedbackActions}>
                  <TouchableOpacity 
                    style={[styles.feedbackButton, { backgroundColor: colors.tint }]}
                    onPress={processFeedback}
                  >
                    <ThemedText style={styles.feedbackButtonText}>Salvar Feedback</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setShowFeedbackForm(false);
                      setShowFeedbackModal(false);
                    }}
                  >
                    <ThemedText style={styles.modalCloseText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ThemedView>
        </View>
      </Modal>
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
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  treinoTitleContainer: {
    flex: 1,
  },
  treinoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  treinoSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#666',
    marginLeft: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#666',
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
  timerContainer: {
    alignItems: 'center',
    gap: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#ff4444',
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
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  feedbackButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  feedbackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  // Estilos do formulário de feedback
  feedbackForm: {
    maxHeight: 300,
    width: '100%',
    marginBottom: 20,
  },
  exerciseRepSection: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  exerciseRepName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  feedbackActions: {
    width: '100%',
    gap: 10,
  },
});
