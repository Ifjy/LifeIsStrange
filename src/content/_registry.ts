// src/content/_registry.ts
import type { GameEvent, Ending } from '../engine/types';

// 占位：后续 Task 12-15 会把真实 events/endings 加进来
export const ALL_EVENTS: GameEvent[] = [];
export const ALL_ENDINGS: Ending[] = [
  {
    id: 'default_ordinary',
    priority: 0,
    condition: () => true,
    title: '平凡打工人',
    desc: () => '你过着平凡的一生，没什么大起大落。',
    rating: () => 'C',
  },
];

export const findEvent = (id: string): GameEvent | undefined =>
  ALL_EVENTS.find((e) => e.id === id);
export const findEnding = (id: string): Ending | undefined =>
  ALL_ENDINGS.find((e) => e.id === id);
