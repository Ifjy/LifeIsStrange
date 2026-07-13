// src/content/chains/crime-chain.ts
import type { GameEvent } from '../../engine/types';

// 铺垫事件：埋下犯罪诱惑的伏笔
const foreshadowCrimeTemptation: GameEvent = {
  id: 'foreshadow_crime_temptation',
  stage: 'career',
  ageRange: [25, 32],
  once: true,
  trigger: {
    baseWeight: 2,
    requires: [{ flag: 'milestone_has_job' }],
  },
  text: '同事神秘兮兮地凑过来：「有个路子，来快钱的。你不缺钱就算了，但我知道你最近手头紧。」',
  choices: [
    {
      label: '听听也无妨',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.flags.add('foreshadow_crime_temptation');
          s.attrs.快乐 -= 2;
        },
        result: '你记住了那几句话。当时没当回事，但种子已经埋下了。',
      }],
    },
    {
      label: '不感兴趣，走开',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 2; },
        result: '你摆摆手走开了。有些门，不敲第二次就不会开。',
      }],
    },
  ],
};

// 入口事件：犯罪分支的核心——三层 outcome
const crimeFirstTaste: GameEvent = {
  id: 'crime_first_taste',
  stage: 'career',
  ageRange: [26, 35],
  once: true,
  trigger: {
    baseWeight: 4,
    requires: [{ flag: 'milestone_has_job' }],
  },
  text: '机会来了。公司账目有一笔对不上的数字，领导暗示你「处理一下」。做假账、捞偏门，一条捷径摆在眼前。',
  choices: [
    {
      label: '捞一笔就走',
      outcomes: [
        // 常规层：符合直觉的预期结果
        {
          weight: 40,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 15;
            s.flags.add('milestone_crime');
          },
          result: '果然来钱快。你心跳得厉害，但看着银行余额，一切都值了。',
        },
        // 反转层：讽刺内核——第一次就差点出事
        {
          weight: 15,
          condition: { attrLt: { 运气: 35 } },
          apply: (s) => {
            s.attrs.财富 += 15;
            s.flags.add('milestone_crime');
            s.flags.add('foreshadow_crime_setup');
          },
          result: '第一次就差点被抓，审计的电话打过来时你手都在抖——但运气好，蒙混过关了。',
        },
        // 罕见反转层：脑洞——你看穿了这是个局
        {
          weight: 5,
          condition: { all: [
            { attrGte: { 智力: 60 } },
            { flag: 'foreshadow_crime_temptation' },
          ]},
          apply: (s) => {
            s.attrs.财富 -= 5;
            s.flags.add('milestone_crime');
            s.flags.add('twist_crime_mastermind');
          },
          result: '你一眼看穿这是个局——领导在找替罪羊。你将计就计，反过来握住了他的把柄。',
        },
      ],
    },
    {
      label: '不碰这种事',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 2; },
        result: '你假装没听懂，把账目退回去了。日子照旧，虽然紧巴，但睡得着觉。',
      }],
    },
  ],
};

// 分支1：越陷越深
const crimeDeeper: GameEvent = {
  id: 'crime_deeper',
  stage: 'career',
  ageRange: [28, 40],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_crime' }],
  },
  text: '金额越来越大。从假账到走账，从走账到现金。你已经回不了头了，每多走一步，退路就少一条。',
  choices: [
    {
      label: '继续做，来钱快',
      outcomes: [
        // 常规层
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 25;
            s.attrs.快乐 -= 10;
            s.attrs.体质 -= 5;
            s.flags.add('twist_crime_deep');
          },
          result: '钱像水一样流进来，但你开始失眠。每天凌晨三点惊醒，听着门口的动静。',
        },
        // 反转层：身心崩溃
        {
          weight: 20,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.财富 += 20;
            s.attrs.体质 -= 15;
            s.attrs.快乐 -= 20;
            s.flags.add('twist_crime_deep');
          },
          result: '你的身体先垮了。胃溃疡、心悸、白发。钱赚到了，但你已经不像个人样。',
        },
      ],
    },
    {
      label: '想收手，退出',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 8;
            s.flags.add('choice_crime_quit_attempt');
          },
          result: '你试探着说要退出。对方笑了笑，没说话。你知道，那意味着不行。',
        },
        {
          weight: 30,
          condition: { attrGte: { 智力: 50 } },
          apply: (s) => {
            s.attrs.快乐 += 5;
            s.flags.add('twist_crime_quit_smart');
          },
          result: '你装作亏空了一笔，让对方主动把你踢出去。这个计策奏效了——至少暂时。',
        },
      ],
    },
  ],
};

// 分支2：背叛与胁迫
const crimeBetrayal: GameEvent = {
  id: 'crime_betrayal',
  stage: 'career',
  ageRange: [30, 42],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_crime' }],
  },
  text: '同伙出事了——被带走调查。上线找到你：「事情你来收尾，做完这单，一笔勾销。」你知道这单比以前都大。',
  choices: [
    {
      label: '配合，做完这单',
      outcomes: [
        // 常规层
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 20;
            s.flags.add('foreshadow_crime_setup');
          },
          result: '你做完了这单。钱到账了，但你总觉得这单不一样——像是被人特意安排好的。',
        },
        // 反转层：被盯上了
        {
          weight: 20,
          condition: { attrLt: { 运气: 40 } },
          apply: (s) => {
            s.attrs.财富 += 15;
            s.flags.add('foreshadow_crime_setup');
            s.attrs.快乐 -= 10;
          },
          result: '你做完这单才发现，所有证据都指向你。这从头到尾就是一个局——你是被选中的那个。',
        },
      ],
    },
    {
      label: '想收手，不干了',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 10;
            s.flags.add('choice_crime_betrayal_refuse');
          },
          result: '你拒绝了。但 milestone_crime 还在，你的名字还在那些账本里。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 55 } },
          apply: (s) => {
            s.attrs.快乐 += 5;
            s.flags.add('twist_crime_evidence_kept');
          },
          result: '你拒绝了，但你偷偷留了一份证据。这可能是你的护身符，也可能是催命符。',
        },
      ],
    },
  ],
};

// 分支3：关键十字路口——三选一决定结局线
const crimeCrossroad: GameEvent = {
  id: 'crime_crossroad',
  stage: 'career',
  ageRange: [35, 45],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_crime' }],
  },
  text: '到了关键的时刻。你可以收手自首走清白路线，可以继续做下去赌一把做大，也可以反咬上线一口翻盘。三条路，每一种代价不同。',
  choices: [
    {
      label: '收手，想办法清白',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.财富 -= 30;
          s.attrs.快乐 += 15;
          s.flags.add('twist_crime_quit_clean');
          s.flags.delete('foreshadow_crime_setup');
        },
        result: '你花了大价钱铺路，把能抹的抹了、能还的还了。清白买不回来，但至少自由还在。',
      }],
    },
    {
      label: '继续，赌一把做大佬',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.财富 += 30;
          s.attrs.快乐 -= 5;
          s.flags.add('twist_crime_go_boss');
        },
        result: '你已经走到这一步了，收手就是等死。不如一条道走到黑，赌自己能坐到那张椅子上。',
      }],
    },
    {
      label: '反咬上线，翻盘',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.财富 += 10;
          s.attrs.快乐 -= 15;
          s.attrs.体质 -= 10;
          s.flags.add('twist_crime_flip_boss');
          s.flags.add('foreshadow_crime_setup');
        },
        result: '你把上线的证据交了出去。但你忘了——被咬的人，总会反咬回来。',
      }],
    },
  ],
};

export const crimeChainEvents: GameEvent[] = [
  foreshadowCrimeTemptation,
  crimeFirstTaste,
  crimeDeeper,
  crimeBetrayal,
  crimeCrossroad,
];
