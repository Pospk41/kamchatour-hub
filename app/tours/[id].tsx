import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTour } from '../../hooks/useTours';
import MapView, { Marker } from 'react-native-maps';
import dayjs from 'dayjs';
import { useOccurrences } from '../../hooks/useAvailability';

export default function PublicTour() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const tourId = String(id);
	const { data: tour } = useTour(tourId);
	const { data: occurrences = [] } = useOccurrences(tourId);

	if (!tour) return (
		<SafeAreaView style={styles.container}><Text style={styles.title}>Загрузка...</Text></SafeAreaView>
	);

	const start = { latitude: tour.startPoint.lat, longitude: tour.startPoint.lng };
	const monthKey = dayjs().format('YYYY-MM');
	const days = Array.from({ length: dayjs().daysInMonth() }, (_, i) => dayjs().date(i + 1));
	const occDays = new Set(occurrences.map(o => dayjs(o.startDateTime).format('YYYY-MM-DD')));

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Text style={styles.title}>{tour.title}</Text>
				<Text style={styles.price}>от {tour.basePrice} {tour.currency}</Text>
				<View style={styles.mapBox}>
					<MapView style={StyleSheet.absoluteFill} initialRegion={{ latitude: start.latitude, longitude: start.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
						<Marker coordinate={start} title="Старт" />
					</MapView>
				</View>
				<Text style={styles.heading}>Доступность</Text>
				<View style={styles.calendarGrid}>
					{days.map(d => {
						const key = d.format('YYYY-MM-DD');
						const active = occDays.has(key);
						return (
							<View key={key} style={[styles.dayCell, active && styles.dayActive]}>
								<Text style={[styles.dayText, active && styles.dayActiveText]}>{d.date()}</Text>
							</View>
						);
					})}
				</View>
				<Text style={styles.heading}>Описание</Text>
				<Text style={styles.body}>{tour.description}</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	title: { fontSize: 22, fontWeight: '700', color: '#1e293b', padding: 16 },
	price: { color: '#0891b2', paddingHorizontal: 16, marginBottom: 8, fontWeight: '700' },
	mapBox: { height: 220, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#e2e8f0' },
	heading: { marginTop: 16, paddingHorizontal: 16, fontWeight: '700', color: '#334155' },
	calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, marginTop: 8 },
	dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
	dayText: { color: '#64748b' },
	dayActive: { backgroundColor: '#dcfce7', borderRadius: 8 },
	dayActiveText: { color: '#166534', fontWeight: '700' },
	body: { padding: 16, color: '#334155' },
});

