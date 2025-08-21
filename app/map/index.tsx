import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { Asset } from 'expo-asset';
import { useLocation } from '../../contexts/LocationContext';

type Layer = 'shelters' | 'events' | 'activities';

const initialRegion: Region = {
	latitude: 53.023,
	longitude: 158.65,
	latitudeDelta: 0.05,
	longitudeDelta: 0.05,
};

export default function MapIndex() {
	const { location } = useLocation();
	const [region, setRegion] = useState<Region>(initialRegion);
	const [enabledLayers, setEnabledLayers] = useState<Record<Layer, boolean>>({ shelters: true, events: true, activities: true });
	const [geo, setGeo] = useState<{ shelters: any; events: any; activities: any } | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const sMod = require('../../assets/geo/shelters.geojson');
				const eMod = require('../../assets/geo/events.geojson');
				const aMod = require('../../assets/geo/activities.geojson');
				const [sA, eA, aA] = [Asset.fromModule(sMod), Asset.fromModule(eMod), Asset.fromModule(aMod)];
				await Promise.all([sA.downloadAsync(), eA.downloadAsync(), aA.downloadAsync()]);
				const [shelters, events, activities] = await Promise.all([
					fetch(sA.uri).then(r => r.json()),
					fetch(eA.uri).then(r => r.json()),
					fetch(aA.uri).then(r => r.json()),
				]);
				setGeo({ shelters, events, activities });
			} catch (err) {
				setGeo(null);
			}
		})();
	}, []);

	useEffect(() => {
		if (location) {
			setRegion(prev => ({ ...prev, latitude: location.coordinates.latitude, longitude: location.coordinates.longitude }));
		}
	}, [location]);

	const toggleLayer = (key: Layer) => setEnabledLayers(prev => ({ ...prev, [key]: !prev[key] }));

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.mapWrap}>
				<MapView style={StyleSheet.absoluteFill} region={region} onRegionChangeComplete={setRegion}>
					{geo && enabledLayers.shelters && geo.shelters.features.map((f: any) => (
						<Marker key={`sh-${f.properties.name}`} coordinate={{ latitude: f.geometry.coordinates[1], longitude: f.geometry.coordinates[0] }} title={f.properties.name} />
					))}
					{geo && enabledLayers.events && geo.events.features.map((f: any) => (
						<Marker key={`ev-${f.properties.title}`} pinColor="#2563eb" coordinate={{ latitude: f.geometry.coordinates[1], longitude: f.geometry.coordinates[0] }} title={f.properties.title} />
					))}
					{geo && enabledLayers.activities && geo.activities.features.map((f: any) => (
						<Marker key={`ac-${f.properties.title}`} pinColor="#16a34a" coordinate={{ latitude: f.geometry.coordinates[1], longitude: f.geometry.coordinates[0] }} title={f.properties.title} />
					))}
				</MapView>
				<View style={styles.controls}>
					<TouchableOpacity style={[styles.chip, enabledLayers.shelters ? styles.chipOn : undefined]} onPress={() => toggleLayer('shelters')}>
						<Text style={styles.chipText}>Убежища</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.chip, enabledLayers.events ? styles.chipOn : undefined]} onPress={() => toggleLayer('events')}>
						<Text style={styles.chipText}>События</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.chip, enabledLayers.activities ? styles.chipOn : undefined]} onPress={() => toggleLayer('activities')}>
						<Text style={styles.chipText}>Активности</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.centerBtn} onPress={() => setRegion(r => ({ ...r, latitude: initialRegion.latitude, longitude: initialRegion.longitude }))}>
					<Text style={{ color: '#fff', fontWeight: '700' }}>Центр</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f8fafc' },
	mapWrap: { flex: 1 },
	controls: { position: 'absolute', top: 16, left: 16, flexDirection: 'row', gap: 8 },
	chip: { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
	chipOn: { backgroundColor: '#0891b2' },
	chipText: { color: '#111827' },
	centerBtn: { position: 'absolute', right: 16, bottom: 24, backgroundColor: '#0891b2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16 },
});

