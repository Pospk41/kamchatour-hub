import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Dimensions, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ALL_ACTIVITIES } from '../../constants/data';

const { width } = Dimensions.get('window');

type RouteParams = { tag?: string; title?: string };

export default function ActivitiesScreen() {
	const route = useRoute();
	const { tag, title } = (route.params || {}) as RouteParams;
	const [selected, setSelected] = useState<any>(null);
	const [favorites, setFavorites] = useState<Record<string, boolean>>({});
	const data = useMemo(
		() => ALL_ACTIVITIES.filter((t) => (tag ? t.tag === tag : true)).map((t) => ({ ...t, isFavorite: !!favorites[t.id] })),
		[tag, favorites]
	);
	const toggleFav = (id: string) => setFavorites((p) => ({ ...p, [id]: !p[id] }));

	const renderItem = ({ item }: any) => (
		<TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
			<View style={styles.imageWrap}>
				<Image source={{ uri: item.image }} style={styles.image} />
				{item.spotsLeft > 0 && item.spotsLeft < 5 && (
					<View style={styles.badge}><Text style={styles.badgeText}>Осталось {item.spotsLeft}</Text></View>
				)}
				<TouchableOpacity style={styles.favBtn} onPress={() => toggleFav(item.id)}>
					<Text style={[styles.favIcon, item.isFavorite && styles.favActive]}>{item.isFavorite ? '❤️' : '🤍'}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.info}>
				<Text style={styles.title}>{item.title}</Text>
				<Text style={styles.loc}>📍 {item.location}</Text>
				<View style={styles.rowBetween}>
					<View>
						<Text style={styles.price}>{item.price.toLocaleString('ru-RU')} ₽</Text>
						<Text style={styles.per}>за человека</Text>
					</View>
					<View style={styles.ratingWrap}>
						<Text style={styles.rating}>★ {item.rating}</Text>
						<Text style={styles.reviews}>({item.reviews})</Text>
					</View>
				</View>
				<View style={styles.footer}>
					<Text style={styles.cancel}>✅ {item.cancellation}</Text>
					<TouchableOpacity style={styles.bookBtn} onPress={() => setSelected(item)}>
						<Text style={styles.bookText}>Выбрать даты</Text>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.root}>
			<View style={styles.header}><Text style={styles.headerTitle}>{title || 'Активности'}</Text></View>
			<FlatList data={data} renderItem={renderItem} keyExtractor={(it) => it.id} contentContainerStyle={styles.list} />
			<Modal transparent visible={!!selected} onRequestClose={() => setSelected(null)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						<ScrollView>
							{selected && (
								<>
									<Image source={{ uri: selected.image }} style={styles.modalImage} />
									<Text style={styles.modalTitle}>{selected.title}</Text>
									<Text style={styles.modalLoc}>📍 {selected.location}</Text>
									<Text style={styles.modalDesc}>{selected.description}</Text>
								</>
							)}
						</ScrollView>
						<TouchableOpacity style={styles.close} onPress={() => setSelected(null)}><Text style={styles.closeText}>✕</Text></TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: '#f8fafc' },
	header: { paddingTop: 48, paddingBottom: 12, alignItems: 'center', backgroundColor: '#0f172a' },
	headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
	list: { padding: 12 },
	card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12, elevation: 2 },
	imageWrap: { width: '100%', height: 160 },
	image: { width: '100%', height: '100%' },
	badge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#e11d48', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
	badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
	favBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.8)', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
	favIcon: { fontSize: 16 },
	favActive: { color: '#e11d48' },
	info: { padding: 12 },
	title: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
	loc: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
	rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
	price: { fontSize: 16, fontWeight: '700', color: '#ef4444' },
	per: { fontSize: 10, color: '#9ca3af' },
	ratingWrap: { flexDirection: 'row', alignItems: 'center' },
	rating: { fontSize: 13, color: '#f59e0b', fontWeight: 'bold', marginRight: 4 },
	reviews: { fontSize: 11, color: '#6b7280' },
	footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
	cancel: { fontSize: 10, color: '#10b981', flex: 1 },
	bookBtn: { backgroundColor: '#2563eb', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
	bookText: { color: '#fff', fontWeight: '600', fontSize: 12 },
	modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 16 },
	modalCard: { width: Math.min(width - 32, 560), backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
	modalImage: { width: '100%', height: 220 },
	modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', paddingHorizontal: 16, marginTop: 12 },
	modalLoc: { fontSize: 13, color: '#6b7280', paddingHorizontal: 16, marginTop: 6 },
	modalDesc: { fontSize: 14, color: '#374151', padding: 16, lineHeight: 20 },
	close: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
	closeText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});