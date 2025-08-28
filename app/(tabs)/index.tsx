import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { sendEmergencySignal } from '../../lib/emergency';
import { getEcoBalance } from '../../lib/eco';
import { listBoosts, isBoostActive } from '../../lib/boosts';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { location } = useLocation();
  const [ecoPoints, setEcoPoints] = React.useState<number>(0);
  const [activeBoostsCount, setActiveBoostsCount] = React.useState<number>(0);

  const handleEmergency = async () => {
    if (!location) {
      Alert.alert('Ошибка', 'Не удалось определить местоположение');
      return;
    }

    Alert.alert(
      'SOS Сигнал',
      'Отправить сигнал бедствия?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          style: 'destructive',
          onPress: async () => {
            try {
              await sendEmergencySignal({ coordinates: location.coordinates, note: 'SOS сигнал', timestamp: Date.now() });
              Alert.alert('Успешно', 'SOS сигнал отправлен');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отправить сигнал');
            }
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    (async () => {
      try {
        const uid = user?.id || 'demo-user';
        const bal = await getEcoBalance(uid);
        setEcoPoints(bal.points);
      } catch {}
      try {
        const boosts = await listBoosts();
        const now = Date.now();
        setActiveBoostsCount(boosts.filter(b => isBoostActive(b, now)).length);
      } catch {}
    })();
  }, [user]);

  const services = [
    { id: 'tours', title: 'Туры', icon: 'map', onPress: () => router.push('/booking') },
    { id: 'transfer', title: 'Трансфер', icon: 'car', onPress: () => router.push('/booking') },
    { id: 'photos', title: 'Фотоотчёт', icon: 'images', onPress: () => router.push('/photos') },
    { id: 'bulletin', title: 'Объявления', icon: 'megaphone', onPress: () => router.push('/bulletin') },
    { id: 'eco', title: 'ЭКО баллы', icon: 'leaf', onPress: () => router.push('/eco'), badge: ecoPoints > 0 ? String(ecoPoints) : undefined },
    { id: 'boosts', title: 'Бусты', icon: 'rocket', onPress: () => router.push('/admin/boosts'), badge: activeBoostsCount ? String(activeBoostsCount) : undefined },
    { id: 'partners', title: 'Партнёры', icon: 'storefront', onPress: () => router.push('/partners') },
    { id: 'profile', title: 'Профиль', icon: 'person', onPress: () => router.push('/profile') },
  ];

  const recommended = [
    { id: 'r1', title: 'Вулкан Мутновский', subtitle: '1 день • 8 000 ₽', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop' },
    { id: 'r2', title: 'Долина гейзеров', subtitle: '2 дня • 15 000 ₽', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop' },
    { id: 'r3', title: 'Медвежье сафари', subtitle: '1 день • 12 000 ₽', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Хаб сервисов Камчатки</Text>
          <Text style={styles.userText}>{user ? (user.name || user.email) : 'Гость'}</Text>
        </View>

        <View style={styles.sectionPad}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.sosButton} onPress={handleEmergency}>
              <Ionicons name="warning" size={28} color="#ffffff" />
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
            <View style={styles.badgesRow}>
              <View style={styles.badgeCard}>
                <Ionicons name="leaf" size={18} color="#059669" />
                <Text style={styles.badgeText}>ЭКО: {ecoPoints}</Text>
              </View>
              <View style={styles.badgeCard}>
                <Ionicons name="rocket" size={18} color="#2563eb" />
                <Text style={styles.badgeText}>Бусты: {activeBoostsCount}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionPad}>
          <Text style={styles.sectionTitle}>Сервисы</Text>
          <View style={styles.servicesGrid}>
            {services.map(s => (
              <TouchableOpacity key={s.id} style={styles.serviceCard} onPress={s.onPress}>
                <View style={styles.serviceIconWrap}>
                  <Ionicons name={s.icon as any} size={22} color="#0891b2" />
                  {s.badge ? (
                    <View style={styles.serviceBadge}><Text style={styles.serviceBadgeText}>{s.badge}</Text></View>
                  ) : null}
                </View>
                <Text style={styles.serviceTitle}>{s.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionPad}>
          <Text style={styles.sectionTitle}>Рекомендовано</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recoRow}>
            {recommended.map(r => (
              <TouchableOpacity key={r.id} style={styles.recoCard} onPress={() => router.push('/booking')}>
                <Image source={{ uri: r.image }} style={styles.recoImage} />
                <View style={styles.recoInfo}>
                  <Text style={styles.recoTitle}>{r.title}</Text>
                  <Text style={styles.recoSubtitle}>{r.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0891b2',
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  userText: {
    fontSize: 16,
    color: '#e0f2fe',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  sectionPad: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sosButton: {
    backgroundColor: '#dc2626',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  serviceBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  recoRow: {
    paddingRight: 12,
  },
  recoCard: {
    width: 220,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recoImage: {
    width: '100%',
    height: 120,
  },
  recoInfo: {
    padding: 10,
  },
  recoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  recoSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
});