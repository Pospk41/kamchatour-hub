import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmergencyScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Убежища и безопасность</Text>
			<Text style={styles.text}>Раздел в разработке.</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 8,
	},
	text: {
		fontSize: 14,
		color: '#64748b',
	},
});

