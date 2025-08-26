import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSession } from '@/context/SessionContext';
import { Role } from '@/types';

const ROLES: { id: Role; label: string }[] = [
	{ id: 'tourist', label: 'Турист' },
	{ id: 'operator', label: 'Оператор' },
	{ id: 'guide', label: 'Гид' },
	{ id: 'transfer', label: 'Трансфер' },
];

export default function AuthScreen({ navigation }: any) {
	const { signIn } = useSession();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [role, setRole] = useState<Role>('tourist');

	const onSubmit = async () => {
		if (!name.trim() || !email.trim()) return;
		await signIn({ name, email, phone, role });
		navigation.replace('Home');
	};

	return (
		<View style={styles.root}>
			<Text style={styles.title}>Вход</Text>
			<TextInput placeholder="Имя" value={name} onChangeText={setName} style={styles.input} />
			<TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
			<TextInput placeholder="Телефон" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
			<View style={styles.roles}>
				{ROLES.map((r) => (
					<TouchableOpacity key={r.id} onPress={() => setRole(r.id)} style={[styles.roleBtn, role === r.id && styles.roleActive]}>
						<Text style={styles.roleText}>{r.label}</Text>
					</TouchableOpacity>
				))}
			</View>
			<TouchableOpacity style={styles.submit} onPress={onSubmit}>
				<Text style={styles.submitText}>Продолжить</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, paddingTop: 80, paddingHorizontal: 16, backgroundColor: '#0f172a' },
	title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
	input: { height: 46, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12, backgroundColor: '#fff' },
	roles: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
	roleBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, marginRight: 8, marginBottom: 8 },
	roleActive: { backgroundColor: '#eab308' },
	roleText: { color: '#fff' },
	submit: { height: 48, borderRadius: 10, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
	submitText: { color: '#fff', fontWeight: '800' },
});