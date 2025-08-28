import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const PARTNERS = [
  { id: 'tilda', name: 'Tilda', url: 'https://tilda.cc/ru/', logo: 'https://static.tildacdn.com/tild3362-3733-4231-a466-656532643232/Tilda_Logo_black.svg' },
  { id: 'dar-severa', name: 'Дар Севера', url: 'https://dar-severa.ru/', logo: undefined },
];

const THEMES = [
  { id: 'eco', name: 'Эко‑туры' },
  { id: 'premium', name: 'Премиум' },
  { id: 'family', name: 'Для семьи' },
  { id: 'extreme', name: 'Экстрим' },
  { id: 'fishing', name: 'Рыбалка' },
];

const CURATIONS = [
  { id: 'c1', title: 'Выбор Tilda', subtitle: '3 лучших тура недели', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop', price: 9500 },
  { id: 'c2', title: 'Дар Севера: промо', subtitle: '−15% на проживание', image: 'https://images.unsplash.com/photo-1526481280698-8fcc13fd5f1d?q=80&w=1200&auto=format&fit=crop', price: 0 },
];

export default function PartnersScreen() {
  const router = useRouter();
  const [theme, setTheme] = React.useState<string>('eco');

  const open = async (url: string) => {
    try { await Linking.openURL(url); } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Партнёры</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={styles.chipsRow}>
            {THEMES.map(t => (
              <TouchableOpacity key={t.id} style={[styles.chip, theme === t.id && styles.chipActive]} onPress={() => setTheme(t.id)}>
                <Text style={[styles.chipText, theme === t.id && styles.chipTextActive]}>{t.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.section}>Бренды</Text>
        {PARTNERS.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => open(p.url)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {p.logo ? <Image source={{ uri: p.logo }} style={{ width: 36, height: 36 }} /> : <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#e5e7eb' }} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.url}>{p.url}</Text>
              </View>
              <Text style={{ color: '#0891b2', fontWeight: '800' }}>Перейти</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.section}>Подборки и акции</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 12 }}>
          {CURATIONS.map(c => (
            <TouchableOpacity key={c.id} style={styles.curationCard} onPress={() => router.push({ pathname: '/booking/funnel', params: { id: c.id, title: c.title, price: String(c.price) } })}>
              <Image source={{ uri: c.image }} style={styles.curationImage} />
              <View style={styles.curationInfo}>
                <Text style={styles.curationTitle}>{c.title}</Text>
                <Text style={styles.curationSubtitle}>{c.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 12 },
  section: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 8, marginTop: 4 },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: { height: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc' },
  chipText: { color: '#0f172a', fontWeight: '700' },
  chipTextActive: { color: '#075985' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  name: { color: '#0f172a', fontWeight: '800' },
  url: { color: '#0369a1', marginTop: 4 },
  curationCard: { width: 240, marginRight: 12, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  curationImage: { width: '100%', height: 120 },
  curationInfo: { padding: 10 },
  curationTitle: { color: '#0f172a', fontWeight: '800' },
  curationSubtitle: { color: '#475569', marginTop: 4 },
});

