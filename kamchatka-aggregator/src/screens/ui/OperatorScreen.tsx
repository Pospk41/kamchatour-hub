import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { listTours } from '@/services/dataService';
import { Tour } from '@/types';

export default function OperatorScreen({ navigation }: any) {
	const [tours, setTours] = useState<Tour[]>([]);
	useEffect(() => { (async () => setTours(await listTours()))(); }, []);
	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.title}>Кабинет оператора</Text></View>
			<FlatList data={tours} keyExtractor={(t) => t.id} renderItem={({ item }) => (
				<View style={styles.card}>
					<Text style={styles.name}>{item.title}</Text>
					<Text style={styles.meta}>{item.location} • {item.price.toLocaleString('ru-RU')} ₽</Text>
				</View>
			)} contentContainerStyle={styles.list} />
			<TouchableOpacity style={styles.add} onPress={() => navigation.navigate('TourForm')}>
				<Text style={styles.addText}>Добавить тур</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: '#0f172a' },
	header: { paddingTop: 48, paddingBottom: 12, alignItems: 'center' },
	title: { color: '#fff', fontSize: 18, fontWeight: '700' },
	list: { padding: 12 },
	card: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: 12, marginBottom: 12 },
	name: { fontSize: 16, fontWeight: '700', color: '#111827' },
	meta: { fontSize: 13, color: '#334155', marginTop: 4 },
	add: { position: 'absolute', bottom: 24, left: 16, right: 16, height: 48, borderRadius: 10, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
	addText: { color: '#fff', fontWeight: '800' },
});