import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergencyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Убежища и экстренная информация</Text>
        <Text style={styles.text}>Раздел в разработке.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  text: { color: '#64748b' },
});