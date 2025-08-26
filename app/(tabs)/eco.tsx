import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';
import { useRouter } from 'expo-router';
import { getEcoBalance } from '../../lib/eco';
import { listBoosts, isBoostActive } from '../../lib/boosts';

export default function EcoScreen() {
  const { location } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();
  const [ecoPoints, setEcoPoints] = useState<number>(0);
  const [activeBoosts, setActiveBoosts] = useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      // заглушка userId, в реальном коде возьмём из useAuth
      const bal = await getEcoBalance('demo-user');
      setEcoPoints(bal.points);
      const boosts = await listBoosts();
      const now = Date.now();
      setActiveBoosts(boosts.filter(b => isBoostActive(b, now)).slice(0, 4));
    })();
  }, []);

  const ecoData = {
    airQuality: {
      status: 'Хорошо',
      value: 45,
      color: '#10b981',
      description: 'Воздух чистый, подходит для активного отдыха',
    },
    waterQuality: {
      status: 'Отлично',
      value: 15,
      color: '#3b82f6',
      description: 'Вода кристально чистая, пригодна для питья',
    },
    wildlifeActivity: {
      status: 'Высокая',
      value: 85,
      color: '#f59e0b',
      description: 'Активность диких животных повышена',
    },
    weatherConditions: {
      status: 'Стабильно',
      value: 70,
      color: '#8b5cf6',
      description: 'Погодные условия благоприятны',
    },
  };

  const ecoTips = [
    {
      id: '1',
      title: 'Уважайте дикую природу',
      description: 'Не приближайтесь к диким животным ближе чем на 100 метров',
      icon: '🐻',
      category: 'wildlife',
    },
    {
      id: '2',
      title: 'Убирайте за собой',
      description: 'Всегда забирайте мусор с собой, не оставляйте следов',
      icon: '🗑️',
      category: 'waste',
    },
    {
      id: '3',
      title: 'Используйте экотропы',
      description: 'Ходите только по обозначенным тропам',
      icon: '🛤️',
      category: 'trails',
    },
    {
      id: '4',
      title: 'Берегите воду',
      description: 'Не загрязняйте водоемы, используйте биоразлагаемые средства',
      icon: '💧',
      category: 'water',
    },
    {
      id: '5',
      title: 'Огонь только в разрешенных местах',
      description: 'Разводите костры только в специально оборудованных местах',
      icon: '🔥',
      category: 'fire',
    },
    {
      id: '6',
      title: 'Фотографируйте, не трогайте',
      description: 'Делайте снимки растений и животных, не срывайте и не ловите',
      icon: '📸',
      category: 'photography',
    },
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: '🌿' },
    { id: 'wildlife', name: 'Дикая природа', icon: '🐻' },
    { id: 'waste', name: 'Отходы', icon: '🗑️' },
    { id: 'trails', name: 'Тропы', icon: '🛤️' },
    { id: 'water', name: 'Вода', icon: '💧' },
    { id: 'fire', name: 'Огонь', icon: '🔥' },
    { id: 'photography', name: 'Фото', icon: '📸' },
  ];

  const filteredTips = selectedCategory === 'all' 
    ? ecoTips 
    : ecoTips.filter(tip => tip.category === selectedCategory);

  const renderEcoMetric = (key: string, data: any) => (
    <View key={key} style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{key === 'airQuality' ? 'Качество воздуха' : 
                                           key === 'waterQuality' ? 'Качество воды' :
                                           key === 'wildlifeActivity' ? 'Активность животных' : 'Погодные условия'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: data.color }]}>
          <Text style={styles.statusText}>{data.status}</Text>
        </View>
      </View>
      <View style={styles.metricValue}>
        <Text style={styles.valueNumber}>{data.value}</Text>
        <Text style={styles.valueUnit}>{key === 'airQuality' ? 'AQI' : 
                                       key === 'waterQuality' ? 'мг/л' :
                                       key === 'wildlifeActivity' ? '%' : '%'}</Text>
      </View>
      <Text style={styles.metricDescription}>{data.description}</Text>
    </View>
  );

  const renderEcoTip = (tip: any) => (
    <TouchableOpacity key={tip.id} style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipIcon}>{tip.icon}</Text>
        <Text style={styles.tipTitle}>{tip.title}</Text>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
      <View style={styles.tipFooter}>
        <Text style={styles.categoryTag}>
          {categories.find(c => c.id === tip.category)?.name || 'Совет'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Экология</Text>
          <Text style={styles.headerSubtitle}>Актуальные условия и советы</Text>
        </View>

        {/* Eco Points Balance */}
        <View style={styles.pointsCard}>
          <Ionicons name="leaf" size={20} color="#10b981" />
          <Text style={styles.pointsText}>ЭКО баллы: <Text style={styles.pointsValue}>{ecoPoints}</Text></Text>
        </View>

        {/* Active Boosts */}
        {activeBoosts.length > 0 && (
          <View style={styles.boostsSection}>
            <Text style={styles.sectionTitle}>Активные бусты</Text>
            {activeBoosts.map((b) => (
              <View key={b.id} style={styles.boostCard}>
                <Text style={styles.boostName}>{b.name}</Text>
                {b.multiplier && <Text style={styles.boostMeta}>×{b.multiplier}</Text>}
                {b.bonusPoints && <Text style={styles.boostMeta}>+{b.bonusPoints} баллов</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Eco Metrics */}
        <View style={styles.metricsContainer}>
          {Object.entries(ecoData).map(([key, data]) => renderEcoMetric(key, data))}
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Eco Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Экологические советы</Text>
          {filteredTips.map(renderEcoTip)}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="leaf" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Эко-отчет</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/photos')}>
              <Ionicons name="camera" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Фото природы</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="map" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Эко-карта</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="people" size={24} color="#0891b2" />
              <Text style={styles.actionText}>Волонтерство</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#10b981',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f2fe',
    marginTop: 4,
  },
  metricsContainer: {
    padding: 16,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  valueNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
  },
  valueUnit: {
    marginLeft: 6,
    color: '#6b7280',
    fontWeight: '600',
  },
  metricDescription: {
    marginTop: 8,
    color: '#374151',
  },
  categoriesContainer: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#cffafe',
    borderColor: '#67e8f9',
  },
  categoryIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  categoryName: {
    color: '#155e75',
    fontWeight: '700',
  },
  categoryNameActive: {
    color: '#0e7490',
  },
  tipsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  tipDescription: {
    color: '#374151',
  },
  tipFooter: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: '#ecfeff',
    color: '#155e75',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '700',
  },
  quickActions: {
    padding: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  pointsCard: {
    backgroundColor: '#ecfeff',
    borderColor: '#a5f3fc',
    borderWidth: 1,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsText: { color: '#0e7490', fontWeight: '700' },
  pointsValue: { color: '#0e7490' },
  boostsSection: { paddingHorizontal: 16, marginTop: 4 },
  boostCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boostName: { color: '#111827', fontWeight: '700' },
  boostMeta: { color: '#374151', fontWeight: '600' },
});