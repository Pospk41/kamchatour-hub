export async function detectBearFromImage(_imageUri: string): Promise<{ detected: boolean; confidence: number }>{
	return { detected: false, confidence: 0 };
}