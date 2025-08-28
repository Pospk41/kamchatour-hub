import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type TourPoint = { id: string; title: string; tag: string; lat: number; lng: number };

const MOCK_POINTS: TourPoint[] = [
  { id: '1', title: 'Авачинский вулкан', tag: 'volcano', lat: 53.255, lng: 158.835 },
  { id: '2', title: 'Долина гейзеров', tag: 'thermals', lat: 54.442, lng: 160.142 },
  { id: '3', title: 'Медвежье сафари', tag: 'nature', lat: 52.945, lng: 158.430 },
];

const TAGS = [
  { id: 'all', name: 'Все' },
  { id: 'volcano', name: 'Вулканы' },
  { id: 'thermals', name: 'Гейзеры' },
  { id: 'nature', name: 'Природа' },
  { id: 'sea', name: 'Море' },
  { id: 'fishing', name: 'Рыбалка' },
];

export default function MapScreen() {
  const [tag, setTag] = React.useState<string>('all');

  const points = tag === 'all' ? MOCK_POINTS : MOCK_POINTS.filter(p => p.tag === tag);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Карта</Text></View>
      {/* Map placeholder block; hook real map provider later */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={28} color="#64748b" />
        <Text style={styles.mapText}>Здесь будет интерактивная карта</Text>
        <Text style={styles.mapSub}>Точек сейчас: {points.length}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {TAGS.map(t => (
          <TouchableOpacity key={t.id} style={[styles.chip, tag === t.id && styles.chipActive]} onPress={() => setTag(t.id)}>
            <Text style={[styles.chipText, tag === t.id && styles.chipTextActive]}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.list}>
        {points.map(p => (
          <View key={p.id} style={styles.item}>
            <Text style={styles.itemTitle}>{p.title}</Text>
            <Text style={styles.itemMeta}>{p.lat.toFixed(3)}, {p.lng.toFixed(3)} • {p.tag}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  mapPlaceholder: { marginHorizontal: 16, height: 220, borderRadius: 12, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  mapText: { color: '#334155', fontWeight: '700', marginTop: 8 },
  mapSub: { color: '#64748b', marginTop: 2 },
  filters: { paddingHorizontal: 12, marginTop: 12 },
  chip: { height: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', backgroundColor: '#fff', marginRight: 8 },
  chipActive: { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc' },
  chipText: { color: '#0f172a', fontWeight: '700' },
  chipTextActive: { color: '#075985' },
  list: { paddingHorizontal: 16, paddingVertical: 12 },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  itemTitle: { color: '#0f172a', fontWeight: '800' },
  itemMeta: { color: '#475569', marginTop: 4 },
});

