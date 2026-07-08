// src/content/career/health-warning-hospital.ts
import type { GameEvent } from '../../engine/types';

export const healthWarningHospital: GameEvent = {
  id: 'career_health_warning_hospital',
  stage: 'career',
  ageRange: [30, 45],
  once: true,
  trigger: { baseWeight: 0 },
  text: '硬扛了三个月，你在开会时眼前一黑，直接被同事送进了医院。医生说再晚来一步就麻烦了。',
  choices: [
    {
      label: '老老实实住院休养',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.体质 += 15;
          s.attrs.财富 -= 10;
          s.flags.delete('choice_ignored_health_warning');
        },
        result: '你在病床上躺了两周，终于被迫放下了工作。出院时，你重新审视了什么才重要。',
      }],
    },
    {
      label: '住两天就溜回去上班',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.体质 -= 10; s.attrs.快乐 -= 5; },
        result: '你拖着没好的身体回了公司。同事看你的眼神，像在看一个不要命的人。',
      }],
    },
  ],
};
