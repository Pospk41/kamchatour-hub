export const AD_CATEGORIES = [
	{ id: 'all', name: 'Все' },
	{ id: 'tours', name: 'Туры' },
	{ id: 'accommodation', name: 'Жилье' },
	{ id: 'transport', name: 'Транспорт' },
	{ id: 'equipment', name: 'Снаряжение' },
	{ id: 'partners', name: 'Попутчики' },
];

export const ALL_ACTIVITIES = [
	{
		id: '1',
		title: 'Восхождение на Авачинский вулкан',
		tag: 'volcano',
		location: '15 км от Петропавловска-Камчатского',
		price: 15000,
		rating: 4.8,
		reviews: 128,
		duration: '8 часов',
		difficulty: 'Средняя',
		included: ['️ Питание', '🚌 Трансфер', '🧗 Снаряжение', '📸 Фотосессия'],
		description:
			'Покорите один из самых доступных вулканов Камчатки с потрясающим видом на Тихий океан...',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Avachinsky_volcano.jpg/800px-Avachinsky_volcano.jpg',
		cancellation: 'Бесплатная отмена за 48 часов',
		spotsLeft: 3,
		isFavorite: false,
	},
	{
		id: '2',
		title: 'Экспедиция к Ключевской сопке',
		tag: 'volcano',
		location: '100 км от г. Ключи',
		price: 32500,
		rating: 4.9,
		reviews: 94,
		duration: '2 дня',
		difficulty: 'Сложная',
		included: ['️ Проживание', '🍽️ Питание', '🚁 Вертолет', '🧗 Снаряжение'],
		description: 'Самая высокая точка Камчатки (4750 м) для опытных альпинистов...',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Klyuchevskaya_Sopka_eruption.jpg/800px-Klyuchevskaya_Sopka_eruption.jpg',
		cancellation: 'Бесплатная отмена за 72 часа',
		spotsLeft: 5,
		isFavorite: true,
	},
	{
		id: '3',
		title: 'Паратунские термальные источники',
		tag: 'thermals',
		location: 'Паратунка',
		price: 3500,
		rating: 4.7,
		reviews: 215,
		duration: '4 часа',
		difficulty: 'Легкая',
		included: ['️ Трансфер', '🛁 Посещение бассейнов', '🍵 Травяной чай'],
		description:
			'Расслабляющий отдых в природных термальных бассейнах с целебной водой...',
		image:
			'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ba/e3/7d/view-from-the-hotel.jpg?w=1200&h=-1&s=1',
		cancellation: 'Бесплатная отмена за 24 часа',
		spotsLeft: 15,
		isFavorite: false,
	},
];

export const MOCK_ADS = [
	{
		id: '1',
		title: 'Набор группы на восхождение на Авачу 25.07',
		description:
			'Набираем группу на восхождение на Авачинский вулкан 25 июля. Опыт не обязателен. Стоимость 15000 руб.',
		category: 'tours',
		date: '2023-07-20',
		source: 'Камчатка Туризм',
		url: 'https://t.me/kamchatka_tourism/123',
		isFavorite: false,
		price: '15000 руб',
		contact: '@kamchatka_tourism',
	},
];