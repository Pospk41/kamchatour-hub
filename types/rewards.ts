export type BoostType =
  | 'time_multiplier'      // Временной множитель xN
  | 'category_multiplier'  // Для определённых тегов (volcano/fishing)
  | 'streak'               // Серии выполнений
  | 'first_action'         // Первый заказ/действие
  | 'referral'             // Реферальный буст
  | 'tier_multiplier'      // Уровни лояльности
  | 'payment_method'       // Оплата способом (карта/СПБ)
  | 'eco_choice'           // Эко-выбор
  | 'event'                // Сезон/ивент
  | 'bundle'               // Пакеты услуг
  ;

export interface Boost {
  id: string;
  name: string;
  description?: string;
  type: BoostType;
  multiplier?: number;               // напр. 1.2 = +20%
  bonusPoints?: number;              // фикс бонус
  activeFrom?: number;               // timestamp ms
  activeTo?: number;                 // timestamp ms
  categories?: string[];             // теги туров
  minAmount?: number;                // порог чека
  paymentMethods?: string[];         // ['sbp','card']
  partnerId?: string;                // источник партнёра
  conditions?: Record<string, any>;  // доп. условия
}

export interface EcoPointsBalance {
  userId: string;
  points: number;                    // текущие ЭКО баллы
  updatedAt: number;
}