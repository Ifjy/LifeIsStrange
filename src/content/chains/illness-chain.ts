// src/content/chains/illness-chain.ts
import type { GameEvent } from '../../engine/types';

// 铺垫事件：体检报告有个异常指标 / 身体发出警告信号
const foreshadowIllnessSign: GameEvent = {
  id: 'foreshadow_illness_sign',
  stage: 'career',
  ageRange: [28, 38],
  once: true,
  trigger: {
    baseWeight: 2,
  },
  text: '单位体检报告出来，有一项指标标了红色箭头。医生说"建议复查"，语气平淡得像念菜单。你盯着那个箭头看了很久，查了半天手机，最后关掉页面，告诉自己没事。',
  choices: [
    {
      label: '记下来，约个复查',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.flags.add('foreshadow_illness_sign');
          s.attrs.快乐 -= 2;
        },
        result: '你把报告折好放进包里。那个红色箭头像一根细刺，不疼，但你知道它在那里。',
      }],
    },
    {
      label: '估计没事，不管了',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 1; },
        result: '你把报告塞进抽屉最底层。统计数据说大多数异常都是虚惊一场——你选择相信这一条。',
      }],
    },
  ],
};

// 入口事件：确诊重病或残疾，人生停摆——三层 outcome（罕见层是"误诊"，不进分支）
const illnessDiagnosis: GameEvent = {
  id: 'illness_diagnosis',
  stage: 'career',
  ageRange: [30, 42],
  once: true,
  trigger: {
    baseWeight: 4,
  },
  text: '这次复查的结果不一样。医生摘下眼镜，换了一种语气。诊室里的白炽灯嗡嗡响，你听见一堆专业术语，只听懂了"需要尽快治疗"几个字。人生按下了暂停键。',
  choices: [
    {
      label: '认真面对，去大医院查清楚',
      outcomes: [
        // 常规层：确诊，积极治疗
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.体质 -= 10;
            s.attrs.财富 -= 20;
            s.flags.add('milestone_illness');
          },
          result: '确诊了。医生说了很多，你只听到"积极治疗"四个字。走出医院时阳光刺眼，你站在门口发了很久的呆。',
        },
        // 反转层：确诊时已经晚了
        {
          weight: 20,
          condition: { attrLt: { 运气: 40 } },
          apply: (s) => {
            s.attrs.体质 -= 20;
            s.attrs.财富 -= 20;
            s.flags.add('milestone_illness');
          },
          result: '确诊时已经晚了。医生叹了口气，你听懂了那个叹气的意思——不是"没办法"，而是"早来半年就好了"。',
        },
        // 罕见反转层：误诊——情绪释放，不进分支
        {
          weight: 8,
          condition: { all: [
            { attrGte: { 运气: 55 } },
            { flag: 'foreshadow_illness_sign' },
          ]},
          apply: (s) => {
            s.attrs.快乐 += 10;
            s.attrs.体质 += 5;
            s.flags.add('twist_illness_misdiagnosis');
          },
          result: '复查结果：误诊。你看着第二份报告，在诊室门口蹲了很久，又哭又笑。路过的护士问你没事吧，你摇摇头，又点点头。',
        },
      ],
    },
    {
      label: '拖一拖，应该没事',
      outcomes: [{
        weight: 60,
        condition: { all: [] },
        apply: (s) => { s.attrs.体质 -= 5; },
        result: '你把报告塞回口袋，告诉自己再观察观察。有些病是拖好的，有些病是拖死的——你赌前者。',
      }],
    },
  ],
};

// 分支1：治疗期——砸钱 vs 放弃 vs 试新药
const illnessTreatment: GameEvent = {
  id: 'illness_treatment',
  stage: 'career',
  ageRange: [31, 45],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_illness' }],
  },
  text: '治疗方案摆在面前。标准方案医保报一部分，但副作用大；自费方案效果好，但要卖掉一套房；还有个临床试验，免费，但"试验"两个字让你心里发毛。',
  choices: [
    {
      label: '砸钱，用最好的方案',
      outcomes: [
        // 常规层：钱花得值
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 -= 30;
            s.attrs.体质 += 10;
            s.attrs.快乐 += 5;
          },
          result: '钱像流水一样花出去，但指标在往好的方向走。你躺在病床上想，钱没了可以再赚，命就一条。',
        },
        // 反转层：钱花了，效果一般
        {
          weight: 20,
          condition: { attrLt: { 运气: 35 } },
          apply: (s) => {
            s.attrs.财富 -= 30;
            s.attrs.体质 += 3;
            s.attrs.快乐 -= 10;
          },
          result: '最好的方案也救不回所有。指标勉强控制住，但副作用让你每天呕吐、脱发。你不敢照镜子。',
        },
      ],
    },
    {
      label: '选标准方案，省钱',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 -= 10;
            s.attrs.体质 += 5;
          },
          result: '副作用让你吃尽了苦头，但至少不用卖房。你学会了在呕吐后漱口、微笑、假装没事。',
        },
        {
          weight: 25,
          condition: { attrGte: { 体质: 40 } },
          apply: (s) => {
            s.attrs.财富 -= 10;
            s.attrs.体质 += 8;
            s.attrs.快乐 += 3;
          },
          result: '你底子好，扛住了。护士说你是整层楼恢复最快的，你笑了笑，第一次觉得"皮实"是夸人的话。',
        },
      ],
    },
    {
      label: '报名临床试验，搏一把',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.体质 += 5;
            s.flags.add('choice_illness_trial');
          },
          result: '新药的反应未知。你签了知情同意书，最后一行写着"可能无法获益"——你签了。',
        },
        {
          weight: 25,
          condition: { attrGte: { 运气: 50 } },
          apply: (s) => {
            s.attrs.体质 += 15;
            s.attrs.快乐 += 10;
            s.flags.add('choice_illness_trial');
          },
          result: '新药效果出奇地好。你成了论文里的"成功病例"，主治医生逢人就说这是医学的胜利。你只是庆幸自己赌对了。',
        },
      ],
    },
  ],
};

// 分支2：康复/适应期——重新学走路/工作/社交
const illnessRecovery: GameEvent = {
  id: 'illness_recovery',
  stage: 'career',
  ageRange: [35, 50],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_illness' }],
  },
  text: '最危险的日子过去了，但"好了"这个词变得很复杂。你的身体不再是原来的身体，朋友看你的眼神也不再是原来的眼神。你必须重新学会一件事：带着新的自己，活下去。',
  choices: [
    {
      label: '积极复健，重新出发',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.体质 += 8;
            s.attrs.快乐 += 10;
          },
          result: '你每天练习走路、握笔、上下楼梯。进步很慢，但每多走一步都是赚的。你开始理解，"康复"不是回到从前，而是向前走。',
        },
        {
          weight: 20,
          condition: { attrLt: { 体质: 25 } },
          apply: (s) => {
            s.attrs.体质 += 3;
            s.attrs.快乐 -= 5;
          },
          result: '复健太疼了，进度也比预期慢。你有时会崩溃，对着镜子问"为什么是我"。但哭完，你还是擦干泪继续练。',
        },
      ],
    },
    {
      label: '重新融入社交，分享经历',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.魅力 += 10;
            s.attrs.快乐 += 5;
          },
          result: '你开始和病友聚会，在朋友圈写康复日记。有人私信说"谢谢你写这些"。你第一次发现，脆弱也能连接人。',
        },
        {
          weight: 25,
          condition: { attrGte: { 魅力: 50 } },
          apply: (s) => {
            s.attrs.魅力 += 15;
            s.attrs.快乐 += 8;
            s.flags.add('choice_illness_advocate');
          },
          result: '你的故事被更多人看到。有记者来采访，有公益组织邀请你分享。你成了一个符号——"那个扛过来的人"。',
        },
      ],
    },
    {
      label: '在家休养，少与人来往',
      outcomes: [
        {
          weight: 70,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 8;
            s.attrs.魅力 -= 5;
          },
          result: '你拉上窗帘，关掉手机。世界在门外继续运转，你缩在自己的壳里，觉得安全，也觉得空。',
        },
        {
          weight: 30,
          condition: { attrLt: { 快乐: 30 } },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.attrs.体质 -= 5;
          },
          result: '你越来越少出门。镜子里的自己越来越陌生。某天你发现已经三个月没和人说过话了——除了外卖骑手。',
        },
      ],
    },
  ],
};

// 分支3：找到意义——病友互助/公益/写书
const illnessMeaning: GameEvent = {
  id: 'illness_meaning',
  stage: 'career',
  ageRange: [40, 60],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_illness' }],
  },
  text: '病还在，或者留下了痕迹，但你已经学会了和它共处。有人问你："这场病，你从里头得到了什么？"你愣了一下——你从没想过这个问题。',
  choices: [
    {
      label: '做病友互助，帮更多的人',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.魅力 += 10;
            s.attrs.快乐 += 10;
            s.flags.add('choice_illness_advocate');
          },
          result: '你建了一个病友群，从十几人到几百人。你陪着新人走过最黑的那段路，说当年没人对我说过的话。你没法治好他们，但你能让他们少怕一点。',
        },
        {
          weight: 25,
          condition: { attrGte: { 魅力: 55 } },
          apply: (s) => {
            s.attrs.魅力 += 15;
            s.attrs.快乐 += 12;
            s.flags.add('choice_illness_advocate');
          },
          result: '你的互助组织做大了。你站在台上演讲，台下是几百双含泪的眼睛。你成了一座灯塔——不是因为你最亮，而是因为你也曾在黑暗里。',
        },
      ],
    },
    {
      label: '写下来，记录这段经历',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 12;
          },
          result: '你开始写。从确诊那天写起，一行一行，把那些说不出口的恐惧、愤怒、和解，都放进了文字里。写完那天你哭了——不是因为难过，是因为终于放下了。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 55 } },
          apply: (s) => {
            s.attrs.快乐 += 15;
            s.attrs.魅力 += 5;
          },
          result: '你的文字打动了一个编辑。书出版后，陌生人在网上说"读了你的书，我不怕了"。你盯着那条评论看了很久。',
        },
      ],
    },
    {
      label: '什么都不想做，累了',
      outcomes: [
        {
          weight: 70,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 10;
            s.attrs.体质 -= 5;
          },
          result: '你已经没有多余的力气分给"意义"了。每天起床、吃药、发呆、睡觉，已经是全部。活着本身，就是一份全职工作。',
        },
        {
          weight: 30,
          condition: { attrLt: { 体质: 20 } },
          apply: (s) => {
            s.attrs.体质 -= 10;
            s.attrs.快乐 -= 12;
          },
          result: '你的身体每况愈下。最后一次复查，医生没说什么，只是开了更多的药。你看着那一袋子药盒，知道它们不是在治你，是在拖住你。',
        },
      ],
    },
  ],
};

export const illnessChainEvents: GameEvent[] = [
  foreshadowIllnessSign,
  illnessDiagnosis,
  illnessTreatment,
  illnessRecovery,
  illnessMeaning,
];
