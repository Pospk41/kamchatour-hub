import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Tour = {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration?: string;
  difficulty?: string;
  images?: string[];
  location?: string;
  included?: string[];
};

const MOCK_TOUR: Tour = {
  id: '1',
  title: 'Вулкан Мутновский',
  description: 'Восхождение на действующий вулкан с видом на кратер. Трекинг по лавовым полям, термальные поля, фумаролы.',
  price: 8000,
  duration: '1 день',
  difficulty: 'Средний',
  images: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1080&auto=format&fit=crop',
  ],
  location: 'Камчатка, район П-Камчатского',
  included: ['Трансфер', 'Гид', 'Страховка', 'Снаряжение (базовое)'],
};

export default function TourDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const tour: Tour = MOCK_TOUR; // TODO: load by id when backend connected

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{tour.title}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={styles.galleryRow}>
            {(tour.images || []).map((uri, idx) => (
              <View key={idx} style={styles.galleryItem}>
                <Image source={{ uri }} style={styles.galleryImage} />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}><Ionicons name="time" size={16} color="#0f172a" /><Text style={styles.metaText}>{tour.duration}</Text></View>
          <View style={styles.metaPill}><Ionicons name="trending-up" size={16} color="#0f172a" /><Text style={styles.metaText}>{tour.difficulty}</Text></View>
          <View style={styles.metaPill}><Ionicons name="pricetag" size={16} color="#0f172a" /><Text style={styles.metaText}>{tour.price} ₽</Text></View>
        </View>

        <Text style={styles.section}>Описание</Text>
        <Text style={styles.desc}>{tour.description}</Text>

        <Text style={styles.section}>Что включено</Text>
        <View style={styles.includedList}>
          {(tour.included || []).map((it, idx) => (
            <View key={idx} style={styles.includedItem}>
              <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
              <Text style={styles.includedText}>{it}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Локация</Text>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={22} color="#64748b" />
          <Text style={styles.mapText}>{tour.location}</Text>
        </View>

        <Text style={styles.section}>Отзывы</Text>
        <View style={styles.reviewCard}>
          <Text style={styles.reviewText}>Потрясающий вид и отличная организация! Обязательно к посещению.</Text>
          <Text style={styles.reviewAuthor}>— Анна</Text>
        </View>

        <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/booking')}>
          <Text style={styles.bookText}>Забронировать</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  galleryRow: { flexDirection: 'row' },
  galleryItem: { width: 220, height: 140, borderRadius: 12, overflow: 'hidden', marginRight: 10, backgroundColor: '#e5e7eb' },
  galleryImage: { width: '100%', height: '100%' },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 12, height: 34, borderWidth: 1, borderColor: '#e5e7eb' },
  metaText: { color: '#0f172a', fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 12, marginBottom: 8 },
  desc: { color: '#334155' },
  includedList: { gap: 8 },
  includedItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  includedText: { color: '#0f172a', fontWeight: '700' },
  mapPlaceholder: { height: 120, borderRadius: 12, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  mapText: { color: '#334155', marginTop: 6 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  reviewText: { color: '#111827' },
  reviewAuthor: { color: '#64748b', marginTop: 6 },
  bookBtn: { height: 48, borderRadius: 12, backgroundColor: '#0891b2', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  bookText: { color: '#fff', fontWeight: '800' },
});

