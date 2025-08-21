import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergencyIndex() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Экстренные службы и убежища</Text>
			<Text style={styles.subtitle}>Заглушка: список убежищ и SOS</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
	title: { fontSize: 20, fontWeight: '700', color: '#1e293b', textAlign: 'center', paddingHorizontal: 16 },
	subtitle: { marginTop: 8, color: '#64748b' },
});

