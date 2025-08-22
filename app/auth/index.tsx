import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthPlaceholder() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Авторизация</Text>
        <Text style={styles.subtitle}>Экран в разработке. Здесь будет вход и регистрация.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 12, width: '90%' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },
});