import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen, ActivitiesScreen, BulletinScreen, ProfileScreen, EmergencyScreen, OfflineMapsScreen, AuthScreen, OperatorScreen, TourFormScreen, BookTourScreen } from './src/screens';
import { SessionProvider, useSession } from './src/context/SessionContext';
import { seedIfEmpty } from './src/services/seed';

const Stack = createNativeStackNavigator();

function RootNavigator() {
	useEffect(() => { seedIfEmpty(); }, []);
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Auth" component={AuthScreen} />
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Activities" component={ActivitiesScreen} />
			<Stack.Screen name="Bulletin" component={BulletinScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="Emergency" component={EmergencyScreen} />
			<Stack.Screen name="OfflineMaps" component={OfflineMapsScreen} />
			<Stack.Screen name="Operator" component={OperatorScreen} />
			<Stack.Screen name="TourForm" component={TourFormScreen} />
			<Stack.Screen name="BookTour" component={BookTourScreen} />
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<SessionProvider>
			<NavigationContainer>
				<StatusBar style="dark" />
				<RootNavigator />
			</NavigationContainer>
		</SessionProvider>
	);
}
