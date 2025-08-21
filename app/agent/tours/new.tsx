import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateTour } from '../../../hooks/useTours';

export default function NewTourWizard() {
	const operatorId = 'operator-demo';
	const createMut = useCreateTour(operatorId);
	const [step, setStep] = useState(1);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [basePrice, setBasePrice] = useState('0');
	const [maxGroup, setMaxGroup] = useState('10');

	const next = () => setStep(s => Math.min(4, s + 1));
	const prev = () => setStep(s => Math.max(1, s - 1));

	const save = async () => {
		try {
			await createMut.mutateAsync({
				title,
				description,
				basePrice: Number(basePrice),
				currency: 'RUB',
				difficulty: 'moderate',
				minGroup: 1,
				maxGroup: Number(maxGroup),
				startPoint: { lat: 53.023, lng: 158.65 },
				highlights: [],
				includes: [],
				excludes: [],
				equipment: [],
				languages: ['ru'],
				waypoints: [],
				minAge: 0,
				depositPct: 0,
				cancellationPolicy: 'standard',
				bookingCutoffHours: 24,
				minParticipants: 1,
				galleryUrls: [],
				categories: [],
				tags: [],
			});
			Alert.alert('Сохранено', 'Черновик тура создан');
		} catch (e) {
			Alert.alert('Ошибка', 'Не удалось сохранить тур');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Создание тура — шаг {step}/4</Text>
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				{step === 1 && (
					<View>
						<Text style={styles.label}>Название</Text>
						<TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Название тура" />
						<Text style={styles.label}>Описание</Text>
						<TextInput style={[styles.input, { height: 120 }]} value={description} onChangeText={setDescription} placeholder="Описание" multiline />
					</View>
				)}
				{step === 2 && (
					<View>
						<Text style={styles.label}>Базовая цена (₽)</Text>
						<TextInput style={styles.input} value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" />
						<Text style={styles.label}>Максимум в группе</Text>
						<TextInput style={styles.input} value={maxGroup} onChangeText={setMaxGroup} keyboardType="numeric" />
					</View>
				)}
				{step === 3 && (
					<View>
						<Text style={styles.label}>Точка старта</Text>
						<Text style={styles.note}>По умолчанию: Камчатка (53.023, 158.65).</Text>
					</View>
				)}
				{step === 4 && (
					<View>
						<Text style={styles.label}>Медиа и публикация</Text>
						<Text style={styles.note}>Загрузку фото/обложки добавим на следующем шаге.</Text>
					</View>
				)}
				<View style={styles.actions}>
					{step > 1 && (
						<TouchableOpacity style={styles.secondary} onPress={prev}><Text style={styles.secondaryText}>Назад</Text></TouchableOpacity>
					)}
					{step < 4 ? (
						<TouchableOpacity style={styles.primary} onPress={next}><Text style={styles.primaryText}>Далее</Text></TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.primary} onPress={save}><Text style={styles.primaryText}>Сохранить</Text></TouchableOpacity>
					)}
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
	note: { color: '#64748b' },
	actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
	primary: { backgroundColor: '#0891b2', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
	primaryText: { color: '#fff', fontWeight: '700' },
	secondary: { backgroundColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
	secondaryText: { color: '#111827', fontWeight: '600' },
});

