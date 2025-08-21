import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';

type Props = {
	label: string;
	onPress?: (event: GestureResponderEvent) => void;
	style?: ViewStyle | ViewStyle[];
	textStyle?: TextStyle | TextStyle[];
};

export function Button({ label, onPress, style, textStyle }: Props) {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.root, style]}
			testID="ui-button">
			<Text style={[styles.label, textStyle]}>{label}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	root: {
		backgroundColor: '#0891b2',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 12,
		alignItems: 'center',
	},
	label: {
		color: '#ffffff',
		fontWeight: '600',
	},
});

