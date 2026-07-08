// src/content/thresholds/crisis-low-constitution.ts
import type { GameEvent } from '../../engine/types';
import { THRESHOLDS } from '../../engine/constants';

export const crisisLowConstitution: GameEvent = {
  id: 'threshold_low_constitution',
  stage: 'career',
  ageRange: [25, 75],
  once: true,
  trigger: {
    baseWeight: 0,
    requires: [
      { attrLt: { 体质: THRESHOLDS.lowConstitution } },
      { notFlag: 'crisis_low_constitution_fired' },
    ],
  },
  text: '这一年，身体给你下了最后通牒——胸闷气短，体重飙升。它不再是从前那个任你挥霍的容器了。',
  choices: [
    {
      label: '住院体检',
      outcomes: [{
        weight: 100,
        condition: { attrGte: { 财富: 30 } },
        apply: (s) => {
          s.attrs.体质 += 20;
          s.attrs.财富 -= 20;
          s.flags.add('crisis_low_constitution_fired');
        },
        result: '医生警告你注意身体，你乖乖听话。',
      }],
    },
    {
      label: '开始健身',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.体质 += 10;
          s.attrs.快乐 += 5;
          s.flags.add('crisis_low_constitution_fired');
        },
        result: '你开始跑步，慢慢恢复。',
      }],
    },
    {
      label: '硬扛，没时间管这些',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.体质 -= 5; // 进一步恶化
          s.flags.add('crisis_low_constitution_fired');
        },
        result: '你继续硬撑。',
      }],
    },
  ],
};
