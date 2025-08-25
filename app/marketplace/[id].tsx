import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getMarketplaceItem } from '../../services/marketplaceService';
import { useCartStore } from '../../store/cart';

export default function MarketplaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useQuery({ queryKey: ['marketplace', id], queryFn: () => getMarketplaceItem(id) });
  const add = useCartStore((s) => s.add);

  if (!data) return <View style={styles.center}><Text>Не найдено</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subtitle}>{data.short}</Text>
      <Text style={styles.price}>{data.price.toLocaleString('ru-RU')} {data.currency}</Text>
      <Pressable style={styles.primary} onPress={() => { add(data); router.back(); }}>
        <Text style={styles.primaryText}>Добавить в корзину</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subtitle: { marginTop: 6, fontSize: 14, color: '#475569' },
  price: { marginTop: 12, fontSize: 16, fontWeight: '800', color: '#0891b2' },
  primary: { marginTop: 16, backgroundColor: '#0891b2', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
});