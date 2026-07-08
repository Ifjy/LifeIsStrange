// src/content/career/office-politics-backlash.ts
import type { GameEvent } from '../../engine/types';

export const officePoliticsBacklash: GameEvent = {
  id: 'career_office_politics_backlash',
  stage: 'career',
  ageRange: [28, 40],
  once: true,
  trigger: { baseWeight: 0 },
  text: '你押错了宝。新领导上任第一周，你就被调到了边缘部门，工位也从窗边挪到了厕所旁边。',
  choices: [
    {
      label: '忍气吞声，等机会翻身',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 -= 10;
          s.skills.软 += 5;
          s.flags.delete('choice_picked_wrong_side');
        },
        result: '你在边缘部门蛰伏了一年，学会了什么叫"职场如戏"。',
      }],
    },
    {
      label: '此处不留爷，自己辞职',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 += 5;
          s.attrs.财富 -= 8;
          s.flags.delete('choice_picked_wrong_side');
        },
        result: '你拎着纸箱走出公司那天，天特别蓝。',
      }],
    },
  ],
};
