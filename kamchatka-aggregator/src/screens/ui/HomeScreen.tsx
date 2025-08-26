import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ACTIVITIES = [
	{ id: 'volcano', icon: '🗻', title: 'Вулканы' },
	{ id: 'thermals', icon: '♨️', title: 'Термы' },
	{ id: 'fishing', icon: '🎣', title: 'Рыбалка' },
	{ id: 'nature', icon: '🐻', title: 'Природа' },
	{ id: 'helicopter', icon: '🚁', title: 'Вертолёты' },
	{ id: 'sea', icon: '⛵', title: 'Морские' },
	{ id: 'jeep', icon: '🚗', title: 'Джип-туры' },
	{ id: 'rafting', icon: '🛶', title: 'Сплавы' },
];

export default function HomeScreen() {
	const navigation = useNavigation();
	const tiles = useMemo(() => ACTIVITIES, []);
	return (
		<ImageBackground
			source={{ uri: 'https://cs8.pikabu.ru/post_img/big/2017/05/12/4/1494568737139342763.jpg' }}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.overlay} />
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.header}>
					<Text style={styles.mainTitle}>Здесь начинается Россия</Text>
					<Text style={styles.subTitle}>Камчатка — земля огня и льда</Text>
					<TouchableOpacity style={styles.sosButton} onPress={() => navigation.navigate('Emergency' as never)}>
						<Text style={styles.sosText}>SOS</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.activitiesContainer}>
					<Text style={styles.sectionTitle}>Активности Камчатки</Text>
					<View style={styles.activitiesGrid}>
						{tiles.map((act) => (
							<TouchableOpacity
								key={act.id}
								style={styles.activityCard}
								onPress={() => navigation.navigate('Activities' as never, { tag: act.id, title: act.title } as never)}
							>
								<Text style={[styles.activityIcon, styles.whiteIcon]}>{act.icon}</Text>
								<Text style={styles.activityTitle}>{act.title}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: { flex: 1, width: '100%', height: '100%' },
	overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
	container: { flexGrow: 1, padding: 16, paddingBottom: 32 },
	header: { marginTop: height * 0.06, marginBottom: 20, alignItems: 'center' },
	mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
	subTitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 6 },
	sosButton: { position: 'absolute', right: 16, top: 0, backgroundColor: '#e53e3e', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
	sosText: { color: '#fff', fontWeight: 'bold' },
	activitiesContainer: { marginTop: 8 },
	sectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 12, textAlign: 'center' },
	activitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	activityCard: { width: '24%', alignItems: 'center', marginBottom: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
	activityIcon: { fontSize: 20, marginBottom: 4 },
	whiteIcon: { color: '#fff' },
	activityTitle: { fontSize: 10, fontWeight: '500', color: '#fff', textAlign: 'center' },
});