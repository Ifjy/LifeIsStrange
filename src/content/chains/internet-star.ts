// src/content/chains/internet-star.ts
import type { GameEvent } from '../../engine/types';

export const internetViral: GameEvent = {
  id: 'career_internet_viral',
  stage: 'career',
  ageRange: [25, 35],
  once: true,
  trigger: {
    baseWeight: 7,
    requires: [{ flag: 'milestone_has_job' }],
  },
  text: '你随手拍的一段视频突然火了，一觉醒来粉丝涨了十万。手机消息震个不停，私信里全是商务合作。',
  choices: [
    {
      label: '全力运营账号，趁热打铁',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 10;
            s.attrs.快乐 += 5;
            s.skills.摸 += 3;
            s.flags.add('twist_internet_sidehustle');
          },
          result: '你成了小有名气的博主，每月多了一笔可观的副业收入。',
        },
        {
          weight: 25,
          condition: { attrLt: { 快乐: 40 } },
          apply: (s) => {
            s.attrs.快乐 -= 20;
            s.flags.add('twist_cyberbullied');
          },
          nextEvent: 'ending_cyberbully_victim',
          result: '黑粉扒出你多年前的言论，舆论瞬间反转。账号被封，你成了全网的笑话。',
        },
        {
          weight: 8,
          condition: { all: [
            { skillGte: { 摸: 50 } },
            { flag: 'foreshadow_internet_dream' },
          ]},
          apply: (s) => {
            s.attrs.财富 = 90;
            s.attrs.快乐 += 20;
            s.flags.add('twist_internet_star');
          },
          nextEvent: 'ending_internet_star',
          result: '你凭着少年时埋下的镜头感，稳稳接住了这波流量，成了正能量头部 UP 主。',
        },
      ],
    },
    {
      label: '低调处理，该上班上班',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 3; s.attrs.财富 += 2; },
        result: '热度慢慢散去，你回归了平静的打工人生活。偶尔翻看那条视频，嘴角还会上扬。',
      }],
    },
    {
      label: '（前世记忆）你预判了流量密码',
      hint: '需要 NG+ 前世记忆',
      visibleWhen: { flag: 'ng_plus_memory' },
      outcomes: [{
        weight: 100,
        condition: { flag: 'ng_plus_memory' },
        apply: (s) => {
          s.attrs.魅力 += 5;
          s.attrs.快乐 += 8;
          s.flags.add('choice_used_memory');
        },
        result: '你想起上辈子踩过的坑，这次巧妙避开了所有雷区，稳稳吃下这波红利。',
      }],
    },
  ],
};
