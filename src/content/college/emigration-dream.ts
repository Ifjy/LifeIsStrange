// src/content/college/emigration-dream.ts
import type { GameEvent } from '../../engine/types';

export const emigrationDream: GameEvent = {
  id: 'foreshadow_emigration_dream',
  stage: 'college',
  ageRange: [19, 22],
  once: true,
  trigger: { baseWeight: 4 },
  text: '学校举办了一场海外交换生宣讲会，PPT 上全是异国街景和实验室。你坐在后排，心里痒痒的。',
  choices: [
    {
      label: '记下这个梦想，开始背单词',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.flags.add('foreshadow_emigration_dream'); s.attrs.智力 += 3; },
        result: '你在笔记本扉页写下：总有一天，我要走出去看看。',
      }],
    },
    {
      label: '太远了，不切实际',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 2; },
        result: '你摇摇头走出教室，觉得眼前的生活也挺好。',
      }],
    },
  ],
};
