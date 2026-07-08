// src/content/chains/emigration-abroad.ts
import type { GameEvent } from '../../engine/types';

export const emigrationAbroad: GameEvent = {
  id: 'career_emigration_offer',
  stage: 'career',
  ageRange: [28, 38],
  once: true,
  trigger: {
    baseWeight: 6,
    requires: [{ flag: 'milestone_has_job' }],
  },
  text: '公司有个海外分部的外派机会，三年合同，薪水翻倍。或者你也可以申请技术移民，签证刚好下来了。',
  choices: [
    {
      label: '接受外派，闯一闯',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 15;
            s.attrs.快乐 += 3;
            s.skills.硬 += 5;
            s.flags.add('twist_expat_success');
          },
          result: '你在海外站稳了脚跟，升了职，每年回国探亲两次。',
        },
        {
          weight: 25,
          condition: { attrLt: { 快乐: 35 } },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.flags.add('twist_homesick');
          },
          nextEvent: 'ending_homesick_returnee',
          result: '异国他乡的孤独把你击垮了。语言、饮食、黑夜里的时差，每一样都在啃噬你。',
        },
        {
          weight: 8,
          condition: { all: [
            { attrGte: { 智力: 60 } },
            { flag: 'foreshadow_emigration_dream' },
          ]},
          apply: (s) => {
            s.attrs.财富 = 85;
            s.attrs.快乐 += 15;
            s.flags.add('twist_global_exec');
          },
          nextEvent: 'ending_global_executive',
          result: '当年在笔记本扉页写下的梦想，如今成了你的履历。你成了横跨三大洲的业务负责人。',
        },
      ],
    },
    {
      label: '婉拒，家人朋友都在国内',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 5; s.attrs.财富 += 3; },
        result: '你留在了熟悉的一切里。周末能陪父母吃饭，也是一种确定的幸福。',
      }],
    },
  ],
};
