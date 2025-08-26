import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { AD_CATEGORIES, MOCK_ADS } from '../../constants/data';

export default function BulletinScreen() {
	const [ads, setAds] = useState(MOCK_ADS);
	const [filtered, setFiltered] = useState(MOCK_ADS);
	const [query, setQuery] = useState('');
	const [category, setCategory] = useState('all');
	const [addVisible, setAddVisible] = useState(false);
	const [newAd, setNewAd] = useState({ title: '', description: '', category: 'tours', price: '', contact: '' });

	useEffect(() => {
		let data = ads;
		if (category !== 'all') data = data.filter((a) => a.category === category);
		if (query) {
			const q = query.toLowerCase();
			data = data.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
		}
		setFiltered(data);
	}, [query, category, ads]);

	const toggleFavorite = (id: string) => {
		setAds((prev) => prev.map((ad) => (ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad)));
	};

	const handleAdd = () => {
		if (!newAd.title.trim()) {
			Alert.alert('Ошибка', 'Заголовок обязателен');
			return;
		}
		const ad = {
			id: Date.now().toString(),
			title: newAd.title,
			description: newAd.description,
			category: newAd.category,
			date: new Date().toISOString().slice(0, 10),
			source: 'Мое объявление',
			url: '',
			isFavorite: false,
			price: newAd.price,
			contact: newAd.contact,
		};
		setAds((prev) => [ad, ...prev]);
		setAddVisible(false);
		setNewAd({ title: '', description: '', category: 'tours', price: '', contact: '' });
	};

	const renderItem = ({ item }: any) => (
		<View style={styles.card}>
			<View style={styles.rowBetween}>
				<Text style={styles.category}>{AD_CATEGORIES.find((c) => c.id === item.category)?.name}</Text>
				<Text style={styles.date}>{item.date}</Text>
			</View>
			<Text style={styles.title}>{item.title}</Text>
			{item.price ? <Text style={styles.price}>Цена: {item.price}</Text> : null}
			<Text style={styles.desc}>{item.description}</Text>
			<View style={styles.rowBetween}>
				<Text style={styles.source}>Источник: {item.source}</Text>
				<TouchableOpacity onPress={() => toggleFavorite(item.id)}>
					<Text style={[styles.heart, item.isFavorite && styles.heartActive]}>{item.isFavorite ? '❤️' : '🤍'}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.headerTitle}>Доска объявлений</Text></View>
			<View style={styles.searchBox}>
				<TextInput value={query} onChangeText={setQuery} style={styles.input} placeholder="Поиск объявлений..." />
			</View>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={AD_CATEGORIES}
				keyExtractor={(c) => c.id}
				renderItem={({ item }) => (
					<TouchableOpacity style={[styles.catBtn, category === item.id && styles.catActive]} onPress={() => setCategory(item.id)}>
						<Text style={styles.catText}>{item.name}</Text>
					</TouchableOpacity>
				)}
				style={styles.categories}
			/>
			<FlatList data={filtered} renderItem={renderItem} keyExtractor={(a) => a.id} contentContainerStyle={styles.list} />
			<TouchableOpacity style={styles.addBtn} onPress={() => setAddVisible(true)}>
				<Text style={styles.addText}>+</Text>
			</TouchableOpacity>

			<Modal transparent visible={addVisible} onRequestClose={() => setAddVisible(false)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Добавить объявление</Text>
						<TextInput placeholder="Заголовок *" value={newAd.title} onChangeText={(t) => setNewAd({ ...newAd, title: t })} style={styles.mInput} />
						<TextInput placeholder="Описание" value={newAd.description} onChangeText={(t) => setNewAd({ ...newAd, description: t })} style={[styles.mInput, styles.mArea]} multiline />
						<View style={styles.rowBetween}>
							<TextInput placeholder="Цена" value={newAd.price} onChangeText={(t) => setNewAd({ ...newAd, price: t })} style={[styles.mInput, { flex: 1, marginRight: 6 }]} keyboardType="numeric" />
							<TextInput placeholder="Контакт" value={newAd.contact} onChangeText={(t) => setNewAd({ ...newAd, contact: t })} style={[styles.mInput, { flex: 1, marginLeft: 6 }]} />
						</View>
						<View style={styles.rowBetween}>
							<TouchableOpacity style={[styles.mBtn, styles.btnCancel]} onPress={() => setAddVisible(false)}><Text style={styles.btnCancelText}>Отмена</Text></TouchableOpacity>
							<TouchableOpacity style={[styles.mBtn, styles.btnSave]} onPress={handleAdd}><Text style={styles.btnSaveText}>Добавить</Text></TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: '#0f172a' },
	header: { paddingTop: 48, paddingBottom: 12, alignItems: 'center' },
	headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
	searchBox: { paddingHorizontal: 16, paddingVertical: 10 },
	input: { height: 44, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#ffffff', fontSize: 16 },
	categories: { maxHeight: 44, marginTop: 8 },
	catBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 8 },
	catActive: { backgroundColor: '#eab308' },
	catText: { color: '#fff' },
	list: { padding: 12 },
	card: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 12, marginBottom: 12 },
	rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	category: { color: '#2563eb', fontWeight: '600' },
	date: { color: '#64748b', fontSize: 12 },
	title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginTop: 4 },
	price: { fontSize: 14, fontWeight: '600', marginTop: 4, color: '#111827' },
	desc: { fontSize: 14, color: '#334155', marginTop: 6 },
	source: { fontSize: 12, color: '#64748b' },
	heart: { fontSize: 18 },
	heartActive: { color: '#e11d48' },
	addBtn: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#eab308', alignItems: 'center', justifyContent: 'center' },
	addText: { color: '#fff', fontSize: 32, lineHeight: 32 },
	modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16 },
	modalCard: { width: '100%', maxWidth: 520, backgroundColor: '#fff', borderRadius: 12, padding: 16 },
	modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#111827' },
	mInput: { height: 44, borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 10, backgroundColor: '#f9fafb' },
	mArea: { height: 100, textAlignVertical: 'top' },
	mBtn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
	btnCancel: { backgroundColor: '#e5e7eb', marginRight: 6 },
	btnCancelText: { color: '#374151', fontWeight: '700' },
	btnSave: { backgroundColor: '#eab308', marginLeft: 6 },
	btnSaveText: { color: '#fff', fontWeight: '700' },
});