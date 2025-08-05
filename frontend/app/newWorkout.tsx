import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Picker } from '@react-native-picker/picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function NewWorkoutScreen() {
  const [workoutLoad, setWorkoutLoad] = useState('');
  // const [workoutDescription, setWorkoutDescription] = useState('');
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Tipo para equipamento
  interface Equipment {
    name: string;
    load: string;
    id: string;
  }

  // Estado para lista de equipamentos salvos
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  // Lista completa de equipamentos de academia
  const workoutTypes = [
    { label: 'Selecione um equipamento', value: '' },
    
    // Equipamentos Cardiovasculares
    { label: 'Bicicleta Ergométrica Vertical', value: 'bike_vertical' },
    { label: 'Bicicleta Ergométrica Reclinada', value: 'bike_reclinada' },
    { label: 'Esteira Ergométrica', value: 'esteira' },
    { label: 'Elíptico (Transport)', value: 'elliptical' },
    { label: 'Remo Indoor', value: 'remo_indoor' },
    { label: 'Simulador de Escada', value: 'simulador_escada' },
    { label: 'Air Bike', value: 'air_bike' },
    { label: 'Ski Erg', value: 'ski_erg' },
    
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
    
    // Máquinas para Core/Abdominal
    { label: 'Máquina de Abdominal (Crunch)', value: 'crunch_machine' },
    { label: 'Prancha Abdominal', value: 'prancha_abdominal' },
    
    // Equipamentos Livres
    { label: 'Máquina Smith (Barra Guiada)', value: 'smith_machine' },
    { label: 'Kettlebells', value: 'kettlebells' },
    { label: 'Anilhas (Pesos)', value: 'anilhas' },
    { label: 'Barra Olímpica', value: 'barra_olimpica' },
    { label: 'Barra Reta', value: 'barra_reta' },
    { label: 'Barra W', value: 'barra_w' },
    { label: 'Barra H', value: 'barra_h' },
    { label: 'Barra Romana', value: 'barra_romana' },
    
    // Acessórios
    { label: 'Caneleiras', value: 'caneleiras' },
    { label: 'Step', value: 'step' },
    { label: 'Colchonetes', value: 'colchonetes' },
    { label: 'Bolas de Exercício (Fitball)', value: 'fitball' },
    { label: 'Medicine Ball', value: 'medicine_ball' },
    { label: 'Slam Ball', value: 'slam_ball' },
    { label: 'Corda de Pular', value: 'corda_pular' },
    { label: 'Mini Bands', value: 'mini_bands' },
    { label: 'Power Bands', value: 'power_bands' },
    { label: 'Caixa de Salto (Plyo Box)', value: 'plyo_box' },
    { label: 'Roda Abdominal (Ab Wheel)', value: 'ab_wheel' },
    { label: 'Barras Fixas', value: 'barras_fixas' },
    { label: 'Barras Paralelas', value: 'barras_paralelas' },
    { label: 'Anéis de Ginástica', value: 'aneis_ginastica' },
    { label: 'Corda Naval (Battle Rope)', value: 'battle_rope' },
    { label: 'Bosu', value: 'bosu' },
    
    // Equipamentos de Apoio
    { label: 'Banco Supino Ajustável', value: 'banco_supino' },
    { label: 'Suporte para Agachamento (Squat Rack)', value: 'squat_rack' },
    { label: 'Power Cage', value: 'power_cage' },
    { label: 'Suporte para Barras e Anilhas', value: 'suporte_barras' },
    { label: 'Cinto de Levantamento', value: 'cinto_levantamento' },
    { label: 'Straps', value: 'straps' },
    { label: 'Luvas', value: 'luvas' },
  ];

  const handleSaveWorkout = () => {
    // Encontra o nome do equipamento selecionado
    const selectedType = workoutTypes.find(type => type.value === selectedWorkoutType);
    const equipmentName = selectedType ? selectedType.label : selectedWorkoutType;

    // Cria novo equipamento
    const newEquipment: Equipment = {
      id: Date.now().toString(), // ID único baseado no timestamp
      name: equipmentName,
      load: workoutLoad
    };

    // Adiciona o equipamento à lista
    setEquipments(prevEquipments => [...prevEquipments, newEquipment]);

    Alert.alert('Equipamento adicionado!');
    
    // Limpa os campos após salvar
    setSelectedWorkoutType('');
    setWorkoutLoad('');
  };

  // Função para verificar se o formulário está válido
  const isFormValid = () => {
    return selectedWorkoutType !== '' && workoutLoad.trim() !== '';
  };

  // Função para remover equipamento
  const removeEquipment = (id: string) => {
    setEquipments(prevEquipments => prevEquipments.filter(equipment => equipment.id !== id));
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
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Equipamento</ThemedText>
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
            <ThemedText style={styles.label}>Carga</ThemedText>
              <TextInput
              style={[styles.input, styles.textArea]}
              value={workoutLoad}
              onChangeText={setWorkoutLoad}
              placeholder="Digite a carga em kg (ex: 20)"
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
              <ThemedText style={styles.buttonText}>Adicionar</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Lista de equipamentos dentro do mesmo ScrollView */}
          <View style={styles.equipmentListSection}>
            <ThemedText style={styles.flatListTitle}>Equipamentos Salvos ({equipments.length})</ThemedText>
            {equipments.length > 0 ? (
              equipments.map((item, index) => (
                <View key={item.id} style={styles.flatListItem}>
                  <View style={styles.equipmentItemContent}>
                    <ThemedText style={styles.flatListItemText}>
                      {item.name} - {item.load}kg
                    </ThemedText>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeEquipment(item.id)}
                    >
                      <ThemedText style={styles.removeButtonText}>×</ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  Nenhum equipamento salvo ainda
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>

      </View>
    </>
  );
}