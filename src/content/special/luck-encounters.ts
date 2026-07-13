// src/content/special/luck-encounters.ts
import type { GameEvent } from '../../engine/types';

export const luckEncounterEvents: GameEvent[] = [
  {
    id: 'childhood_lost_wallet',
    stage: 'childhood',
    ageRange: [4, 8],
    once: true,
    trigger: { baseWeight: 2 },
    text: '路边有个钱包，鼓鼓的。四下无人，你蹲下来看了看。',
    choices: [
      {
        label: '交给警察叔叔',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 3; s.attrs.快乐 += 2; },
          result: '失主是个和蔼的阿姨，摸着你的头夸你是个好孩子。你心里暖暖的。',
        }],
      },
      {
        label: '偷偷拿走里面的钱',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 -= 1; s.attrs.财富 += 5; },
          result: '你买了好多零食。但那天晚上做噩梦了，总觉得有人在看着你。',
        }],
      },
    ],
  },
  {
    id: 'school_give_seat',
    stage: 'school',
    ageRange: [10, 14],
    once: true,
    trigger: { baseWeight: 2 },
    text: '公交车上挤满了人，一位老人颤颤巍巍地上了车，就站在你旁边。',
    choices: [
      {
        label: '起身让座',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 4; s.attrs.智力 += 2; },
          result: '老人笑着道谢，还教你解了一道你一直不会的数学题。原来他退休前是数学老师。',
        }],
      },
      {
        label: '假装没看见',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: () => {},
          result: '你低着头装睡。到站下车时，心里莫名有点不踏实。',
        }],
      },
    ],
  },
  {
    id: 'school_blind_box',
    stage: 'school',
    ageRange: [12, 16],
    once: true,
    trigger: { baseWeight: 2 },
    text: '校门口小卖部新上了盲盒，十块钱一个，据说有隐藏款。',
    choices: [
      {
        label: '买一个试试手气',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 3; s.attrs.财富 -= 2; },
          result: '拆开一看，是你最喜欢的款式！虽然不是隐藏款，但这种被眷顾的感觉真好。',
        }],
      },
      {
        label: '不浪费钱',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: () => {},
          result: '你看了看价格标签，还是走开了。理性的选择，但似乎少了点什么乐趣。',
        }],
      },
    ],
  },
  {
    id: 'college_umbrella',
    stage: 'college',
    ageRange: [18, 22],
    once: true,
    trigger: { baseWeight: 2 },
    text: '暴雨如注，你在屋檐下躲雨。旁边一个陌生人面露难色，似乎没带伞，正焦急地看着手机。',
    choices: [
      {
        label: '主动问要不要一起撑伞',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 5; s.attrs.魅力 += 2; },
          result: '你们一路聊到地铁站，交换了联系方式。后来这人成了你在学校最好的朋友。',
        }],
      },
      {
        label: '各走各的',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: () => {},
          result: '你冒雨跑回宿舍，淋了个透湿。下次或许可以大胆一点。',
        }],
      },
    ],
  },
  {
    id: 'college_elective',
    stage: 'college',
    ageRange: [19, 23],
    once: true,
    trigger: { baseWeight: 2 },
    text: '选修课上，老师讲到一门你从没接触过的学问。你觉得特别有意思，但深究下去要花不少课外时间。',
    choices: [
      {
        label: '课后去找老师深聊',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 3; s.attrs.智力 += 3; },
          result: '老师眼前一亮，邀请你加入他的课题组。这门学问后来成了你一生的热爱。',
        }],
      },
      {
        label: '听了觉得有意思就行',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 1; },
          result: '你在课上多听了几耳朵，虽然没深入，但偶尔想起觉得挺开眼界的。',
        }],
      },
    ],
  },
  {
    id: 'career_ambulance',
    stage: 'career',
    ageRange: [30, 45],
    once: true,
    trigger: { baseWeight: 2 },
    text: '堵车堵得人心烦。后视镜里闪着蓝灯的救护车在后面按喇叭，旁边的车都没动。',
    choices: [
      {
        label: '打灯让路',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 5; s.attrs.快乐 -= 2; },
          result: '你费了好大劲挤到一边，被加塞了好几辆车。但后视镜里救护车呼啸而过，你知道你做了对的事。',
        }],
      },
      {
        label: '不关我事',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 -= 2; s.attrs.快乐 += 1; },
          result: '你跟着前车纹丝不动。到了公司还在想那辆救护车，心情莫名烦闷了一整天。',
        }],
      },
    ],
  },
  {
    id: 'career_stock_tip',
    stage: 'career',
    ageRange: [28, 40],
    once: true,
    trigger: { baseWeight: 2 },
    text: '茶水间闲聊，同事神秘兮兮地推荐了一只股票，说内部消息，稳赚不赔。',
    choices: [
      {
        label: '少量买点，当作运气投资',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 4; s.attrs.财富 += 5; },
          result: '一个月后这只股票果然涨了一波。你及时止盈，请那位同事吃了顿大餐。',
        }],
      },
      {
        label: '听听就好',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 1; },
          result: '你没买。后来听说确实涨了，但你并不后悔——稳一点没什么不好。',
        }],
      },
    ],
  },
  {
    id: 'retirement_stray_cat',
    stage: 'retirement',
    ageRange: [65, 80],
    once: true,
    trigger: { baseWeight: 2 },
    text: '晨练回来的路上，一只流浪猫蹲在花坛边，瘦得可怜，冲你喵喵叫。',
    choices: [
      {
        label: '回家拿点吃的来喂',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 3; s.attrs.体质 += 2; },
          result: '从此那只猫每天都在老地方等你。为了喂它，你养成了每天散步的习惯，身体反而更硬朗了。',
        }],
      },
      {
        label: '摸摸头走开',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: () => {},
          result: '你蹲下来摸了摸它，叹口气走开了。回家路上，心里一直惦记着那只猫。',
        }],
      },
    ],
  },
];
