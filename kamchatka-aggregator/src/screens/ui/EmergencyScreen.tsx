import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const CONTACTS = [
	{ id: '1', name: 'МЧС Камчатка', phone: '112' },
	{ id: '2', name: 'Спасательная служба', phone: '8 (4152) 41-03-95' },
	{ id: '3', name: 'Медицинская помощь', phone: '103' },
	{ id: '4', name: 'Полиция', phone: '102' },
];

export default function EmergencyScreen() {
	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.title}>Экстренные контакты</Text></View>
			<FlatList
				data={CONTACTS}
				keyExtractor={(c) => c.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.phone}>{item.phone}</Text>
					</View>
				)}
				contentContainerStyle={styles.list}
			/>
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
	phone: { fontSize: 14, color: '#334155', marginTop: 4 },
});