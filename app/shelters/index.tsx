import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SheltersIndex() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Убежища</Text>
			<Text style={styles.subtitle}>Заглушка списка убежищ</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
	title: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
	subtitle: { marginTop: 8, color: '#64748b' },
});

