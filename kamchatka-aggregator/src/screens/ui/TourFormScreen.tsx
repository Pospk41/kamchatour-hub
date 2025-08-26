import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { listTours, saveTours } from '@/services/dataService';
import { Tour } from '@/types';

const TAGS = ['volcano', 'thermals', 'fishing', 'nature', 'helicopter', 'sea', 'jeep', 'rafting'];

export default function TourFormScreen({ navigation }: any) {
	const [title, setTitle] = useState('');
	const [location, setLocation] = useState('');
	const [price, setPrice] = useState('');
	const [tag, setTag] = useState('volcano');

	const onSave = async () => {
		if (!title.trim() || !location.trim() || !price) return Alert.alert('Ошибка', 'Заполните все поля');
		const tours = await listTours();
		const t: Tour = {
			id: Date.now().toString(),
			title,
			tag,
			location,
			price: Number(price),
		};
		await saveTours([t, ...tours]);
		Alert.alert('Готово', 'Тур добавлен');
		navigation.goBack();
	};

	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.title}>Добавить тур</Text></View>
			<View style={styles.form}>
				<TextInput placeholder="Название" value={title} onChangeText={setTitle} style={styles.input} />
				<TextInput placeholder="Локация" value={location} onChangeText={setLocation} style={styles.input} />
				<TextInput placeholder="Цена" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
				<TextInput placeholder="Тег (напр. volcano)" value={tag} onChangeText={setTag} style={styles.input} />
				<TouchableOpacity style={styles.save} onPress={onSave}><Text style={styles.saveText}>Сохранить</Text></TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: '#0f172a' },
	header: { paddingTop: 48, paddingBottom: 12, alignItems: 'center' },
	title: { color: '#fff', fontSize: 18, fontWeight: '700' },
	form: { padding: 16 },
	input: { height: 46, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12, backgroundColor: '#fff' },
	save: { height: 48, borderRadius: 10, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
	saveText: { color: '#fff', fontWeight: '800' },
});