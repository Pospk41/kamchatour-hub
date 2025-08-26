import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
	const navigation = useNavigation();
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.header}><Text style={styles.title}>Личный кабинет</Text></View>
			<View style={styles.card}>
				<Text style={styles.label}>Имя</Text>
				<Text style={styles.value}>Иван Петров</Text>
				<Text style={styles.label}>Email</Text>
				<Text style={styles.value}>ivan@example.com</Text>
				<Text style={styles.label}>Телефон</Text>
				<Text style={styles.value}>+7 (912) 345-67-89</Text>
			</View>
			<View style={styles.row}>
				<TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('OfflineMaps' as never)}>
					<Text style={styles.btnText}>Офлайн‑карты</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Emergency' as never)}>
					<Text style={styles.btnText}>Экстренные контакты</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { paddingTop: 48, paddingBottom: 32, paddingHorizontal: 16 },
	header: { alignItems: 'center', marginBottom: 16 },
	title: { fontSize: 20, fontWeight: '700' },
	card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
	label: { color: '#6b7280', marginTop: 8 },
	value: { color: '#111827', fontWeight: '600' },
	row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
	btn: { flex: 1, backgroundColor: '#2563eb', height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
	btnText: { color: '#fff', fontWeight: '700' },
});