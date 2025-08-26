import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addBoost, listBoosts, saveBoosts, isBoostActive } from '../../lib/boosts';
import type { Boost } from '../../types/rewards';

export default function AdminBoostsScreen() {
  const [boosts, setBoosts] = useState<Boost[]>([]);
  const [name, setName] = useState('');
  const [multiplier, setMultiplier] = useState('1.2');
  const [categories, setCategories] = useState('');

  const load = async () => {
    const all = await listBoosts();
    setBoosts(all);
  };

  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    const m = parseFloat(multiplier);
    if (!name.trim() || isNaN(m)) {
      Alert.alert('Ошибка', 'Введите название и корректный множитель');
      return;
    }
    const boost: Boost = {
      id: Date.now().toString(),
      name,
      type: 'category_multiplier',
      multiplier: m,
      categories: categories ? categories.split(',').map(s => s.trim()) : undefined,
      activeFrom: Date.now(),
    };
    await addBoost(boost);
    setName('');
    setMultiplier('1.2');
    setCategories('');
    await load();
  };

  const onClear = async () => {
    await saveBoosts([]);
    await load();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Админ: Бусты</Text>

        <View style={styles.form}>
          <TextInput placeholder="Название" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Множитель (напр. 1.2)" value={multiplier} onChangeText={setMultiplier} keyboardType="decimal-pad" style={styles.input} />
          <TextInput placeholder="Категории через запятую (volcano, fishing)" value={categories} onChangeText={setCategories} style={styles.input} />
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}><Text style={styles.addText}>Добавить</Text></TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={onClear}><Text style={styles.clearText}>Очистить все</Text></TouchableOpacity>
        </View>

        <Text style={styles.section}>Текущие бусты</Text>
        {boosts.map(b => (
          <View key={b.id} style={styles.card}>
            <Text style={styles.cardTitle}>{b.name}</Text>
            <Text style={styles.cardMeta}>×{b.multiplier ?? 1} {b.categories?.length ? `• ${b.categories.join(', ')}` : ''}</Text>
            {isBoostActive(b) ? <Text style={styles.active}>Активен</Text> : <Text style={styles.inactive}>Неактивен</Text>}
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
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 16 },
  input: { height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12, marginBottom: 10, backgroundColor: '#f9fafb' },
  addBtn: { height: 44, borderRadius: 10, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  addText: { color: '#fff', fontWeight: '800' },
  clearBtn: { height: 40, borderRadius: 10, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
  clearText: { color: '#991b1b', fontWeight: '800' },
  section: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  cardTitle: { color: '#111827', fontWeight: '700' },
  cardMeta: { color: '#374151', marginTop: 4 },
  active: { color: '#16a34a', fontWeight: '700', marginTop: 4 },
  inactive: { color: '#9ca3af', fontWeight: '700', marginTop: 4 },
});