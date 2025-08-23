import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

export default function AuthScreen() {
  const { signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onLogin = async () => {
    try {
      await signIn(email.trim(), password);
      Alert.alert('Успешно', 'Вы вошли в аккаунт');
    } catch (e: any) {
      Alert.alert('Ошибка входа', e?.message || 'Не удалось войти');
    }
  };

  const onRegister = async () => {
    try {
      await signUp(email.trim(), password, name.trim() || '');
      Alert.alert('Успешно', 'Зарегистрированы. Проверьте email для подтверждения.');
    } catch (e: any) {
      Alert.alert('Ошибка регистрации', e?.message || 'Не удалось зарегистрироваться');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Вход / Регистрация</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Имя (для регистрации)"
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity style={styles.button} onPress={onLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Загрузка...' : 'Войти'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={onRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#0891b2', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  secondary: { backgroundColor: '#0ea5e9' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});