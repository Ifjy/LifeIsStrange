// src/content/chains/double-life-chain.ts
import type { GameEvent } from '../../engine/types';

// 铺垫事件：发现"入口"——暗网/地下画室/匿名论坛
// stage=college，ageRange 20-28
const foreshadowDoubleLifePortal: GameEvent = {
  id: 'foreshadow_double_life_portal',
  stage: 'college',
  ageRange: [20, 28],
  once: true,
  trigger: {
    baseWeight: 2,
  },
  text: '深夜失眠，你随手点开了一个从未见过的链接——一个匿名论坛、一间地下画室、或者一个需要邀请码才能进入的频道。里面的内容让你心跳加速：这里有人在谈你白天世界里没人敢谈的事，有人在用你从未想过的方式活着。页面角落有一行小字：「你想成为另一个人吗？」',
  choices: [
    {
      label: '注册一个谁也不认识的账号',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.flags.add('foreshadow_double_life_portal');
          s.attrs.快乐 += 2;
          s.attrs.智力 += 1;
        },
        result: '你起了一个完全不属于你的名字。第一次以这个身份打字时，你觉得心里有什么东西松开了——像打开了一扇一直紧锁的窗。',
      }],
    },
    {
      label: '只是看看，不参与',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 1; },
        result: '你只是看。但那些帖子、那些对话、那些"另一个世界"的气息，已经悄悄刻进了你的记忆里。',
      }],
    },
  ],
};

// 入口事件：决定涉足暗面——黑客/地下作者/卧底
// stage=career，ageRange 24-32
// 三层 outcome（常规/反转/罕见反转）
const doubleLifeChoice: GameEvent = {
  id: 'double_life_choice',
  stage: 'career',
  ageRange: [24, 32],
  once: true,
  trigger: {
    baseWeight: 4,
  },
  text: '白天的工作把你磨成了一个面目模糊的人——开会、汇报、微笑、重复。但你心里清楚，你不只是工位上的那个名字。深夜的屏幕亮着，匿名账号的私信在闪，另一个身份在召唤你。你只需要点下回车，就真的走进去。',
  choices: [
    {
      label: '我有另一个身份',
      outcomes: [
        // 常规层：双重生活开启
        {
          weight: 45,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.快乐 += 5;
            s.flags.add('milestone_double_life');
          },
          result: '白天你是普通职员，晚上你是论坛传说中的"幽灵"。两个世界、两个名字、两种活法——你终于觉得自己在完整地活着。',
        },
        // 反转层：暗面找到了存在感，现实里却越来越沉默
        {
          weight: 20,
          condition: { attrLt: { 魅力: 30 } },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.attrs.智力 += 3;
            s.flags.add('milestone_double_life');
          },
          result: '你在暗面找到了存在感，但现实里越来越沉默。同事觉得你"最近怪怪的"，而你无法告诉任何人——你晚上是谁。',
        },
        // 罕见反转层：两个身份互相利用
        {
          weight: 5,
          condition: { all: [
            { attrGte: { 智力: 70 } },
            { flag: 'foreshadow_double_life_portal' },
          ]},
          apply: (s) => {
            s.attrs.智力 += 8;
            s.attrs.魅力 += 5;
            s.flags.add('milestone_double_life');
            s.flags.add('twist_double_life_vision');
          },
          result: '你意识到两个身份可以互相利用——明面提供掩护和情报，暗面提供手段和消息。你不是在过两种生活，你是在下一盘棋。',
        },
      ],
    },
    {
      label: '算了，看看就好',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 1; },
        result: '你关掉了那个页面。有些门，不推开是一种幸运。你躺在床上，听着自己的心跳，说不清是松了口气，还是错过了一个再也回不去的机会。',
      }],
    },
  ],
};

// 分支1：维持双面——白天上班，晚上另一重身份
// stage=career，ageRange 28-40，requires milestone_double_life
const doubleLifeBalance: GameEvent = {
  id: 'double_life_balance',
  stage: 'career',
  ageRange: [28, 40],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_double_life' }],
  },
  text: '双面生活已经持续了好几年。你练就了一套精确的时间表：几点下班、几点上线、几点睡觉，精确到分钟。同事眼里的你，温和、普通、没什么存在感。而那个深夜世界里的人——冷静、锋利、让人又敬又怕——只有你知道是同一个。',
  choices: [
    {
      label: '继续维持，越来越游刃有余',
      outcomes: [
        // 常规层
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 4;
            s.attrs.魅力 += 3;
            s.attrs.快乐 += 3;
          },
          result: '你在两个身份之间切换得越来越自然。白天开会时，你心里想着昨晚那局棋；晚上上线时，你用白天听来的消息做筹码。双面人生，原来也可以是一种艺术。',
        },
        // 反转层：疲惫开始侵蚀
        {
          weight: 20,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.体质 -= 10;
            s.attrs.快乐 -= 8;
          },
          result: '两个身份的代价开始显现——长期失眠、白天恍惚、黑眼圈遮不住。同事问你"是不是身体不舒服"，你笑着说没事，但手心全是冷汗。',
        },
      ],
    },
    {
      label: '让暗面的身份做得更大一点',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 6;
            s.attrs.财富 += 10;
            s.attrs.快乐 += 5;
          },
          result: '你开始让暗面的"自己"走得更远。名声、资源、人脉——深夜世界的你，正在变成一个真正有分量的人。而白天的你，依然只是工位上一个安静的名字。',
        },
        {
          weight: 20,
          condition: { attrGte: { 智力: 60 } },
          apply: (s) => {
            s.attrs.智力 += 8;
            s.attrs.魅力 += 5;
            s.flags.add('twist_double_life_vision');
          },
          result: '你不仅做大，还做精了——两个身份的信息差，成了你最锋利的武器。你开始享受那种"只有我知道全部真相"的感觉。',
        },
      ],
    },
  ],
};

// 分支2：有人开始怀疑 / 差一点暴露
// stage=career，ageRange 35-48，requires milestone_double_life
const doubleLifeSuspicion: GameEvent = {
  id: 'double_life_suspicion',
  stage: 'career',
  ageRange: [35, 48],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_double_life' }],
  },
  text: '有人开始用奇怪的眼神看你。是同事？是网友？还是某个不该出现的人？一个细节的失误——一条发错群的消息、一张被认出的截图、一个不该出现在那里的时间——差一点就把你的两个世界撞在一起。你心跳如鼓，表面上却必须维持平静。',
  choices: [
    {
      label: '冷静处理，消除痕迹',
      outcomes: [
        // 常规层
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.快乐 -= 5;
          },
          result: '你花了三天时间，把所有可能暴露的痕迹一一清除。换了账号、改了习惯、调整了时间表。危机暂时过去了，但你知道，下一次可能没这么幸运。',
        },
        // 反转层：处理过程中反而暴露了更多
        {
          weight: 20,
          condition: { attrLt: { 魅力: 35 } },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.attrs.智力 += 3;
          },
          result: '你越描越黑。那个怀疑你的人没有消失，反而靠得更近——ta 开始有意无意地试探你。你能感觉到网在收紧，但不知道是从哪个方向。',
        },
      ],
    },
    {
      label: '主动接近那个怀疑你的人',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.魅力 += 5;
            s.attrs.智力 += 3;
            s.attrs.快乐 -= 5;
          },
          result: '你没有躲，反而主动靠近。你和 ta 聊天、吃饭、建立关系——最好的防守是进攻，最好的掩护是信任。ta 渐渐不再怀疑，或者至少，不再追问。',
        },
        {
          weight: 20,
          condition: { attrGte: { 魅力: 55 } },
          apply: (s) => {
            s.attrs.魅力 += 8;
            s.attrs.快乐 += 5;
            s.flags.add('twist_double_life_vision');
          },
          result: '你不仅化解了怀疑，还把 ta 变成了你的盟友——或者说，你的棋子。ta 帮你挡掉了后续所有的风声，而 ta 甚至不知道自己挡的是什么。',
        },
      ],
    },
    {
      label: '暂时收手，风头过了再说',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 -= 8;
          s.attrs.智力 += 2;
        },
        result: '你把暗面的事情全部暂停，回到一个"普通人"的生活。夜晚变得格外漫长——你盯着天花板，想着那边的世界正在发生什么，而你不在场。但你告诉自己：活下去比什么都重要。',
      }],
    },
  ],
};

// 分支3：最终选择——公开 / 永远隐藏 / 金盆洗手
// stage=career，ageRange 45-60，requires milestone_double_life
// 3-way choice：公开→exposed 风险 / 隐藏→forever / 洗手→balance
const doubleLifeReckoning: GameEvent = {
  id: 'double_life_reckoning',
  stage: 'career',
  ageRange: [45, 60],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_double_life' }],
  },
  text: '年岁渐长，你越来越频繁地想一个问题：这样下去，结局是什么？双面人生不可能永远维持——总有一天，要么自己露馅，要么被时代追上。摆在面前的路很清楚：把一切公之于众、带着秘密进棺材、或者趁现在金盆洗手。每一条，都需要你拿出这些年攒下的全部勇气。',
  choices: [
    {
      label: '公开——让两个世界合为一体',
      outcomes: [
        // 常规层：暴露后身败名裂
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 25;
            s.attrs.魅力 -= 10;
          },
          result: '你公开了一切。但两个世界的碰撞不是融合，是爆炸——同事震惊、朋友疏远、家人沉默。你站在废墟中央，忽然意识到：有些事，分开存在是有原因的。',
        },
        // 反转层：意外地被理解和接纳
        {
          weight: 15,
          condition: { attrGte: { 魅力: 65 } },
          apply: (s) => {
            s.attrs.快乐 += 15;
            s.attrs.魅力 += 10;
          },
          result: '你做好了最坏的准备，但出乎意料——人们没有你想象中那么苛刻。有人震惊，也有人理解。你第一次以完整的自己站在阳光下，感觉像卸下了一座山。',
        },
      ],
    },
    {
      label: '永远隐藏——把秘密带进坟墓',
      outcomes: [
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 8;
            s.attrs.快乐 -= 10;
          },
          result: '你选择把暗面的自己永远埋葬。没有人会知道，你曾拥有过另一个完整的灵魂。你带着这个秘密老去——它越来越重，但也越来越深地，成了只属于你一个人的东西。',
        },
        {
          weight: 20,
          condition: { attrGte: { 智力: 70 } },
          apply: (s) => {
            s.attrs.智力 += 10;
            s.attrs.快乐 += 5;
          },
          result: '你不仅隐藏，还把两个身份留下的东西——人脉、资源、情报——编织成了一张谁也看不见的网。你以一种别人永远看不懂的方式，在这个世界上留下了痕迹。',
        },
      ],
    },
    {
      label: '金盆洗手——趁现在还来得及',
      outcomes: [
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 15;
            s.attrs.魅力 += 5;
            s.attrs.智力 += 3;
          },
          result: '你删掉了一切，注销了账号，退出了所有频道。那扇门在你身后缓缓关上。你回到"正常人"的生活里，开始学着不再回头看——而那些年在暗面学到的东西，成了你心里最锋利的底气。',
        },
        {
          weight: 25,
          condition: { all: [
            { attrGte: { 魅力: 60 } },
            { attrGte: { 快乐: 45 } },
          ]},
          apply: (s) => {
            s.attrs.魅力 += 10;
            s.attrs.快乐 += 15;
            s.attrs.智力 += 5;
          },
          result: '你金盆洗手了，但那些年的双面经历没有白费——它教会了你洞察人心、驾驭复杂、在压力下保持冷静。你成了一个表面平凡、内里深不可测的人。两个世界的精华，都被你收进了同一具身体里。',
        },
      ],
    },
  ],
};

export const doubleLifeChainEvents: GameEvent[] = [
  foreshadowDoubleLifePortal,
  doubleLifeChoice,
  doubleLifeBalance,
  doubleLifeSuspicion,
  doubleLifeReckoning,
];
