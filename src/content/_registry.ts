// src/content/_registry.ts
import type { GameEvent, Ending } from '../engine/types';
import { dreamGaokao } from './college/dream-gaokao';
import { overworkCritical } from './chains/overwork-death';
import { rebornAsGaokaoEnding } from './endings/reborn-as-gaokao';
import { underworldHrEnding } from './endings/underworld-hr';
import { secretReading } from './school/secret-reading';
import { slackerWriting } from './chains/slacker-author';
import { slackerAuthorEnding } from './endings/slacker-author';

export const ALL_EVENTS: GameEvent[] = [
  dreamGaokao,
  overworkCritical,
  secretReading,
  slackerWriting,
];

export const ALL_ENDINGS: Ending[] = [
  underworldHrEnding,    // priority 100
  rebornAsGaokaoEnding,  // priority 90
  slackerAuthorEnding,   // priority 90
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
