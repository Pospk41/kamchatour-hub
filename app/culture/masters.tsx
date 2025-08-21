import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCraftMasters } from '../../hooks/useCulture';

export default function CultureMasters() {
	const { data = [], isLoading, error } = useCraftMasters();
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Мастера ремесел</Text>
			{isLoading && <Text>Загрузка...</Text>}
			{error && <Text>Ошибка загрузки</Text>}
			<ScrollView>
				{data.map((m) => (
					<TouchableOpacity key={m.id} style={styles.card}>
						<Text style={styles.emoji}>{m.image}</Text>
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>{m.title}</Text>
							<Text style={styles.meta}>Мастер: {m.master} • {m.village}</Text>
						</View>
						<Text style={styles.price}>{m.price} ₽</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
	title: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
	card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
	emoji: { fontSize: 24, marginRight: 12 },
	name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
	meta: { marginTop: 2, color: '#64748b' },
	price: { fontWeight: '700', color: '#0891b2' },
});

