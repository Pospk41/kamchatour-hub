import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, ActivitiesScreen, BulletinScreen, ProfileScreen, EmergencyScreen, OfflineMapsScreen } from './src/screens';
import 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="dark" />
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Activities" component={ActivitiesScreen} />
				<Stack.Screen name="Bulletin" component={BulletinScreen} />
				<Stack.Screen name="Profile" component={ProfileScreen} />
				<Stack.Screen name="Emergency" component={EmergencyScreen} />
				<Stack.Screen name="OfflineMaps" component={OfflineMapsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
