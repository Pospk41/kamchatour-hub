import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listMarketplaceItems, MarketplaceItem } from '../../services/marketplaceService';
import { useRouter } from 'expo-router';

export default function MarketplaceScreen() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketplace'],
    queryFn: listMarketplaceItems,
  });

  if (isLoading) return <View style={styles.center}><Text>Загрузка…</Text></View>;
  if (error) return <View style={styles.center}><Text>Ошибка загрузки</Text></View>;

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data as MarketplaceItem[]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => router.push(`/marketplace/${item.id}` as never)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.short}</Text>
          <Text style={styles.price}>{item.price.toLocaleString('ru-RU')} {item.currency}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, fontSize: 13, color: '#475569' },
  price: { marginTop: 8, fontSize: 14, fontWeight: '700', color: '#0891b2' },
});