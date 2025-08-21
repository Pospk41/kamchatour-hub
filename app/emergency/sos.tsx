import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '../../contexts/LocationContext';
import { useEmergency } from '../../contexts/EmergencyContext';

export default function EmergencySOS() {
	const { location, getCurrentLocation, isLoading: locLoading } = useLocation();
	const { sendSOS } = useEmergency();
	const [sending, setSending] = useState(false);

	const onSendSOS = async () => {
		try {
			setSending(true);
			const loc = location ?? (await getCurrentLocation());
			if (!loc) {
				Alert.alert('Ошибка', 'Не удалось определить местоположение');
				return;
			}
			await sendSOS(loc.coordinates, 'SOS — срочная помощь', 'other');
			Alert.alert('Отправлено', 'Сигнал SOS отправлен');
		} catch (e) {
			Alert.alert('Ошибка', 'Не удалось отправить SOS');
		} finally {
			setSending(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Экстренная помощь</Text>
			<Text style={styles.subtitle}>Ваша текущая точка будет отправлена спасателям</Text>
			<View style={{ height: 24 }} />
			<TouchableOpacity style={styles.sosButton} onPress={onSendSOS} disabled={sending || locLoading}>
				{sending || locLoading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text style={styles.sosText}>SOS</Text>
				)}
			</TouchableOpacity>
			{location && (
				<Text style={styles.coords}>
					{location.coordinates.latitude.toFixed(5)}, {location.coordinates.longitude.toFixed(5)}
				</Text>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 22, fontWeight: '700', color: '#b91c1c' },
	subtitle: { marginTop: 8, color: '#64748b', textAlign: 'center' },
	sosButton: { backgroundColor: '#ef4444', width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
	sosText: { color: '#fff', fontSize: 48, fontWeight: '900' },
	coords: { marginTop: 16, color: '#334155' },
});

