import masters from '@assets/cultural_db/masters.json' assert { type: 'json' };

export type Master = typeof masters[number];

export function getMasters(): Master[] {
	return masters as Master[];
}