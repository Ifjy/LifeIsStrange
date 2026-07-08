// src/content/school/_index.ts
import type { GameEvent } from '../../engine/types';

export const schoolEvents: GameEvent[] = [
  // 1. 初恋 — 10-13 岁
  {
    id: 'school_first_crush',
    stage: 'school', ageRange: [10, 13], once: true,
    trigger: { baseWeight: 5 },
    text: '你对班上那个总回头冲你笑的同学，忽然有点心跳加速。',
    choices: [
      {
        label: '递一张小纸条',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 魅力: 30 } },
            apply: (s) => { s.attrs.魅力 += 5; s.attrs.快乐 += 8; s.flags.add('choice_first_crush'); },
            result: '对方红着脸收下了。这段暗恋成了甜甜的秘密。',
          },
          {
            weight: 100,
            condition: { attrLt: { 魅力: 30 } },
            apply: (s) => { s.attrs.快乐 -= 3; },
            result: '你鼓起勇气递了纸条，对方尴尬地笑了笑，没有回应。',
          },
        ],
      },
      {
        label: '默默藏在心里',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; s.attrs.魅力 += 2; },
          result: '你把这份心动写进了日记。多年后翻看，还是有点甜。',
        }],
      },
    ],
  },

  // 2. 考试压力 — 15-17 岁
  {
    id: 'school_exam_pressure',
    stage: 'school', ageRange: [15, 17], once: true,
    trigger: { baseWeight: 6 },
    text: '月考排名出来了，你的名字又往下掉了几个位置。班主任叹着气找你谈话。',
    choices: [
      {
        label: '咬牙拼命刷题',
        outcomes: [
          {
            weight: 60,
            condition: { attrGte: { 智力: 50 } },
            apply: (s) => { s.attrs.智力 += 8; s.attrs.体质 -= 5; s.attrs.快乐 -= 5; },
            result: '你的成绩明显进步，但黑眼圈也深了一圈。',
          },
          {
            weight: 40,
            condition: { attrLt: { 智力: 50 } },
            apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 -= 8; s.attrs.体质 -= 3; },
            result: '你拼了命，成绩却原地踏步。你开始怀疑自己。',
          },
        ],
      },
      {
        label: '佛系对待，劳逸结合',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 2; s.attrs.快乐 += 5; s.attrs.体质 += 2; },
          result: '你按自己的节奏走，心态出奇地好。',
        }],
      },
    ],
  },

  // 3. 运动选拔 — 12-14 岁
  {
    id: 'school_sports_tryout',
    stage: 'school', ageRange: [12, 14], once: true,
    trigger: { baseWeight: 4 },
    text: '校队教练在招新人，他吹了声哨子：「想试试的，跑一个 800 米！」',
    choices: [
      {
        label: '咬牙冲一个',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 体质: 40 } },
            apply: (s) => { s.attrs.体质 += 8; s.attrs.魅力 += 3; s.flags.add('achievement_school_team'); },
            result: '你被选进校队，晒黑了但结实了不少。',
          },
          {
            weight: 50,
            condition: { attrLt: { 体质: 40 } },
            apply: (s) => { s.attrs.体质 += 3; s.attrs.快乐 -= 2; },
            result: '你跑得气喘吁吁，教练婉拒了你。但至少锻炼了一次。',
          },
        ],
      },
      {
        label: '在旁边鼓掌就好',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; },
          result: '你做了个快乐的拉拉队。运动这事儿，不适合每个人。',
        }],
      },
    ],
  },

  // 4. 叛逆期 — 14-16 岁
  {
    id: 'school_rebellion',
    stage: 'school', ageRange: [14, 16], once: true,
    trigger: { baseWeight: 5 },
    text: '你把头发染了一撮红色，回家被老妈一顿咆哮。她指着你的脑袋问「这是要干嘛？」',
    choices: [
      {
        label: '据理力争：这是我的自由',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.魅力 += 5; s.attrs.快乐 += 3; s.attrs.智力 -= 2; s.flags.add('choice_rebel_hard'); },
          result: '你妈气得三天没跟你说话。但你觉得特别酷。',
        }],
      },
      {
        label: '乖乖去洗掉',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.智力 += 2; s.flags.add('choice_rebel_soft'); },
          result: '你把头发剃成了平头，看起来格外听话。',
        }],
      },
    ],
  },

  // 5. 高考 — 18 岁 (transcribed from brief)
  {
    id: 'school_gaokao',
    stage: 'school', ageRange: [18, 18], once: true,
    trigger: { baseWeight: 10 },
    text: '高考来了。你走出考场，心情复杂。',
    choices: [{ label: '继续', outcomes: [
      {
        weight: 30,
        condition: { attrGte: { 智力: 70 } },
        apply: (s) => { s.flags.add('milestone_top_university'); s.attrs.快乐 += 10; },
        result: '你考上了顶尖大学。',
      },
      {
        weight: 50,
        condition: { all: [{ attrLt: { 智力: 70 } }, { attrGte: { 智力: 50 } }] },
        apply: (s) => { s.flags.add('milestone_average_university'); },
        result: '你考上了一所普通大学。',
      },
      {
        weight: 20,
        condition: { attrLt: { 智力: 50 } },
        apply: (s) => { s.attrs.快乐 -= 10; s.flags.add('milestone_failed_gaokao'); },
        result: '高考失利，你上了大专。',
      },
    ]}],
  },

  // 6. 竞选班长 — 10-12 岁
  {
    id: 'school_class_monitor',
    stage: 'school', ageRange: [10, 12], once: true,
    trigger: { baseWeight: 4 },
    text: '新学期第一次班会，班主任扫了一眼全班：「有谁愿意当班长，试试看？」',
    choices: [
      {
        label: '举手！我想试试',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 魅力: 35 } },
            apply: (s) => { s.attrs.魅力 += 5; s.attrs.智力 += 3; s.attrs.快乐 += 4; s.flags.add('choice_class_monitor'); },
            result: '同学们投票选了你。你第一次尝到"被信任"是什么滋味。',
          },
          {
            weight: 50,
            condition: { attrLt: { 魅力: 35 } },
            apply: (s) => { s.attrs.快乐 -= 4; s.attrs.智力 += 2; },
            result: '只有三个人投了你。你红着脸坐下来，学会了什么叫"尴尬"。',
          },
        ],
      },
      {
        label: '低头假装在找东西',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; s.attrs.智力 += 2; },
          result: '你成功躲避了老师的目光。平安是福。',
        }],
      },
    ],
  },

  // 7. 目击霸凌 — 9-13 岁
  {
    id: 'school_bullying',
    stage: 'school', ageRange: [9, 13], once: true,
    trigger: { baseWeight: 5 },
    text: '走廊拐角，几个高个子正围着班里那个总是不说话的男生，推推搡搡。他们看见了你。',
    choices: [
      {
        label: '大喊「老师来了！」',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 魅力: 30 } },
            apply: (s) => { s.attrs.快乐 += 3; s.attrs.魅力 += 5; s.flags.add('choice_stood_up_bully'); },
            result: '他们被骗住了，一哄而散。那个男生看了你一眼，轻轻说了声谢谢。',
          },
          {
            weight: 50,
            condition: { attrLt: { 魅力: 30 } },
            apply: (s) => { s.attrs.快乐 -= 4; s.attrs.体质 -= 3; },
            result: '他们没上当，还顺带把你"教训"了一顿。但你并不后悔。',
          },
        ],
      },
      {
        label: '假装没看见，快步走开',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 5; s.attrs.智力 += 2; },
          result: '你走开了。但这件事在很长一段时间里，会突然在你脑海里回放。',
        }],
      },
    ],
  },

  // 8. 作弊诱惑 — 14-17 岁
  {
    id: 'school_cheat_temption',
    stage: 'school', ageRange: [14, 17], once: true,
    trigger: { baseWeight: 4 },
    text: '期末考试前十分钟，同桌从袖口抽出一张密密麻麻的小抄，朝你挑了挑眉：「兄弟，要不要？」',
    choices: [
      {
        label: '接过来，关键时刻救命用',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 运气: 40 } },
            apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 += 3; s.attrs.运气 -= 5; },
            result: '你没真正用到它，但揣着小抄的感觉让你莫名安心。考得还行。',
          },
          {
            weight: 50,
            condition: { attrLt: { 运气: 40 } },
            apply: (s) => { s.attrs.智力 -= 5; s.attrs.快乐 -= 8; s.flags.add('choice_caught_cheating'); },
            result: '监考老师走过时，那张纸条从你手里滑了出来。请家长。',
          },
        ],
      },
      {
        label: '摇头：「我自己来」',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 4; s.attrs.魅力 += 2; },
          result: '你拒绝了。那场考试很难，但你交卷时心安理得。',
        }],
      },
    ],
  },

  // 9. 喜欢的老师 — 10-14 岁
  {
    id: 'school_favorite_teacher',
    stage: 'school', ageRange: [10, 14], once: true,
    trigger: { baseWeight: 4 },
    text: '新来的语文老师讲课和别人不一样。她会念诗，会讲故事，眼睛里有光。',
    choices: [
      {
        label: '课后主动找TA聊天',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 6; s.attrs.魅力 += 3; s.attrs.快乐 += 4; s.flags.add('choice_inspired_by_teacher'); },
          result: 'TA推荐你读了很多书，还说你「眼里有光」。你开始认真思考将来要做什么样的人。',
        }],
      },
      {
        label: '默默把课听好就行',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 4; s.attrs.快乐 += 2; },
          result: '你上课格外认真。虽然没说过几句话，但她的课成了你那两年最期待的事。',
        }],
      },
    ],
  },

  // 10. 网吧通宵 — 13-16 岁
  {
    id: 'school_internet_cafe',
    stage: 'school', ageRange: [13, 16], once: true,
    trigger: { baseWeight: 5 },
    text: '周五最后一节课，死党在桌底下戳你：「今晚去网吧通宵？新出的游戏，上号！」',
    choices: [
      {
        label: '冲！谁怕谁',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 体质: 40 } },
            apply: (s) => { s.attrs.快乐 += 8; s.attrs.智力 -= 2; s.attrs.体质 -= 3; s.flags.add('choice_internet_cafe'); },
            result: '你打了个通宵，升了八级。走出网吧时，清晨的阳光格外刺眼。',
          },
          {
            weight: 50,
            condition: { attrLt: { 体质: 40 } },
            apply: (s) => { s.attrs.快乐 += 3; s.attrs.智力 -= 4; s.attrs.体质 -= 6; },
            result: '你打到凌晨三点就撑不住了，趴在键盘上睡着了。第二天周一，你困成了行尸走肉。',
          },
        ],
      },
      {
        label: '不了，我回家睡觉',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 3; s.attrs.体质 += 2; },
          result: '你拒绝了。周六早上醒来，神清气爽——这感觉真好。',
        }],
      },
    ],
  },

  // 11. 文艺汇演 — 11-14 岁
  {
    id: 'school_talent_show',
    stage: 'school', ageRange: [11, 14], once: true,
    trigger: { baseWeight: 4 },
    text: '学校文艺汇演在招节目。班长在黑板上写报名表，回头问全班：「还有谁想上？」',
    choices: [
      {
        label: '报名！我要上台',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 魅力: 40 } },
            apply: (s) => { s.attrs.魅力 += 8; s.attrs.快乐 += 6; s.flags.add('achievement_talent_show'); },
            result: '你的节目大获成功。台下掌声雷动，你在那一刻觉得自己真的闪着光。',
          },
          {
            weight: 100,
            condition: { attrLt: { 魅力: 40 } },
            apply: (s) => { s.attrs.魅力 += 3; s.attrs.快乐 -= 2; },
            result: '你紧张到忘词，但同学们还是给了鼓励的掌声。你学会了"丢脸也没关系"。',
          },
        ],
      },
      {
        label: '在台下当观众就好',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; },
          result: '你嗑着瓜子看完了一整场。有些事，旁观也很快乐。',
        }],
      },
    ],
  },

  // 12. 同桌三八线 — 9-12 岁
  {
    id: 'school_deskmate_conflict',
    stage: 'school', ageRange: [9, 12], once: true,
    trigger: { baseWeight: 5 },
    text: '同桌的手肘又越过了那条用铅笔画的三八线。你瞪着TA，TA瞪回来：「怎么了？地是你家的？」',
    choices: [
      {
        label: '用圆规把线划得更深',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.魅力 -= 2; s.attrs.智力 += 2; },
          result: '你们冷战了一周。后来TA先递过来一块橡皮，你们就莫名其妙的和好了。',
        }],
      },
      {
        label: '算了，把东西往自己这边挪挪',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; s.attrs.魅力 += 3; s.attrs.智力 += 2; },
          result: '你让了一步，TA也有点不好意思。后来你们成了不错的朋友。',
        }],
      },
    ],
  },

  // 13. 学习小组 — 15-17 岁
  {
    id: 'school_study_group',
    stage: 'school', ageRange: [15, 17], once: true,
    trigger: { baseWeight: 4 },
    text: '班里几个成绩不错的同学在组学习小组，准备冲刺期末。组长朝你招手：「要不要一起？」',
    choices: [
      {
        label: '加入，一起卷',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 智力: 45 } },
            apply: (s) => { s.attrs.智力 += 7; s.attrs.快乐 += 3; s.attrs.体质 -= 2; },
            result: '你们互相讲题、互相监督。学习忽然变得没那么孤独了。',
          },
          {
            weight: 100,
            condition: { attrLt: { 智力: 45 } },
            apply: (s) => { s.attrs.智力 += 4; s.attrs.快乐 -= 3; },
            result: '你跟不上他们的节奏，大部分时间在旁边默默听。但确实学到了东西。',
          },
        ],
      },
      {
        label: '我喜欢一个人学',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 += 2; },
          result: '你按自己的节奏走。偶尔有点孤独，但效率不差。',
        }],
      },
    ],
  },
];
