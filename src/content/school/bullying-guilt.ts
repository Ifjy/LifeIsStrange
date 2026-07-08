// src/content/school/bullying-guilt.ts
import type { GameEvent } from '../../engine/types';

export const bullyingGuilt: GameEvent = {
  id: 'school_bullying_guilt',
  stage: 'school',
  ageRange: [9, 14],
  once: true,
  trigger: { baseWeight: 0 },
  text: '那天被欺负的同学转学了。你没说什么，但这件事像根刺，扎在心里好多年。',
  choices: [
    {
      label: '写一封迟到的道歉信',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 += 5;
          s.attrs.魅力 += 3;
          s.flags.delete('choice_stayed_silent');
        },
        result: '你把信寄出去那天，胸口那根刺终于软了。',
      }],
    },
    {
      label: '假装忘了这件事',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 -= 3; s.attrs.智力 += 2; },
        result: '你以为自己忘了。但很多年后，类似的场景仍会让你愣住。',
      }],
    },
  ],
};
