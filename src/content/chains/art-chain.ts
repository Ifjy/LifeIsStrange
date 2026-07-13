// src/content/chains/art-chain.ts
import type { GameEvent } from '../../engine/types';

// 铺垫事件：灵感迸发的一刻
// stage=school，ageRange 15-22
const foreshadowArtSpark: GameEvent = {
  id: 'foreshadow_art_spark',
  stage: 'school',
  ageRange: [15, 22],
  once: true,
  trigger: {
    baseWeight: 2,
  },
  text: '某个毫无征兆的瞬间，你脑子里"嗡"地响了一下——可能是一段旋律、一个画面、或者一个忽然成形的故事。你手在发抖，心跳得厉害，像被什么东西击中。这种感觉，你以前从来没有过。',
  choices: [
    {
      label: '赶紧记下来，怕忘了',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.flags.add('foreshadow_art_spark');
          s.attrs.智力 += 2;
          s.attrs.快乐 += 3;
        },
        result: '你抓起笔，在课本背面写了一整页。字迹潦草，但你看着它，觉得这是你写过最重要的东西。那道光，你记住了。',
      }],
    },
    {
      label: '一阵风而已，别想多了',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 1; },
        result: '你摇摇头，把那个念头甩掉了。可能只是走神吧。但那天晚上，你做了一个特别长的梦。',
      }],
    },
  ],
};

// 入口事件：抛弃一切去追创作
// stage=college，ageRange 20-28
// 三层 outcome（常规/反转/罕见反转）
const artAllIn: GameEvent = {
  id: 'art_all_in',
  stage: 'college',
  ageRange: [20, 28],
  once: true,
  trigger: {
    baseWeight: 4,
  },
  text: '你坐在教室/工位上，盯着眼前的课本/报表，脑子里却是另一个世界。那个在你心里憋了多年的东西，越来越大、越来越清晰，像一头不肯安分的野兽。你知道，如果现在不放它出来，它会被你一起带进坟墓里。',
  choices: [
    {
      label: '豁出去了，全职搞创作',
      outcomes: [
        // 常规层：辞职/辍学，投身创作
        {
          weight: 45,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.快乐 += 10;
            s.attrs.财富 -= 15;
            s.flags.add('milestone_art');
          },
          result: '你交了辞职信。走出大楼时阳光刺眼，你觉得自己终于活了。',
        },
        // 反转层：理想丰满现实骨感
        {
          weight: 20,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.体质 -= 10;
            s.attrs.财富 -= 20;
            s.flags.add('milestone_art');
          },
          result: '理想很丰满，现实很骨感。你开始一天只吃一顿。',
        },
        // 罕见反转层：看到了别人看不到的东西
        {
          weight: 5,
          condition: { all: [
            { attrGte: { 智力: 70 } },
            { flag: 'foreshadow_art_spark' },
          ]},
          apply: (s) => {
            s.attrs.智力 += 10;
            s.attrs.快乐 += 15;
            s.flags.add('milestone_art');
            s.flags.add('twist_art_vision');
          },
          result: '你看到了别人看不到的东西。手在发抖，但方向无比清晰。',
        },
      ],
    },
    {
      label: '还是先找个稳当的工作',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 -= 3; },
        result: '你叹了口气，把那个念头压回去了。日子还得过，梦想这种东西，等有钱了再说吧。',
      }],
    },
  ],
};

// 分支1：创作瓶颈 + 生计艰难
// stage=career，ageRange 25-35，requires milestone_art
const artStruggle: GameEvent = {
  id: 'art_struggle',
  stage: 'career',
  ageRange: [25, 35],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_art' }],
  },
  text: '三年了。你写过的稿子堆成了山，投出去的邮件像石沉大海。房租催了第三次，泡面箱已经空了。最可怕的不是穷——是你开始怀疑，当初那个"看到了别人看不到的东西"的自己，是不是只是自欺欺人。',
  choices: [
    {
      label: '咬牙挺住，继续写',
      outcomes: [
        // 常规层
        {
          weight: 55,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 3;
            s.attrs.财富 -= 10;
            s.attrs.快乐 -= 5;
          },
          result: '你咬着牙，又写了一个通宵。窗外的天亮了，你看着新写的几页，说不清是希望还是自我欺骗。',
        },
        // 反转层：穷得快活不下去
        {
          weight: 20,
          condition: { attrLt: { 财富: 25 } },
          apply: (s) => {
            s.attrs.财富 -= 15;
            s.attrs.体质 -= 8;
            s.attrs.快乐 -= 10;
          },
          result: '你交不起房租了，搬进了地下室。潮湿的墙、老鼠的声音、永远晾不干的衣服。你开始怀疑自己是不是选错了。',
        },
      ],
    },
    {
      label: '先接点商业活糊口',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 10;
            s.attrs.快乐 -= 8;
          },
          result: '你开始接软文、广告稿、代笔。钱回来了一点，但每写一个字，都觉得是在浪费生命。',
        },
        {
          weight: 25,
          condition: { attrGte: { 智力: 50 } },
          apply: (s) => {
            s.attrs.财富 += 15;
            s.attrs.智力 += 3;
            s.flags.add('choice_art_commercial');
          },
          result: '你在商业活里磨出了手艺。节奏、结构、读者的点——你开始懂了。不算艺术，但不算白费。',
        },
      ],
    },
  ],
};

// 分支2：突破 or 崩溃的分水岭
// stage=career，ageRange 30-45，requires milestone_art
// 关键分支：突破设置 twist_art_breakthrough（S 级结局依赖）
const artCrossroad: GameEvent = {
  id: 'art_crossroad',
  stage: 'career',
  ageRange: [30, 45],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_art' }],
  },
  text: '到了某个临界点。你写的那个东西，要么在这几年里炸开，要么就永远埋在这间出租屋里。你盯着屏幕，一个字也敲不出来，又好像每个字都在往外涌。这一关，过去了就是另一片天，过不去——你这辈子大概就这样了。',
  choices: [
    {
      label: '死磕到底，等那个突破',
      outcomes: [
        // 常规层：漫长的等待后，一丝光
        {
          weight: 45,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.体质 -= 8;
            s.attrs.快乐 -= 5;
          },
          result: '你把自己关了三个月。写废的稿子比完稿还多。但某天凌晨，你忽然找到了那个"对"的感觉——像拼图的最后一块。还不够，但你知道方向对了。',
        },
        // 反转层：身体先扛不住
        {
          weight: 20,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.体质 -= 15;
            s.attrs.财富 -= 10;
            s.attrs.快乐 -= 10;
          },
          result: '你的身体先崩溃了。颈椎、眼睛、手腕、胃——一样一样地出问题。医生说不能再这样了，但你看着未完成的稿子，停不下来。',
        },
        // 突破层：设置了 twist_art_breakthrough
        {
          weight: 15,
          condition: { attrGte: { 智力: 60 } },
          apply: (s) => {
            s.attrs.智力 += 10;
            s.attrs.快乐 += 10;
            s.flags.add('twist_art_breakthrough');
          },
          result: '你找到了。就是它。那个你在心里追了十年的东西，在这一刻完全成形。你边哭边写，手停不下来——你终于写出了只有你能写的东西。',
        },
      ],
    },
    {
      label: '认了吧，回头是岸',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 += 5;
            s.attrs.财富 += 10;
            s.flags.add('choice_art_giveup');
          },
          result: '你把稿子收进了抽屉，开始老老实实找工作。日子好过了，但每天夜里，那个没写完的故事还在脑子里转。',
        },
        {
          weight: 25,
          condition: { attrLt: { 体质: 25 } },
          apply: (s) => {
            s.attrs.体质 -= 10;
            s.attrs.快乐 -= 15;
            s.flags.add('choice_art_giveup');
          },
          result: '你不是主动放弃的——是身体和现实替你做的决定。你把稿子收起来那天，哭了一整晚。那不只是一篇稿子，那是你以为自己能活成的样子。',
        },
      ],
    },
  ],
};

// 分支3：传世之作 / 江郎才尽 / 燃尽（finale）
// stage=career，ageRange 40-65，requires milestone_art
const artLegacy: GameEvent = {
  id: 'art_legacy',
  stage: 'career',
  ageRange: [40, 65],
  once: true,
  trigger: {
    baseWeight: 3,
    requires: [{ flag: 'milestone_art' }],
  },
  text: '回头看，搞创作这件事，你已经做了大半辈子。写过最好的东西，也写过最烂的东西；被人夸过，也被人骂得狗血淋头。现在的问题是：你这一辈子，到底能留下什么？',
  choices: [
    {
      label: '把毕生所悟写进一部作品',
      outcomes: [
        // 常规层
        {
          weight: 50,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.智力 += 5;
            s.attrs.体质 -= 10;
            s.attrs.财富 -= 10;
          },
          result: '你开始写那部"大作品"。写得很慢，因为你知道这可能是最后一次了。每个字都像在跟自己告别。',
        },
        // 反转层：江郎才尽
        {
          weight: 20,
          condition: { attrLt: { 智力: 50 } },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.attrs.体质 -= 5;
          },
          result: '你写了三万字，删了两万八。你发现自己写不出来了——那个曾经追着灵感跑的你，已经追不动了。江郎才尽，原来不是一瞬间的事，是慢慢发生的。',
        },
        // 罕见反转层：传世之作（需要突破 flag）
        {
          weight: 15,
          condition: { all: [
            { attrGte: { 智力: 65 } },
            { flag: 'twist_art_breakthrough' },
          ]},
          apply: (s) => {
            s.attrs.智力 += 15;
            s.attrs.快乐 += 20;
            s.attrs.体质 -= 15;
          },
          result: '你写完了。你知道这不一样——这部东西，比你以前写的所有都好。不是技巧好，是里面有你这一辈子的血。寄出去那天，你的手一直在抖。',
        },
      ],
    },
    {
      label: '身体撑不住了，该停了',
      outcomes: [
        {
          weight: 60,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.体质 -= 10;
            s.attrs.快乐 -= 5;
          },
          result: '你把笔放下了。不是因为写完了，是因为身体告诉你：再写下去，人就要没了。你看着满屋子的稿纸，说不清是释然还是遗憾。',
        },
        {
          weight: 25,
          condition: { attrLt: { 体质: 20 } },
          apply: (s) => {
            s.attrs.体质 -= 20;
            s.attrs.快乐 -= 15;
          },
          result: '你已经停不下来了。写作成了一种病，不写就难受，写了更难受。你最后一次伏案，是趴在稿子上睡着的——再没醒过来。',
        },
      ],
    },
    {
      label: '回头看，这辈子没白活',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 += 15;
          s.attrs.智力 += 3;
        },
        result: '你把所有的稿子翻出来，从头到尾看了一遍。好的、烂的、半途而废的——每一段都是你。你笑了笑，把它们整整齐齐收好。不管别人怎么看，你没白活这一场。',
      }],
    },
  ],
};

export const artChainEvents: GameEvent[] = [
  foreshadowArtSpark,
  artAllIn,
  artStruggle,
  artCrossroad,
  artLegacy,
];
