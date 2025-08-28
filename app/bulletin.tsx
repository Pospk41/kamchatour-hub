import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Ad = { id: string; title: string; description: string; category: string; date: string; isFavorite?: boolean };

const CATEGORIES = [
  { id: 'all', name: 'Все' },
  { id: 'tours', name: 'Туры' },
  { id: 'transfer', name: 'Трансфер' },
  { id: 'gear', name: 'Снаряжение' },
  { id: 'misc', name: 'Прочее' },
];

export default function BulletinScreen() {
  const [ads, setAds] = React.useState<Ad[]>([
    { id: '1', title: 'Ищу попутчиков на Мутновский', description: 'Старт завтра, 2 места', category: 'tours', date: '2025-08-28' },
    { id: '2', title: 'Нужен трансфер в Авачинскую бухту', description: 'С 8:00 до 10:00', category: 'transfer', date: '2025-08-28' },
  ]);
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');

  const filtered = ads.filter(a => {
    if (category !== 'all' && a.category !== category) return false;
    if (query && !(`${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const addAd = () => {
    Alert.prompt?.('Новое объявление', 'Заголовок', text => {
      if (!text?.trim()) return;
      const ad: Ad = { id: Date.now().toString(), title: text.trim(), description: 'Описание...', category: 'misc', date: new Date().toISOString().slice(0, 10) };
      setAds(prev => [ad, ...prev]);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Доска объявлений</Text>

        <View style={styles.searchRow}>
          <TextInput value={query} onChangeText={setQuery} placeholder="Поиск…" style={styles.input} />
          <TouchableOpacity style={styles.addBtn} onPress={addAd}><Text style={styles.addText}>+</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={styles.catRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c.id} style={[styles.catBtn, category === c.id && styles.catActive]} onPress={() => setCategory(c.id)}>
                <Text style={[styles.catText, category === c.id && styles.catTextActive]}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filtered.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCat}>{CATEGORIES.find(c => c.id === item.category)?.name}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12, backgroundColor: '#fff' },
  addBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#0891b2', alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  catRow: { flexDirection: 'row', gap: 8 },
  catBtn: { height: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', backgroundColor: '#fff' },
  catActive: { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc' },
  catText: { color: '#0f172a', fontWeight: '700' },
  catTextActive: { color: '#075985' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardCat: { color: '#0369a1', fontWeight: '700' },
  cardDate: { color: '#64748b' },
  cardTitle: { color: '#0f172a', fontWeight: '800', marginBottom: 4 },
  cardDesc: { color: '#334155' },
});

