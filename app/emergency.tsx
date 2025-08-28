import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONTACTS = [
  { id: '1', name: 'МЧС', phone: '112' },
  { id: '2', name: 'Скорая помощь', phone: '103' },
  { id: '3', name: 'Полиция', phone: '102' },
  { id: '4', name: 'Единый номер', phone: '112' },
];

export default function EmergencyScreen() {
  const call = async (num: string) => {
    try {
      const url = `tel:${num}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Ошибка', 'Звонок недоступен');
    } catch {
      Alert.alert('Ошибка', 'Звонок недоступен');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Экстренные контакты</Text>
        {CONTACTS.map(c => (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => call(c.phone)}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.phone}>{c.phone}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  name: { color: '#0f172a', fontWeight: '800' },
  phone: { color: '#0369a1', marginTop: 4, fontWeight: '700' },
});

