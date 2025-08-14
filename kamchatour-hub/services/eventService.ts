import events from '@assets/cultural_db/events.json' assert { type: 'json' };

export type Event = typeof events[number];

export function getEvents(): Event[] {
	return events as Event[];
}