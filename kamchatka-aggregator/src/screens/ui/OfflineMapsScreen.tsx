import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OfflineMapsScreen() {
	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.title}>Офлайн‑карты</Text></View>
			<View style={styles.card}>
				<Text style={styles.text}>
					Здесь будет управление офлайн‑картами и треками (заглушка). Следующие шаги:
				</Text>
				<Text style={styles.li}>• Хранение треков и тайлов</Text>
				<Text style={styles.li}>• Скачивание по регионам</Text>
				<Text style={styles.li}>• Просмотр маршрутов без сети</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: '#f8fafc' },
	header: { paddingTop: 48, paddingBottom: 12, alignItems: 'center' },
	title: { fontSize: 18, fontWeight: '700' },
	card: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
	text: { color: '#334155', marginBottom: 8 },
	li: { color: '#0f172a', marginTop: 4 },
});