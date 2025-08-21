import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTour, useUpdateTour, usePublishTour } from '../../../../hooks/useTours';

export default function EditTour() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: tour } = useTour(String(id));
	const updateMut = useUpdateTour();
	const publishMut = usePublishTour();
	const [title, setTitle] = useState('');
	const [basePrice, setBasePrice] = useState('0');

	useEffect(() => {
		if (tour) {
			setTitle(tour.title);
			setBasePrice(String(tour.basePrice));
		}
	}, [tour]);

	const save = async () => {
		if (!id) return;
		await updateMut.mutateAsync({ tourId: String(id), patch: { title, basePrice: Number(basePrice) } });
		Alert.alert('Сохранено', 'Изменения сохранены');
	};

	const publish = async () => {
		if (!id) return;
		await publishMut.mutateAsync(String(id));
		Alert.alert('Опубликовано', 'Тур опубликован');
	};

	if (!tour) return (
		<SafeAreaView style={styles.container}><Text style={styles.title}>Загрузка...</Text></SafeAreaView>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Редактирование тура</Text>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<Text style={styles.label}>Название</Text>
				<TextInput style={styles.input} value={title} onChangeText={setTitle} />
				<Text style={styles.label}>Базовая цена (₽)</Text>
				<TextInput style={styles.input} value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" />
				<View style={styles.actions}>
					<TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryText}>Сохранить</Text></TouchableOpacity>
					<TouchableOpacity style={styles.secondary} onPress={publish}><Text style={styles.secondaryText}>Опубликовать</Text></TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	title: { fontSize: 20, fontWeight: '700', color: '#1e293b', paddingHorizontal: 16, paddingTop: 12 },
	label: { marginTop: 12, marginBottom: 6, color: '#334155' },
	input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
	actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
	primary: { backgroundColor: '#0891b2', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
	primaryText: { color: '#fff', fontWeight: '700' },
	secondary: { backgroundColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
	secondaryText: { color: '#111827', fontWeight: '600' },
});

