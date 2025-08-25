import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import challenges from '../../assets/cultural_db/eco_challenges.json';
import boosts from '../../assets/cultural_db/eco_boosts.json';
import { useEcoStore } from '../../store/eco';

export default function EcoChallengesScreen() {
  const addPoints = useEcoStore((s) => s.addPoints);
  const setBoost = useEcoStore((s) => s.setBoost);
  const points = useEcoStore((s) => s.points);
  const activeBoost = useEcoStore((s) => s.activeBoost);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Челленджи</Text>
      <Text style={styles.meta}>Баллы: {points} {activeBoost ? `(множитель x${activeBoost.multiplier})` : ''}</Text>

      <FlatList
        contentContainerStyle={styles.list}
        data={challenges as any[]}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>+{item.points} баллов</Text>
            <Pressable style={styles.primary} onPress={() => addPoints(item.points, { title: item.title, source: 'challenge' })}>
              <Text style={styles.primaryText}>Зачесть</Text>
            </Pressable>
          </View>
        )}
      />

      <Text style={[styles.title, { marginTop: 12 }]}>Бусты</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={boosts as any[]}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>x{item.multiplier}</Text>
            <Pressable style={styles.secondary} onPress={() => setBoost({ ...item, expiresAt: Date.now() + 24 * 60 * 60 * 1000 })}>
              <Text style={styles.secondaryText}>Активировать на 24ч</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  meta: { marginTop: 4, fontSize: 12, color: '#64748b' },
  list: { gap: 12, paddingVertical: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  cardMeta: { marginTop: 4, fontSize: 12, color: '#64748b' },
  primary: { marginTop: 8, backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { marginTop: 8, backgroundColor: '#ecfeff', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#06b6d4' },
  secondaryText: { color: '#06b6d4', fontWeight: '700' },
});