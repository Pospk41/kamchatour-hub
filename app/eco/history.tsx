import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEcoStore } from '../../store/eco';

export default function EcoHistoryScreen() {
  const history = useEcoStore((s) => s.history);
  const points = useEcoStore((s) => s.points);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История начислений</Text>
      <Text style={styles.meta}>Текущие баллы: {points}</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={history}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Список пуст</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>{item.title}</Text>
              <Text style={styles.cellMeta}>{new Date(item.ts).toLocaleString()}</Text>
            </View>
            <Text style={styles.delta}>+{item.delta}</Text>
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
  empty: { marginTop: 24, textAlign: 'center', color: '#94a3b8' },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cell: { flexDirection: 'column' },
  cellTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  cellMeta: { marginTop: 2, fontSize: 12, color: '#64748b' },
  delta: { fontSize: 14, fontWeight: '800', color: '#10b981' },
});