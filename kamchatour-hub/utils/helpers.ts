export function formatPrice(rub: number): string {
	return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(rub);
}