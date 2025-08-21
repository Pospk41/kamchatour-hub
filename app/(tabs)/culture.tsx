import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCraftMasters, useCulturalEvents } from '../../hooks/useCulture';
import { useTranslation } from 'react-i18next';

export default function CultureScreen() {
  const router = useRouter();
  const { data: masterClasses = [], isLoading: mastersLoading } = useCraftMasters();
  const { data: events = [], isLoading: eventsLoading } = useCulturalEvents();
  const { t } = useTranslation();

  const renderMasterClass = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.masterClassCard}>
      <View style={styles.masterClassHeader}>
        <Text style={styles.masterClassImage}>{item.image}</Text>
        <View style={styles.masterClassInfo}>
          <Text style={styles.masterClassTitle}>{item.title}</Text>
          <Text style={styles.masterClassMaster}>Мастер: {item.master}</Text>
          <Text style={styles.masterClassVillage}>{item.village}</Text>
        </View>
      </View>
      <View style={styles.masterClassFooter}>
        <View style={styles.masterClassDetails}>
          <Text style={styles.masterClassDuration}>{item.duration}</Text>
          <Text style={styles.masterClassPrice}>{item.price} ₽</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Записаться</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEvent = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventImage}>{item.image}</Text>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventType}>{item.type}</Text>
          <Text style={styles.eventLocation}>{item.location}</Text>
        </View>
      </View>
      <View style={styles.eventFooter}>
        <Text style={styles.eventDate}>{item.date}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Подробнее</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('culture.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('culture.subtitle')}</Text>
        </View>

        {/* Master Classes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('culture.actions.masters')}</Text>
            <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/culture/masters' as any)}>
              <Text style={styles.seeAllText}>Все</Text>
              <Ionicons name="chevron-forward" size={16} color="#0891b2" />
            </TouchableOpacity>
          </View>
          {mastersLoading ? (
            <Text>Загрузка...</Text>
          ) : (
            masterClasses.map(renderMasterClass)
          )}
        </View>

        {/* Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>События</Text>
            <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/culture/events' as any)}>
              <Text style={styles.seeAllText}>Все</Text>
              <Ionicons name="chevron-forward" size={16} color="#0891b2" />
            </TouchableOpacity>
          </View>
          {eventsLoading ? (
            <Text>Загрузка...</Text>
          ) : (
            events.map(renderEvent)
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="map" size={24} color="#0891b2" />
              <Text style={styles.actionText}>{t('culture.actions.map')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="calendar" size={24} color="#0891b2" />
              <Text style={styles.actionText}>{t('culture.actions.calendar')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="people" size={24} color="#0891b2" />
              <Text style={styles.actionText}>{t('culture.actions.masters')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="gift" size={24} color="#0891b2" />
              <Text style={styles.actionText}>{t('culture.actions.souvenirs')}</Text>
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
    backgroundColor: '#0891b2',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0f2fe',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#0891b2',
    marginRight: 4,
  },
  masterClassCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  masterClassHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  masterClassImage: {
    fontSize: 32,
    marginRight: 16,
  },
  masterClassInfo: {
    flex: 1,
  },
  masterClassTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  masterClassMaster: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  masterClassVillage: {
    fontSize: 14,
    color: '#64748b',
  },
  masterClassFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masterClassDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  masterClassDuration: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 16,
  },
  masterClassPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  bookButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventImage: {
    fontSize: 32,
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: '#0891b2',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailsButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    padding: 20,
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
});