import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function AgentDashboard() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Туроператор — Дашборд</Text>
      <View style={styles.grid}>
        <Pressable style={styles.card} onPress={() => router.push('/agent/tours')}>
          <Text style={styles.cardTitle}>Туры</Text>
          <Text style={styles.cardMeta}>Список и управление</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/agent/orders')}>
          <Text style={styles.cardTitle}>Заказы</Text>
          <Text style={styles.cardMeta}>Бронирования и оплаты</Text>
        </Pressable>
        <Pressable style={styles.card} onPress={() => router.push('/agent/reviews')}>
          <Text style={styles.cardTitle}>Отзывы</Text>
          <Text style={styles.cardMeta}>Модерация</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  grid: { marginTop: 12, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardMeta: { marginTop: 4, fontSize: 12, color: '#64748b' },
});

