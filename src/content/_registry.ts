// src/content/_registry.ts
import type { GameEvent, Ending } from '../engine/types';
import { dreamGaokao } from './college/dream-gaokao';
import { overworkCritical } from './chains/overwork-death';
import { rebornAsGaokaoEnding } from './endings/reborn-as-gaokao';
import { underworldHrEnding } from './endings/underworld-hr';
import { secretReading } from './school/secret-reading';
import { slackerWriting } from './chains/slacker-author';
import { slackerAuthorEnding } from './endings/slacker-author';
import { childhoodEvents } from './childhood/_index';
import { schoolEvents } from './school/_index';
import { collegeEvents } from './college/_index';
import { careerEvents } from './career/_index';
import { retirementEvents } from './retirement/_index';

export const ALL_EVENTS: GameEvent[] = [
  // 铺垫
  dreamGaokao,
  secretReading,
  // 招牌链
  overworkCritical,
  slackerWriting,
  // 流程保底
  ...childhoodEvents,
  ...schoolEvents,
  ...collegeEvents,
  ...careerEvents,
  ...retirementEvents,
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
