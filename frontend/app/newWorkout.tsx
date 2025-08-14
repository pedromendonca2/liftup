import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTreino } from '@/contexts/TreinoContextLocal';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Exercicio } from '@/types/workout';
import { Picker } from '@react-native-picker/picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function NewWorkoutScreen() {
  const [workoutLoad, setWorkoutLoad] = useState('');
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [treinoName, setTreinoName] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { createNewTreino, isLoading } = useTreino();

  // Estado para lista de exercícios salvos
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);

  // Lista de equipamentos de musculação com carga
  const workoutTypes = [
    { label: 'Selecione um exercício', value: '' },
    
    // Máquinas para Membros Inferiores
    { label: 'Leg Press 45°', value: 'leg_press_45' },
    { label: 'Leg Press Horizontal', value: 'leg_press_horizontal' },
    { label: 'Leg Press Vertical', value: 'leg_press_vertical' },
    { label: 'Cadeira Extensora', value: 'cadeira_extensora' },
    { label: 'Cadeira Flexora', value: 'cadeira_flexora' },
    { label: 'Mesa Flexora', value: 'mesa_flexora' },
    { label: 'Cadeira Adutora', value: 'cadeira_adutora' },
    { label: 'Cadeira Abdutora', value: 'cadeira_abdutora' },
    { label: 'Hack Squat', value: 'hack_squat' },
    { label: 'Glúteo Articulado', value: 'gluteo_articulado' },
    { label: 'Panturrilha Sentado', value: 'panturrilha_sentado' },
    { label: 'Panturrilha em Pé', value: 'panturrilha_pe' },
    { label: 'Elevação Pélvica (Hip Thrust)', value: 'hip_thrust' },
    { label: 'Máquina de Stiff', value: 'maquina_stiff' },
    { label: 'Extensor de Joelhos Articulado', value: 'extensor_joelhos' },
    
    // Máquinas para Membros Superiores
    { label: 'Crossover', value: 'crossover' },
    { label: 'Pulley (Lat Pulldown)', value: 'lat_pulldown' },
    { label: 'Remada Sentada (Máquina)', value: 'remada_sentada' },
    { label: 'Remada Baixa (Máquina)', value: 'remada_baixa' },
    { label: 'Remada Cavalinho', value: 'remada_cavalinho' },
    { label: 'Supino Reto', value: 'supino_reto' },
    { label: 'Supino Inclinado', value: 'supino_inclinado' },
    { label: 'Supino Declinado', value: 'supino_declinado' },
    { label: 'Máquina de Supino Reto', value: 'maquina_supino_reto' },
    { label: 'Máquina de Supino Inclinado', value: 'maquina_supino_inclinado' },
    { label: 'Peck Deck (Voador/Crucifixo)', value: 'peck_deck' },
    { label: 'Desenvolvimento de Ombro (Máquina)', value: 'desenvolvimento_ombro' },
    { label: 'Máquina de Rosca Scott', value: 'rosca_scott' },
    { label: 'Graviton (Assistência Barra Fixa)', value: 'graviton' },
    
    // Máquinas para Core/Abdominal com carga
    { label: 'Máquina de Abdominal (Crunch)', value: 'crunch_machine' },
    
    // Equipamentos Livres com carga
    { label: 'Máquina Smith (Barra Guiada)', value: 'smith_machine' },
    { label: 'Kettlebells', value: 'kettlebells' },
    { label: 'Halteres', value: 'halteres' },
    { label: 'Barra Olímpica', value: 'barra_olimpica' },
    { label: 'Barra Reta', value: 'barra_reta' },
    { label: 'Barra W', value: 'barra_w' },
    { label: 'Barra H', value: 'barra_h' },
    { label: 'Barra Romana', value: 'barra_romana' },
    { label: 'Medicine Ball', value: 'medicine_ball' },
    { label: 'Slam Ball', value: 'slam_ball' },
    
    // Equipamentos de Apoio para exercícios com carga
    { label: 'Banco Supino Ajustável', value: 'banco_supino' },
    { label: 'Suporte para Agachamento (Squat Rack)', value: 'squat_rack' },
    { label: 'Power Cage', value: 'power_cage' },
  ];

  const handleSaveWorkout = () => {
    // Encontra o nome do exercício selecionado
    const selectedType = workoutTypes.find(type => type.value === selectedWorkoutType);
    const exercicioName = selectedType ? selectedType.label : selectedWorkoutType;

    // Cria novo exercício
    const newExercicio: Exercicio = {
      id: Date.now().toString(), // ID único baseado no timestamp
      nome: exercicioName,
      peso: parseFloat(workoutLoad)
    };

    // Adiciona o exercício à lista
    setExercicios(prevExercicios => [...prevExercicios, newExercicio]);

    Alert.alert('Exercício adicionado!');
    
    // Limpa os campos após salvar
    setSelectedWorkoutType('');
    setWorkoutLoad('');
  };

  // Função para verificar se o formulário está válido
  const isFormValid = () => {
    return selectedWorkoutType !== '' && workoutLoad.trim() !== '';
  };

  // Função para verificar se pode criar treino
  const canCreateTreino = () => {
    return treinoName.trim() !== '' && exercicios.length > 0;
  };

  // Função para criar treino completo
  const handleCreateTreino = async () => {
    if (!canCreateTreino()) {
      Alert.alert('Erro', 'Por favor, adicione um nome ao treino e pelo menos um exercício');
      return;
    }

    try {
      const success = await createNewTreino(
        treinoName || 'Novo Treino',
        exercicios
      );

      if (success) {
        // Limpar formulário e voltar
        setTreinoName('');
        setExercicios([]);
        setSelectedWorkoutType('');
        setWorkoutLoad('');
        router.back();
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      Alert.alert('Erro', 'Erro inesperado ao criar treino');
    }
  };

  // Função para remover exercício
  const removeExercicio = (id: string) => {
    setExercicios(prevExercicios => prevExercicios.filter(exercicio => exercicio.id !== id));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.tint,
      minHeight: 120,
      justifyContent: 'flex-end',
    },
    headerTitle: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9',
    },
    textArea: {
      height: 50,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 8,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9',
      overflow: 'hidden',
    },
    picker: {
      color: colors.text,
      backgroundColor: 'transparent',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 20,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    saveButton: {
      backgroundColor: colors.tint,
    },
    saveButtonDisabled: {
      backgroundColor: colors.icon,
      opacity: 0.7,
    },
    cancelButton: {
      backgroundColor: colors.icon,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    flatListTitle: {
      fontSize: 18,
      color: colors.text,
      marginBottom: 5,
      fontWeight: '600',
    },
    flatListItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.icon,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9',
      marginBottom: 2,
      borderRadius: 6,
    },
    flatListItemText: {
      fontSize: 14,
      color: colors.text,
    },
    emptyContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.icon,
      fontStyle: 'italic',
    },
    equipmentListSection: {
      marginTop: 10,
    },
    equipmentItemContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    removeButton: {
      backgroundColor: '#ff4444',
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    removeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 20,
    },
    createTreinoContainer: {
      marginTop: 20,
      marginBottom: 20,
    },
    createTreinoButton: {
      backgroundColor: '#28a745',
    },
    createTreinoButtonEnabled: {
      backgroundColor: '#28a745',
      opacity: 1,
    },
    createTreinoButtonDisabled: {
      backgroundColor: '#6c757d',
      opacity: 0.7,
    },
  });

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false 
        }} 
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Novo Treino</ThemedText>
        </View>

        {/* Conteúdo unificado */}
        <ScrollView style={styles.content}>
          {/* Campo para nome do treino */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Nome do Treino</ThemedText>
            <TextInput
              style={styles.input}
              value={treinoName}
              onChangeText={setTreinoName}
              placeholder="Ex: Peito e Tríceps"
              placeholderTextColor={colors.icon}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Exercício</ThemedText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedWorkoutType}
                onValueChange={(itemValue) => setSelectedWorkoutType(itemValue)}
                style={styles.picker}
              >
                {workoutTypes.map((type) => (
                  <Picker.Item 
                    key={type.value} 
                    label={type.label} 
                    value={type.value}
                    color={colors.text}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Peso (kg)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={workoutLoad}
              onChangeText={setWorkoutLoad}
              placeholder="Digite o peso em kg (ex: 20)"
              placeholderTextColor={colors.icon}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.button, 
                isFormValid() ? styles.saveButton : styles.saveButtonDisabled
              ]}
              onPress={handleSaveWorkout}
              disabled={!isFormValid()}
            >
              <ThemedText style={styles.buttonText}>Adicionar Exercício</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Lista de exercícios dentro do mesmo ScrollView */}
          <View style={styles.equipmentListSection}>
            <ThemedText style={styles.flatListTitle}>Exercícios Salvos ({exercicios.length})</ThemedText>
            {exercicios.length > 0 ? (
              exercicios.map((item, index) => (
                <View key={item.id} style={styles.flatListItem}>
                  <View style={styles.equipmentItemContent}>
                    <ThemedText style={styles.flatListItemText}>
                      {item.nome} - {item.peso}kg
                    </ThemedText>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeExercicio(item.id)}
                    >
                      <ThemedText style={styles.removeButtonText}>×</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  Nenhum exercício salvo ainda
                </ThemedText>
              </View>
            )}
          </View>

          {/* Botão para criar treino completo */}
          {exercicios.length > 0 && (
            <View style={styles.createTreinoContainer}>
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.createTreinoButton,
                  canCreateTreino() && !isLoading ? styles.createTreinoButtonEnabled : styles.createTreinoButtonDisabled
                ]}
                onPress={handleCreateTreino}
                disabled={!canCreateTreino() || isLoading}
              >
                <ThemedText style={styles.buttonText}>
                  {isLoading ? 'Criando...' : 'Criar Treino Completo'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>

      </View>
    </>
  );
}