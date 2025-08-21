import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOperatorTours } from '../../hooks/useTours';

export default function AgentIndex() {
	const operatorId = 'operator-demo';
	const router = useRouter();
	const { data: tours = [] } = useOperatorTours(operatorId);
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Агентский интерфейс</Text>
			<TouchableOpacity style={styles.primary} onPress={() => router.push('/agent/tours/new' as any)}>
				<Text style={styles.primaryText}>Создать новый тур</Text>
			</TouchableOpacity>
			{tours.map(t => (
				<View key={t.id} style={styles.card}>
					<Text style={styles.cardTitle}>{t.title}</Text>
					<View style={styles.row}>
						<TouchableOpacity style={styles.link} onPress={() => router.push(`/agent/tours/${t.id}/edit` as any)}><Text style={styles.linkText}>Редактировать</Text></TouchableOpacity>
						<TouchableOpacity style={styles.link} onPress={() => router.push(`/agent/tours/${t.id}/calendar` as any)}><Text style={styles.linkText}>Календарь</Text></TouchableOpacity>
					</View>
				</View>
			))}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
	title: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
	primary: { backgroundColor: '#0891b2', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
	primaryText: { color: '#fff', fontWeight: '700' },
	card: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12 },
	cardTitle: { fontWeight: '700', color: '#111827' },
	row: { flexDirection: 'row', gap: 16, marginTop: 8 },
	link: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#e2e8f0', borderRadius: 8 },
	linkText: { color: '#111827' },
});

