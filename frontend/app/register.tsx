import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/contexts/ThemeContext';
import { RegisterFormData, registerFormSchema } from '@/types/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    }
  });

  const handleRegister = async (data: RegisterFormData) => {
    const payload = {
      ...data,
      age: Number(data.age),
      height: Number(data.height),
      weight: Number(data.weight),
    };
    try {
      const response = await register(payload);
      if (response?.error) {
        Alert.alert('Erro', response.errorMessage || 'Erro ao registrar');
        return;
      }
      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.');
      router.push('/login');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
    }
  };

  const styles = StyleSheet.create({
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 8,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : colors.background,
      marginBottom: 15,
    },
    picker: {
      height: 50,
      color: colors.text,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      color: colors.text,
    },
    inputContainer: {
      marginBottom: 15,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.icon,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f9f9f9',
      color: colors.text,
    },
    button: {
      backgroundColor: colors.tint,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: colors.icon,
      opacity: 0.7,
    },
    buttonText: {
      color: colors.tintButtonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginTop: 5,
      marginLeft: 5,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      {/* Campo Nome */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>
        )}
      />

      {/* Campo Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>
        )}
      />

      {/* Campo Senha */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>
        )}
      />

      {/* Campo Confirmar Senha */}
      <Controller
        control={control}
        name="confirm_password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
            {errors.confirm_password && <Text style={styles.errorText}>{errors.confirm_password.message}</Text>}
          </View>
        )}
      />
              
      {/* Campo Idade */}
      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Idade"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ''}
              keyboardType="numeric"
            />
            {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}
          </View>
        )}
      />

      {/* Campo Sexo */}
      <Controller
        control={control}
        name="sex"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o Sexo" value="" />
              <Picker.Item label="Masculino" value="MASCULINO" />
              <Picker.Item label="Feminino" value="FEMININO" />
            </Picker>
          </View>
        )}
      />
       {errors.sex && <Text style={styles.errorText}>{errors.sex.message}</Text>}


      {/* Campo Altura */}
      <Controller
        control={control}
        name="height"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Altura em metros (ex: 1.75)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ''}
              keyboardType="numeric"
            />
            {errors.height && <Text style={styles.errorText}>{errors.height.message}</Text>}
          </View>
        )}
      />

      {/* Campo Peso */}
      <Controller
        control={control}
        name="weight"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Peso em Kg (ex: 70.5)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? String(value) : ''}
              keyboardType="numeric"
            />
            {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(handleRegister)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color={colors.tintButtonText} /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

