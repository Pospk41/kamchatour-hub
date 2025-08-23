import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { searchTours, SearchParams } from '../../lib/search';
import { Tour } from '../../lib/tours';
import { searchToursSupabase } from '../../lib/searchSupabase';

export default function SearchScreen() {
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [sort, setSort] = useState<SearchParams['sort']>('relevance');
  const [items, setItems] = useState<Tour[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const params: SearchParams = { q, difficulty: difficulty ? [difficulty as any] : [], sort };
      try {
        const res = await searchToursSupabase(params);
        if (!controller.signal.aborted) setItems(res);
      } catch {
        if (!controller.signal.aborted) setItems(searchTours(params));
      }
    }, 300);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [q, difficulty, sort]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#64748b" />
        <TextInput
          style={styles.input}
          placeholder="Поиск туров..."
          value={q}
          onChangeText={setQ}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {['easy','medium','hard'].map((d) => (
          <TouchableOpacity key={d} style={[styles.chip, difficulty === d && styles.chipActive]} onPress={() => setDifficulty(difficulty === d ? null : d)}>
            <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>
              {d === 'easy' ? 'Лёгко' : d === 'medium' ? 'Средне' : 'Сложно'}
            </Text>
          </TouchableOpacity>
        ))}
        {['relevance','date','price','rating'].map((s) => (
          <TouchableOpacity key={s} style={[styles.chip, sort === s && styles.chipActive]} onPress={() => setSort(s as any)}>
            <Text style={[styles.chipText, sort === s && styles.chipTextActive]}>
              {s === 'relevance' ? 'релевант' : s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }}>
        {items.map((t) => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.meta}>{t.durationDays} дн · от {t.priceFrom.toLocaleString('ru-RU')} ₽ · {t.nextDate || 'скоро'}</Text>
            <Text style={styles.summary}>{t.summary}</Text>
          </View>
        ))}
        {items.length === 0 && (
          <View style={styles.empty}><Text style={styles.emptyText}>Ничего не найдено</Text></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8, elevation: 2 },
  input: { flex: 1 },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 8 },
  chipActive: { backgroundColor: '#0891b2' },
  chipText: { color: '#1e293b', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 6 },
  meta: { color: '#475569', marginBottom: 6 },
  summary: { color: '#64748b' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#64748b' },
});