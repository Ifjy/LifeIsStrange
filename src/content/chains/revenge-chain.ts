// src/content/chains/revenge-chain.ts
import type { GameEvent } from '../../engine/types';

// 铺垫事件：被信任的人深度背叛（造谣/夺爱/顶包）
// stage=school，ageRange 16-24
const foreshadowRevengeBetrayal: GameEvent = {
  id: 'foreshadow_revenge_betrayal',
  stage: 'school',
  ageRange: [16, 24],
  once: true,
  trigger: {
    baseWeight: 2,
  },
  text: '那个你最信任的人——一起熬过夜、交过心、替你挡过刀的人——在关键时候捅了你一刀。造谣、夺爱、或者把锅扣在你头上。你看着 ta 笑容灿烂地走上领奖台，而你站在台下，手指捏白了。',
  choices: [
    {
      label: '把这件事记进骨头里',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.flags.add('foreshadow_revenge_betrayal');
          s.attrs.快乐 -= 5;
        },
        result: '你没哭，没闹，甚至没质问。你只是把那张脸、那个笑容、那一刻的窒息感，一并刻进了骨头里。以后会用到的。',
      }],
    },
    {
      label: '哭一场，然后忘掉',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 2; },
        result: '你在被窝里哭了一夜，第二天红着眼睛去上课。伤口还在，但你决定不让它长成毒瘤。',
      }],
    },
  ],
};

// 入口事件：决定——算了 vs 这笔账要算
// stage=college，ageRange 20-28
// 三层 outcome（常规/反转/罕见反转）
const revengeDecision: GameEvent = {
  id: 'revenge_decision',
  stage: 'college',
  ageRange: [20, 28],
  once: true,
  trigger: {
    baseWeight: 4,
  },
  text: '多年以后，你又见到了那个名字。ta 过得很好，比你想象中好——升职、恋爱、笑容满面，像什么都没发生过。而你这些年吃的苦，ta 一个字都不知道。脑海里有个声音问：这笔账，算还是不算？',
  choices: [
    {
      label: '这笔账，我记下了',
      outcomes: [
        // 常规层：把仇恨刻进骨头
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 3;
            s.attrs.快乐 -= 5;
            s.flags.add('milestone_revenge');
          },
          result: '你把那张脸刻进了骨头里。从今天起，你做的每一件事，都是为了那一天。',
        },
        // 反转层：仇恨成为活下去的唯一理由——执念生根
        {
          weight: 20,
          condition: { attrLt: { 快乐: 30 } },
          apply: (s) => {
            s.attrs.快乐 -= 10;
            s.attrs.体质 -= 3;
            s.flags.add('milestone_revenge');
            s.flags.add('foreshadow_revenge_obsession');
          },
          result: '仇恨成了你活下去的唯一理由。你开始失眠，凌晨三点盯着天花板，把每一个细节反复咀嚼——那句话、那个眼神、那一刻。',
        },
        // 罕见反转层：冷静布局——不是愤怒，是棋局
        {
          weight: 5,
          condition: { all: [
            { attrGte: { 智力: 65 } },
            { flag: 'foreshadow_revenge_betrayal' },
          ]},
          apply: (s) => {
            s.attrs.智力 += 8;
            s.flags.add('milestone_revenge');
            s.flags.add('twist_revenge_strategic');
          },
          result: '你没有愤怒。你像下棋一样，开始布局。每一步都不急、不慌，因为你知道——真正的复仇，是让对方看着自己一点一点崩塌。',
        },
      ],
    },
    {
      label: '算了，过去就过去了',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 5; },
        result: '你深吸一口气，关掉了那个页面。过去的就让它过去吧——你还有更长的人生要走，不值得为一个人搭进去。',
      }],
    },
  ],
};

// 分支1：隐忍布局——收集证据/接近对方
// stage=career，ageRange 25-35，requires milestone_revenge
const revengePlanning: GameEvent = {
  id: 'revenge_planning',
  stage: 'career',
  ageRange: [25, 35],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_revenge' }],
  },
  text: '你花了几年时间，慢慢靠近了 ta 的世界。ta 现在是某公司的中层，有个幸福的家，朋友圈晒着旅行和美食。而你，以一个"老同学"的身份，重新出现在 ta 的生活里。ta 甚至不记得当年做过什么。',
  choices: [
    {
      label: '接近 ta，收集证据',
      outcomes: [
        // 常规层
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.快乐 -= 5;
            s.flags.add('choice_revenge_infiltrate');
          },
          result: '你以朋友身份融入 ta 的圈子。ta 对你毫无防备，甚至把你当成了"老铁"。每一次 ta 笑着拍你肩膀，你都在心里默默记下：又近了一步。',
        },
        // 反转层：对方毫无戒心，反而让你动摇
        {
          weight: 20,
          condition: { attrLt: { 快乐: 30 } },
          apply: (s) => {
            s.attrs.智力 += 3;
            s.attrs.快乐 -= 8;
            s.flags.add('choice_revenge_infiltrate');
            s.flags.add('foreshadow_revenge_obsession');
          },
          result: 'ta 对你太好了——好到让你怀疑当年的事是不是自己记错了。不，你没记错。你只是把那份动摇，又压了下去。',
        },
      ],
    },
    {
      label: '远远观察，找 ta 的弱点',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 4;
            s.attrs.快乐 -= 3;
          },
          result: '你没露面，只是在暗处观察。ta 的破绽慢慢浮出来——一笔说不清的账、一段不该有的关系、一个被压下去的投诉。你把它们一一记下。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 55 } },
          apply: (s) => {
            s.attrs.智力 += 6;
            s.flags.add('twist_revenge_evidence');
          },
          result: '你不光找到了弱点，还找到了关键证人。一个曾被 ta 用同样方式伤害过的人，愿意作证。你们的伤口，成了彼此的武器。',
        },
      ],
    },
  ],
};

// 分支2：动手——揭发/设局/正面交锋
// stage=career，ageRange 30-45，requires milestone_revenge
const revengeExecute: GameEvent = {
  id: 'revenge_execute',
  stage: 'career',
  ageRange: [30, 45],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_revenge' }],
  },
  text: '时机到了。你手里的牌已经攒够了——证据、人脉、舆论。只要把这张牌打出去，ta 多年建立的一切都会崩塌。但你也清楚，一旦动手，就真的回不了头了。',
  choices: [
    {
      label: '一击致命，把证据全抖出去',
      outcomes: [
        // 常规层
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 5;
            s.attrs.魅力 -= 3;
            s.flags.add('twist_revenge_done');
          },
          result: '你把所有证据一次性公开。ta 的世界在 48 小时内崩塌——被开除、被网暴、被另一半拉黑。你刷着热搜，心头一阵轻松，又一阵空。',
        },
        // 反转层：对方反扑
        {
          weight: 20,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.attrs.体质 -= 10;
            s.flags.add('twist_revenge_done');
            s.flags.add('foreshadow_revenge_backlash');
          },
          result: 'ta 没有坐以待毙，反咬你一口——诽谤、侵犯隐私、甚至动用了关系。你的身体先扛不住了，在舆论战最激烈的时候住进了医院。',
        },
      ],
    },
    {
      label: '设局，让 ta 自己走进陷阱',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.快乐 += 3;
            s.flags.add('twist_revenge_done');
          },
          result: '你没正面出手。你设计了一个局，让 ta 在贪心里自己栽了进去。当 ta 反应过来的时候，已经身败名裂——而你的手，看起来是干净的。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 60 } },
          apply: (s) => {
            s.attrs.智力 += 8;
            s.attrs.快乐 += 8;
            s.flags.add('twist_revenge_done');
            s.flags.add('twist_revenge_strategic');
          },
          result: '局做得太漂亮了——漂亮到 ta 至死都不知道是你做的。ta 只以为是自己运气不好、走错了一步。你站在远处看着这一切，第一次觉得：够了。',
        },
      ],
    },
    {
      label: '正面交锋，当面对质',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.魅力 += 5;
          s.attrs.快乐 += 3;
          s.flags.add('twist_revenge_done');
          s.flags.add('choice_revenge_confront');
        },
        result: '你约 ta 见面，把所有事情摊在桌面上。ta 的脸一阵红一阵白，最后沉默了很久，说了一句"对不起"。你盯着 ta 的眼睛，想从里面找到一丝真诚——但没有。',
      }],
    },
  ],
};

// 分支3：得手之后——空虚/被反噬/放下
// stage=career，ageRange 40-60，requires milestone_revenge
// 3-way choice，"放下" 设置 twist_revenge_forgive（pre-flight gap 修复）
const revengeAftermath: GameEvent = {
  id: 'revenge_aftermath',
  stage: 'career',
  ageRange: [40, 60],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_revenge' }],
  },
  text: '大仇得报。或者说，该做的都做了。你本以为会有如释重负的感觉，但真正到了这一天，你只是觉得空。那种空，比仇恨本身更让人害怕。',
  choices: [
    {
      label: '空虚——然后呢？',
      outcomes: [
        // 常规层
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.attrs.体质 -= 5;
          },
          result: '仇恨撑了你这么多年，一下子抽走，整个人像被掏空了。你坐在窗边发呆，不知道明天该为什么起床。原来恨一个人，也是一种支撑。',
        },
        // 反转层：彻底垮掉
        {
          weight: 25,
          condition: { attrLt: { 快乐: 25 } },
          apply: (s) => {
            s.attrs.快乐 -= 20;
            s.attrs.体质 -= 10;
          },
          result: '你彻底垮了。支撑你活下去的那根线断了，剩下的日子只是惯性。你开始酗酒，不接电话，不见人。复仇没有让你完整，反而让你碎得更彻底。',
        },
      ],
    },
    {
      label: '被反噬——因果轮回',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.体质 -= 15;
            s.attrs.快乐 -= 10;
            s.flags.add('foreshadow_revenge_backlash');
          },
          result: '你做的事，开始反噬你自己。朋友疏远你——"你对 ta 都能下这种手，哪天对我呢？"家人看你的眼神变了。你赢了，但赢得孤家寡人。',
        },
        {
          weight: 25,
          condition: { attrLt: { 体质: 25 } },
          apply: (s) => {
            s.attrs.体质 -= 20;
            s.attrs.快乐 -= 15;
          },
          result: '反噬来得比想象中更狠。你在深夜接到陌生电话，在门口发现匿名信件，在体检报告上看到新的箭头。你开始怀疑：到底是你报了仇，还是仇报了你？',
        },
      ],
    },
    {
      label: '放下——也是放过自己',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 += 15;
          s.attrs.体质 += 5;
          s.flags.add('twist_revenge_forgive');
        },
        result: '你站在镜子前，看了很久。镜子里的人，已经不再是当年那个咬牙切齿的少年/少女了。你深吸一口气，把那个名字从心里轻轻放下——不是为了原谅 ta，是为了放过你自己。',
      }],
    },
  ],
};

export const revengeChainEvents: GameEvent[] = [
  foreshadowRevengeBetrayal,
  revengeDecision,
  revengePlanning,
  revengeExecute,
  revengeAftermath,
];
