import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getMarketplaceItem } from '../../services/marketplaceService';
import { listReviewsByTour } from '../../services/reviewsService';
import { findOperatorByName } from '../../services/operatorService';
import { useCartStore } from '../../store/cart';

function RatingStars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => (i < full ? '★' : i === full && half ? '☆' : '☆')).join('');
  return <Text style={styles.ratingStars}>{stars} {value.toFixed(1)}</Text>;
}

export default function MarketplaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useQuery({ queryKey: ['marketplace', id], queryFn: () => getMarketplaceItem(id) });
  const reviews = useQuery({ queryKey: ['reviews', id], queryFn: () => listReviewsByTour(String(id)) });
  const operator = useQuery({ queryKey: ['operator', data?.provider], queryFn: async () => (data ? findOperatorByName(data.provider) : undefined), enabled: !!data });
  const add = useCartStore((s) => s.add);

  if (!data) return <View style={styles.center}><Text>Не найдено</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subtitle}>{data.short}</Text>
      <Text style={styles.price}>{data.price.toLocaleString('ru-RU')} {data.currency}</Text>

      {operator.data && (
        <View style={styles.operatorBox}>
          <Text style={styles.operatorTitle}>Оператор: {operator.data.name}</Text>
          <RatingStars value={operator.data.rating} />
          <Text style={styles.operatorMeta}>Отзывов: {operator.data.reviews}</Text>
        </View>
      )}

      {reviews.data && reviews.data.length > 0 && (
        <View style={styles.reviewsBox}>
          <Text style={styles.reviewsTitle}>Отзывы</Text>
          {reviews.data.slice(0, 3).map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <Text style={styles.reviewUser}>{r.user}</Text>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>
      )}

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
  operatorBox: { marginTop: 12, padding: 12, backgroundColor: '#f8fafc', borderRadius: 10 },
  operatorTitle: { fontWeight: '800', color: '#0f172a' },
  operatorMeta: { marginTop: 2, fontSize: 12, color: '#64748b' },
  ratingStars: { marginTop: 4, color: '#f59e0b', fontWeight: '700' },
  reviewsBox: { marginTop: 12 },
  reviewsTitle: { fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  reviewRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  reviewUser: { fontSize: 12, fontWeight: '700', color: '#334155' },
  reviewText: { fontSize: 12, color: '#475569' },
});