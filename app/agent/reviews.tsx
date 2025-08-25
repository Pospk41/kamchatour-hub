import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { listReviewsByTour } from '../../services/reviewsService';
import tours from '../../assets/cultural_db/marketplace.json';

export default function AgentReviews() {
  const items = (tours as any[]).flatMap((t) => (listReviewsByTour as unknown as (id: string) => any[])(t.id).map((r) => ({ ...r, tourTitle: t.title })));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Отзывы</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.user} → {item.tourTitle}</Text>
            <Text style={styles.meta}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  list: { gap: 10, paddingVertical: 8 },
  row: { backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  name: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  meta: { marginTop: 4, fontSize: 12, color: '#64748b' },
});

