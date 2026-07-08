// src/content/school/internet-dream.ts
import type { GameEvent } from '../../engine/types';

export const internetDream: GameEvent = {
  id: 'foreshadow_internet_dream',
  stage: 'school',
  ageRange: [13, 15],
  once: true,
  trigger: { baseWeight: 2 },
  text: '你第一次把一段自己拍的视频传到网上，紧张地盯着屏幕刷新。评论区慢慢多了起来。',
  choices: [
    {
      label: '要是能火就好了，继续拍',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.flags.add('foreshadow_internet_dream'); s.attrs.魅力 += 2; s.attrs.智力 += 1; },
        result: '虽然没几个人看，但你心里种下了一颗「被看见」的种子。',
      }],
    },
    {
      label: '太尴尬了，赶紧删掉',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 -= 2; },
        result: '你把视频删了，假装什么都没发生。',
      }],
    },
  ],
};
