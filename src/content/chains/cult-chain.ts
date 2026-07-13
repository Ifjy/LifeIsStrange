// src/content/chains/cult-chain.ts
import type { GameEvent } from '../../engine/types';

// 铺垫事件：街头收到"心灵讲座"传单，或朋友说有个"读书会"
const foreshadowCultLecture: GameEvent = {
  id: 'foreshadow_cult_lecture',
  stage: 'career',
  ageRange: [25, 35],
  once: true,
  trigger: {
    baseWeight: 2,
  },
  text: '下班路上，有人在发传单——"心灵成长读书会，免费体验"。一个朋友也提过："最近参加了一个圈子，人都特别好，你应该来看看。"',
  choices: [
    {
      label: '收下传单，留个联系方式',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.flags.add('foreshadow_cult_lecture');
          s.attrs.快乐 += 1;
        },
        result: '你把传单塞进口袋。那张笑脸让你觉得，也许真的有一群人在等你。',
      }],
    },
    {
      label: '不感兴趣，直接走',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 1; },
        result: '你摇摇头走开了。世上没有免费的午餐，更没有免费的心灵成长。',
      }],
    },
  ],
};

// 入口事件：第一次聚会，氛围温暖但有点怪——三层 outcome
const cultFirstGathering: GameEvent = {
  id: 'cult_first_gathering',
  stage: 'career',
  ageRange: [27, 38],
  once: true,
  trigger: {
    baseWeight: 2,
  },
  text: '聚会地点是一间布置温馨的客厅。所有人面带微笑，互相拥抱。导师说："这里没有评判，只有接纳。"你第一次感到被完全理解——但又有一丝说不出的违和。',
  choices: [
    {
      label: '留下来听听，感觉被治愈了',
      outcomes: [
        // 常规层：归属感
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 5;
            s.flags.add('milestone_cult');
          },
          result: '你找到了归属感。导师的话像一双温暖的手，把你心里所有的伤口都按住了。',
        },
        // 反转层：被深度洗脑
        {
          weight: 20,
          condition: { attrLt: { 智力: 40 } },
          apply: (s) => {
            s.attrs.快乐 += 10;
            s.attrs.智力 -= 5;
            s.flags.add('milestone_cult');
          },
          result: '导师说得太对了，你当场捐了一个月工资。回家的路上你哭了——是那种被救赎的哭。',
        },
        // 罕见反转层：看穿控制
        {
          weight: 5,
          condition: { all: [
            { attrGte: { 智力: 65 } },
            { flag: 'foreshadow_cult_lecture' },
          ]},
          apply: (s) => {
            s.flags.add('milestone_cult');
            s.flags.add('twist_cult_skeptic');
          },
          result: '温暖的氛围下，你敏锐地嗅到了控制的味道——但你决定先潜伏观察。这个圈子不简单。',
        },
      ],
    },
    {
      label: '不太适合我，先走了',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 2; },
        result: '你找了个借口离开。门关上的那一刻，你听到里面传来整齐的诵念声，背后一阵凉意。',
      }],
    },
  ],
};

// 分支1：奉献要求——捐钱/断绝旧社交
const cultCommitment: GameEvent = {
  id: 'cult_commitment',
  stage: 'career',
  ageRange: [29, 40],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_cult' }],
  },
  text: '导师说："想要真正的成长，必须放下世俗的执念。"他看着你的银行App，又看着你的通讯录。"信任，是要用行动证明的。"',
  choices: [
    {
      label: '全捐，断绝旧社交',
      outcomes: [
        // 常规层
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 -= 30;
            s.attrs.快乐 += 10;
          },
          result: '你转账、删联系人，一气呵成。导师拍着你的肩："你自由了。"你确实感到了一种轻盈——像坠落。',
        },
        // 反转层：短期愉悦后的空虚
        {
          weight: 20,
          condition: { attrLt: { 智力: 45 } },
          apply: (s) => {
            s.attrs.财富 -= 30;
            s.attrs.快乐 += 15;
            s.attrs.智力 -= 5;
          },
          result: '你把积蓄全部上交，删光了朋友。导师说你是"觉醒者"。那一夜你睡得特别香，梦里全是光。',
        },
      ],
    },
    {
      label: '留个心眼，只捐一点',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 -= 15;
            s.attrs.快乐 += 5;
            s.flags.add('choice_cult_cautious');
          },
          result: '你捐了一小笔，谎称"积蓄就这些"。导师笑了笑，没说什么。但你注意到，他的眼神在你身上多停了一秒。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 55 } },
          apply: (s) => {
            s.attrs.财富 -= 10;
            s.attrs.快乐 += 3;
            s.flags.add('twist_cult_skeptic');
          },
          result: '你假装配合，偷偷保留了外部联系。这个圈子水很深，你不能把退路全堵死。',
        },
      ],
    },
  ],
};

// 分支2：进入核心层，看到幕后真相
const cultInnerCircle: GameEvent = {
  id: 'cult_inner_circle',
  stage: 'career',
  ageRange: [32, 45],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_cult' }],
  },
  text: '你被选入"核心弟子"的行列。深夜的密室里，导师摘下面具：所谓的"成长课程"是一套精密的心理控制系统，他知道每个人的软肋，逐一击破。',
  choices: [
    {
      label: '更虔诚，这是考验',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 10;
            s.attrs.智力 -= 10;
            s.flags.add('twist_cult_radical');
          },
          result: '"凡所有相，皆是虚妄。"你对自己说。你选择相信这是更高的真理——因为不相信，就意味着过去一切都白费了。',
        },
        {
          weight: 20,
          condition: { attrLt: { 智力: 35 } },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.attrs.智力 -= 15;
            s.flags.add('twist_cult_radical');
          },
          result: '你完全崩溃了。认知失调让你选择更深的依赖——你开始举报"不虔诚"的同伴，用狂热证明自己。',
        },
      ],
    },
    {
      label: '开始怀疑',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.flags.add('twist_cult_awakened');
          },
          result: '你低下头，不让自己露出破绽。从这一刻起，你不再是信徒——你是在演戏。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 60 } },
          apply: (s) => {
            s.attrs.快乐 -= 3;
            s.flags.add('twist_cult_awakened');
            s.flags.add('twist_cult_skeptic');
          },
          result: '你不仅开始怀疑，还偷偷收集信息——资金流向、人员名单、心理控制话术。这些东西，将来可能是武器。',
        },
      ],
    },
  ],
};

// 分支3：最终抉择——殉道/反杀/逃离
const cultAwakening: GameEvent = {
  id: 'cult_awakening',
  stage: 'career',
  ageRange: [35, 50],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_cult' }],
  },
  text: '事情到了临界点。媒体开始调查，内部有人想脱身，导师要求全体"誓师"——用行动证明忠诚。你站在燃烧的客厅里，必须做出最后的选择。',
  choices: [
    {
      label: '殉道，证明忠诚',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 -= 30;
          s.attrs.体质 -= 20;
          s.flags.add('foreshadow_cult_martyr');
        },
        result: '你选择了最高的献祭。火焰升起时，你看到导师眼里的满意——你终于成了"教材"。',
      }],
    },
    {
      label: '反杀教主，夺取控制权',
      outcomes: [
        {
          weight: 40,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 20;
            s.attrs.快乐 -= 10;
            s.flags.add('twist_cult_usurp');
          },
          result: '你握住了导师的所有把柄——资金、名单、录音。他下台了，信众看向了你。你成了新的"导师"。',
        },
        {
          weight: 60,
          condition: { attrGte: { 魅力: 70, 智力: 60 } },
          apply: (s) => {
            s.attrs.财富 += 30;
            s.attrs.快乐 -= 5;
            s.attrs.魅力 += 5;
            s.flags.add('twist_cult_usurp');
          },
          result: '你不仅有证据，更有手腕。你在一次"启示"中取代了旧导师，信众甚至觉得这是"天意"。',
        },
      ],
    },
    {
      label: '逃离，重新开始',
      outcomes: [
        {
          weight: 70,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.attrs.财富 -= 10;
            s.flags.add('twist_cult_awakened');
          },
          result: '你连夜离开。身后是燃烧的过去，身前是空白的未来。但你活着——这是唯一的真相。',
        },
        {
          weight: 30,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.快乐 -= 20;
            s.attrs.体质 -= 10;
            s.flags.add('twist_cult_awakened');
          },
          result: '你逃了，但身体先撑不住了。长期的身心摧残让你带着一身病痛离开。活着，但代价惨重。',
        },
      ],
    },
  ],
};

export const cultChainEvents: GameEvent[] = [
  foreshadowCultLecture,
  cultFirstGathering,
  cultCommitment,
  cultInnerCircle,
  cultAwakening,
];
