import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PARTNERS = [
  { id: 'tilda', name: 'Tilda', url: 'https://tilda.cc/ru/' },
  { id: 'dar-severa', name: 'Дар Севера', url: 'https://dar-severa.ru/' },
];

export default function PartnersScreen() {
  const open = async (url: string) => {
    try { await Linking.openURL(url); } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Партнёры</Text>
        {PARTNERS.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => open(p.url)}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.url}>{p.url}</Text>
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
  url: { color: '#0369a1', marginTop: 4 },
});

