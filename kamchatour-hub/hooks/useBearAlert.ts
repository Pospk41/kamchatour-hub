import { detectBearFromImage } from '@lib/bear-detector';

export function useBearAlert() {
	async function analyze(imageUri: string) {
		return detectBearFromImage(imageUri);
	}
	return { analyze };
}