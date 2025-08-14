import React from 'react';
import { Pressable, Text } from 'react-native';
import { sendSos } from '@lib/emergency';
import { getCurrentLocation } from '@lib/location';

export default function SOSButton() {
	async function onPress() {
		const coordinates = await getCurrentLocation();
		await sendSos({ coordinates });
	}
	return (
		<Pressable onPress={onPress}>
			<Text>SOS</Text>
		</Pressable>
	);
}