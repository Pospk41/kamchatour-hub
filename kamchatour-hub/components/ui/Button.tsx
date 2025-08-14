import React from 'react';
import { Pressable, Text } from 'react-native';

type ButtonProps = { title: string; onPress?: () => void };

export default function Button({ title, onPress }: ButtonProps) {
	return (
		<Pressable onPress={onPress}>
			<Text>{title}</Text>
		</Pressable>
	);
}