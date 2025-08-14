import React from 'react';
import { TextInput } from 'react-native';

type InputProps = { value?: string; placeholder?: string; onChangeText?: (t: string) => void };

export default function Input({ value, placeholder, onChangeText }: InputProps) {
	return <TextInput value={value} placeholder={placeholder} onChangeText={onChangeText} />;
}