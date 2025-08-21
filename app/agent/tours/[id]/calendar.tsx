import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useOccurrences, useSchedulePatterns, useSetOccurrences } from '../../../../hooks/useAvailability';
import dayjs from 'dayjs';

export default function TourCalendar() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const tourId = String(id);
	const { data: patterns = [] } = useSchedulePatterns(tourId);
	const { data: occurrences = [] } = useOccurrences(tourId);
	const setOcc = useSetOccurrences(tourId);
	const [monthOffset, setMonthOffset] = useState(0);

	const monthStart = dayjs().add(monthOffset, 'month').startOf('month');
	const grid = useMemo(() => {
		const daysInMonth = monthStart.daysInMonth();
		return Array.from({ length: daysInMonth }, (_, i) => monthStart.date(i + 1));
	}, [monthStart]);

	const occByDay = useMemo(() => {
		const map: Record<string, number> = {};
		for (const o of occurrences) {
			const d = dayjs(o.startDateTime).format('YYYY-MM-DD');
			map[d] = (map[d] ?? 0) + o.capacityAvailable;
		}
		return map;
	}, [occurrences]);

	const generateExample = async () => {
		const days = grid.slice(0, 5);
		await setOcc.mutateAsync(days.map((d, idx) => ({
			id: `${d.valueOf()}-${idx}`,
			tourId,
			startDateTime: d.hour(10).toISOString(),
			capacityTotal: 12,
			capacityAvailable: 12,
			price: 5000,
			status: 'available',
		})));
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => setMonthOffset(m => m - 1)}><Text style={styles.nav}>{'<'}</Text></TouchableOpacity>
				<Text style={styles.title}>{monthStart.format('MMMM YYYY')}</Text>
				<TouchableOpacity onPress={() => setMonthOffset(m => m + 1)}><Text style={styles.nav}>{'>'}</Text></TouchableOpacity>
			</View>
			<ScrollView contentContainerStyle={styles.calendar}>
				{grid.map(d => {
					const key = d.format('YYYY-MM-DD');
					const avail = occByDay[key] ?? 0;
					return (
						<View key={key} style={styles.cell}>
							<Text style={styles.day}>{d.date()}</Text>
							{avail > 0 && <Text style={styles.badge}>{avail}</Text>}
						</View>
					);
				})}
			</ScrollView>
			<View style={styles.actions}>
				<TouchableOpacity style={styles.primary} onPress={generateExample}><Text style={styles.primaryText}>Сгенерировать примеры дат</Text></TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
	title: { fontWeight: '700', color: '#1e293b' },
	nav: { fontSize: 20, color: '#0891b2' },
	calendar: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
	cell: { width: '14.28%', aspectRatio: 1, padding: 4 },
	day: { color: '#334155', textAlign: 'center' },
	badge: { marginTop: 4, textAlign: 'center', color: '#16a34a', fontWeight: '700' },
	actions: { padding: 16 },
	primary: { backgroundColor: '#0891b2', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignSelf: 'center' },
	primaryText: { color: '#fff', fontWeight: '700' },
});

