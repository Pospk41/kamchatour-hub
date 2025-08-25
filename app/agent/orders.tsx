import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgentOrders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Заказы</Text>
      <Text style={styles.meta}>Интеграция оплаты СБП запланирована</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  meta: { marginTop: 6, fontSize: 12, color: '#64748b' },
});

