import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSession } from '@/context/SessionContext';
import { createBooking } from '@/services/dataService';

export default function BookTourScreen({ navigation }: any) {
	const route = useRoute() as RouteProp<any>;
	const tour = (route.params as any)?.tour;
	const { user } = useSession();
	const [people, setPeople] = useState(2);
	const total = useMemo(() => (tour ? tour.price * people : 0), [tour, people]);

	const onBook = async () => {
		if (!user || !tour) return;
		await createBooking({
			id: Date.now().toString(),
			tourId: tour.id,
			userId: user.id,
			people,
			date: new Date().toISOString().slice(0, 10),
			status: 'pending',
			priceTotal: total,
		});
		navigation.navigate('Profile');
	};

	if (!tour) return <View style={styles.root}><Text style={styles.title}>Нет данных тура</Text></View>;
	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.title}>Бронирование</Text></View>
			<View style={styles.card}>
				<Text style={styles.name}>{tour.title}</Text>
				<Text style={styles.meta}>📍 {tour.location}</Text>
				<View style={styles.row}> 
					<Text style={styles.label}>Количество людей:</Text>
					<View style={styles.counter}>
						<TouchableOpacity style={styles.cBtn} onPress={() => setPeople(Math.max(1, people - 1))}><Text style={styles.cTxt}>-</Text></TouchableOpacity>
						<Text style={styles.cVal}>{people}</Text>
						<TouchableOpacity style={styles.cBtn} onPress={() => setPeople(people + 1)}><Text style={styles.cTxt}>+</Text></TouchableOpacity>
					</View>
				</View>
				<View style={styles.rowBetween}>
					<Text style={styles.totalLabel}>Итого:</Text>
					<Text style={styles.totalVal}>{total.toLocaleString('ru-RU')} ₽</Text>
				</View>
				<TouchableOpacity style={styles.book} onPress={onBook}><Text style={styles.bookText}>Оформить</Text></TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: '#0f172a' },
	header: { paddingTop: 48, paddingBottom: 12, alignItems: 'center' },
	title: { color: '#fff', fontSize: 18, fontWeight: '700' },
	card: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 },
	name: { fontSize: 16, fontWeight: '700', color: '#111827' },
	meta: { fontSize: 13, color: '#334155', marginTop: 4, marginBottom: 12 },
	row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
	label: { color: '#334155' },
	counter: { flexDirection: 'row', alignItems: 'center' },
	cBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
	cTxt: { color: '#fff', fontSize: 20, fontWeight: '800' },
	cVal: { width: 40, textAlign: 'center', fontWeight: '800', fontSize: 18, color: '#111827' },
	rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 },
	totalLabel: { color: '#334155', fontSize: 16 },
	totalVal: { color: '#2563eb', fontSize: 20, fontWeight: '800' },
	book: { height: 48, borderRadius: 10, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
	bookText: { color: '#fff', fontWeight: '800' },
});