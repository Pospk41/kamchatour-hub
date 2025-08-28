import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboardScreen() {
  // Mock stats
  const stats = {
    bookingsToday: 7,
    pending: 12,
    revenueWeek: 185000,
    utilisation: 0.72,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Мини‑дашборд</Text>
        <View style={styles.grid}>
          <View style={styles.card}><Text style={styles.kpiLabel}>Брони сегодня</Text><Text style={styles.kpiVal}>{stats.bookingsToday}</Text></View>
          <View style={styles.card}><Text style={styles.kpiLabel}>Ожидают</Text><Text style={styles.kpiVal}>{stats.pending}</Text></View>
          <View style={styles.card}><Text style={styles.kpiLabel}>Выручка (нед.)</Text><Text style={styles.kpiVal}>{stats.revenueWeek.toLocaleString('ru-RU')} ₽</Text></View>
          <View style={styles.card}><Text style={styles.kpiLabel}>Загрузка</Text><Text style={styles.kpiVal}>{Math.round(stats.utilisation * 100)}%</Text></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  kpiLabel: { color: '#475569' },
  kpiVal: { color: '#0f172a', fontWeight: '800', fontSize: 18, marginTop: 6 },
});

