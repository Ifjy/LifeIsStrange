// src/content/college/_index.ts
import type { GameEvent } from '../../engine/types';

export const collegeEvents: GameEvent[] = [
  // 1. 社团加入 — 19-21 岁
  {
    id: 'college_club_join',
    stage: 'college', ageRange: [19, 21], once: true,
    trigger: { baseWeight: 5 },
    text: '社团招新摊位一字排开，学长学姐们吆喝得热火朝天。',
    choices: [
      {
        label: '加入辩论社',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.skills.软 += 8; s.attrs.快乐 += 3; },
          result: '你学会了在台上不结巴地说话，还能引经据典。',
        }],
      },
      {
        label: '加入编程社',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.skills.硬 += 8; s.attrs.快乐 += 3; },
          result: '你第一次跑通了 Hello World，激动得发朋友圈。',
        }],
      },
      {
        label: '都不感兴趣，回宿舍躺着',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.skills.摸 += 5; s.attrs.快乐 += 2; },
          result: '你成了宿舍公认的睡神。',
        }],
      },
    ],
  },

  // 2. 实习 — 20-22 岁
  {
    id: 'college_internship',
    stage: 'college', ageRange: [20, 22], once: true,
    trigger: { baseWeight: 6 },
    text: '同学们都在找实习，你也投了几份简历。终于有一家让你去面试了。',
    choices: [
      {
        label: '认真准备，拿个 offer',
        outcomes: [
          {
            weight: 60,
            condition: { attrGte: { 智力: 50 } },
            apply: (s) => { s.attrs.财富 += 8; s.skills.硬 += 5; s.attrs.快乐 += 3; },
            result: '实习三个月，你拿到了第一笔像样的工资。',
          },
          {
            weight: 40,
            condition: { attrLt: { 智力: 50 } },
            apply: (s) => { s.attrs.财富 += 3; s.attrs.快乐 -= 2; },
            result: '实习主要是打杂，但你至少混了份简历。',
          },
        ],
      },
      {
        label: '水一个就好',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.skills.摸 += 5; s.attrs.财富 += 2; },
          result: '你在实习公司摸鱼三个月，学到了如何装忙。',
        }],
      },
    ],
  },

  // 3. 初恋 — 19-22 岁
  {
    id: 'college_first_love',
    stage: 'college', ageRange: [19, 22], once: true,
    trigger: { baseWeight: 5 },
    text: '图书馆里那个总坐窗边的人，今天忽然对你笑了一下。',
    choices: [
      {
        label: '主动搭讪',
        outcomes: [
          {
            weight: 60,
            condition: { attrGte: { 魅力: 40 } },
            apply: (s) => { s.attrs.快乐 += 10; s.attrs.魅力 += 5; s.flags.add('milestone_first_love'); },
            result: '你们开始一起上自习、一起吃食堂。大学有了甜味。',
          },
          {
            weight: 40,
            condition: { attrLt: { 魅力: 40 } },
            apply: (s) => { s.attrs.快乐 -= 3; s.attrs.魅力 += 2; },
            result: '对方礼貌地笑了一下，然后换了个座位。心痛。',
          },
        ],
      },
      {
        label: '暗恋就好',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; s.attrs.魅力 += 1; },
          result: '你每天去图书馆，只为那一个笑容。',
        }],
      },
    ],
  },

  // 4. 求职 — 22 岁 (transcribed from brief)
  {
    id: 'college_first_job_hunt',
    stage: 'college', ageRange: [22, 22], once: true,
    trigger: { baseWeight: 10 },
    text: '毕业季到了，你开始找工作。',
    choices: [
      {
        label: '去大厂卷',
        outcomes: [{
          weight: 100,
          condition: { attrGte: { 智力: 60 } },
          apply: (s) => {
            s.flags.add('milestone_has_job');
            s.flags.add('milestone_first_job_tech');
            s.attrs.财富 += 15;
            s.attrs.体质 -= 10;
            s.attrs.快乐 -= 5;
          },
          result: '你拿到了大厂 offer，入职第一天就开始 996。',
        }],
      },
      {
        label: '找份轻松的工作',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => {
            s.flags.add('milestone_has_job');
            s.attrs.财富 += 5;
            s.attrs.快乐 += 5;
          },
          result: '你进了一家小公司，朝九晚五。',
        }],
      },
    ],
  },

  // 5. 挂科 — 19-22 岁
  {
    id: 'college_failed_course',
    stage: 'college', ageRange: [19, 22], once: true,
    trigger: { baseWeight: 4 },
    text: '期末成绩出来了，教务系统刷新了三遍——高等数学那一栏，赫然写着"不及格"。',
    choices: [
      {
        label: '暑假狂补，准备补考',
        outcomes: [
          {
            weight: 60,
            condition: { attrGte: { 智力: 40 } },
            apply: (s) => { s.attrs.智力 += 5; s.attrs.快乐 -= 3; s.attrs.体质 -= 2; },
            result: '你把自己关在图书馆整个暑假，补考踩线过了。这滋味你不想再来一次。',
          },
          {
            weight: 40,
            condition: { attrLt: { 智力: 40 } },
            apply: (s) => { s.attrs.智力 += 2; s.attrs.快乐 -= 8; s.attrs.体质 -= 4; },
            result: '你补考还是没过，只能重修。学分少了，压力更大了。',
          },
        ],
      },
      {
        label: '找老师求情，看能不能通融',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 2; s.attrs.魅力 += 3; s.skills.软 += 4; },
          result: '老师没给你改分，但指点你写了一篇小论文加分。你学会了"曲线救国"。',
        }],
      },
    ],
  },

  // 6. 室友冲突 — 18-21 岁
  {
    id: 'college_roommate_conflict',
    stage: 'college', ageRange: [18, 21], once: true,
    trigger: { baseWeight: 5 },
    text: '凌晨两点，对面床铺的键盘声和队友语音还在炸响。你已经第三次把枕头压过头顶了。',
    choices: [
      {
        label: '直接开口：能不能安静点',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 魅力: 35 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.魅力 += 3; s.attrs.体质 += 5; },
            result: '室友有点尴尬，连忙道歉并换了静音鼠标。你们后来处得不错。',
          },
          {
            weight: 50,
            condition: { attrLt: { 魅力: 35 } },
            apply: (s) => { s.attrs.快乐 -= 5; s.attrs.体质 -= 3; },
            result: '室友嘴上答应，第二天照旧。你们冷战了整整一个学期。',
          },
        ],
      },
      {
        label: '忍，买个耳塞和眼罩',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.智力 += 2; s.attrs.财富 -= 2; },
          result: '你成了耳塞十级学者。睡眠质量勉强保住了，但心里那口气一直咽不下去。',
        }],
      },
      {
        label: '申请换宿舍',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; s.attrs.智力 += 2; s.attrs.财富 -= 3; s.skills.软 += 3; },
          result: '折腾了两周，你搬到了一个安静的宿舍。新室友是个学霸，你们互不打扰。',
        }],
      },
    ],
  },

  // 7. 兼职 — 19-21 岁
  {
    id: 'college_part_time_job',
    stage: 'college', ageRange: [19, 21], once: true,
    trigger: { baseWeight: 4 },
    text: '室友在奶茶店做兼职，一周三天，月入两千。他晃着手机里的工资截图：「要不要也来？」',
    choices: [
      {
        label: '一起做兼职，赚点零花钱',
        outcomes: [
          {
            weight: 60,
            condition: { attrGte: { 体质: 35 } },
            apply: (s) => { s.attrs.财富 += 8; s.attrs.快乐 += 3; s.attrs.智力 -= 2; s.attrs.体质 -= 3; },
            result: '你站了三个月柜台，学会了几十种配方，还攒下了一笔像样的存款。',
          },
          {
            weight: 40,
            condition: { attrLt: { 体质: 35 } },
            apply: (s) => { s.attrs.财富 += 4; s.attrs.快乐 -= 4; s.attrs.体质 -= 5; },
            result: '兼职太累了，你的课也开始打瞌睡。两个月后你辞了职，钱没赚多少，人先废了。',
          },
        ],
      },
      {
        label: '把时间用在学习上',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 5; s.attrs.快乐 += 2; },
          result: '你把别人兼职的时间泡在了图书馆。期末排名往前窜了几位。',
        }],
      },
    ],
  },

  // 8. 分手 — 20-22 岁
  {
    id: 'college_breakup',
    stage: 'college', ageRange: [20, 22], once: true,
    trigger: { baseWeight: 4 },
    text: '恋人忽然发来一条微信：「我们冷静一段时间吧。」你盯着屏幕，食堂的嘈杂声一下子远了。',
    choices: [
      {
        label: '去找TA，想把话说清楚',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 魅力: 45 } },
            apply: (s) => { s.attrs.快乐 += 3; s.attrs.魅力 += 3; s.flags.add('choice_saved_relationship'); },
            result: '你们聊了一整夜，把积累的别扭都说开了。关系比以前更近了一步。',
          },
          {
            weight: 50,
            condition: { attrLt: { 魅力: 45 } },
            apply: (s) => { s.attrs.快乐 -= 10; s.attrs.智力 += 3; },
            result: 'TA态度坚决。你在操场上坐到天亮，第一次明白有些事不是努力就有用的。',
          },
        ],
      },
      {
        label: '尊重TA的决定，体面地放手',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 6; s.attrs.智力 += 4; s.attrs.体质 -= 2; },
          result: '你把TA送的东西收进箱子里。失恋的头一周你瘦了三斤，但你没纠缠。',
        }],
      },
      {
        label: '疯狂打游戏，假装不在意',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 8; s.attrs.智力 -= 2; s.attrs.体质 -= 4; s.skills.摸 += 5; },
          result: '你连续通宵了一周。游戏段位是上去了，但成绩和心情一起跌到了谷底。',
        }],
      },
    ],
  },

  // 9. 考研 — 21-22 岁
  {
    id: 'college_grad_school',
    stage: 'college', ageRange: [21, 22], once: true,
    trigger: { baseWeight: 6 },
    text: '自习室里一半的人桌上都摞着考研资料。室友问你：「你不考吗？现在本科不好找工作。」',
    choices: [
      {
        label: '加入考研大军',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 智力: 55 } },
            apply: (s) => { s.attrs.智力 += 8; s.attrs.快乐 -= 4; s.attrs.体质 -= 5; s.flags.add('choice_grad_school'); },
            result: '你每天学到图书馆闭馆。虽然累，但你感觉自己在朝着一个明确的方向走。',
          },
          {
            weight: 50,
            condition: { attrLt: { 智力: 55 } },
            apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 -= 7; s.attrs.体质 -= 6; },
            result: '你坚持了半年，最终因为基础太弱没考上。但你学会了"为目标拼一次"是什么感觉。',
          },
        ],
      },
      {
        label: '直接找工作，积累经验',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 += 5; s.skills.硬 += 4; s.attrs.快乐 += 2; },
          result: '你开始投简历跑面试。虽然起薪不高，但你比同龄人早两年进入社会。',
        }],
      },
      {
        label: 'gap一年，想清楚再说',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 += 4; s.attrs.财富 -= 3; },
          result: '你花了一年读书、旅行、发呆。家人不理解，但你想清楚了自己到底想要什么。',
        }],
      },
    ],
  },

  // 10. 创业尝试 — 20-22 岁
  {
    id: 'college_startup_try',
    stage: 'college', ageRange: [20, 22], once: true,
    trigger: { baseWeight: 3 },
    text: '你和两个同学想到一个 App 点子，越聊越兴奋：「就差一个程序员了——等等，你不就会写代码吗？」',
    choices: [
      {
        label: '干！大学生创业正当时',
        outcomes: [
          {
            weight: 40,
            condition: { attrGte: { 智力: 50 } },
            apply: (s) => { s.attrs.财富 += 6; s.attrs.快乐 += 6; s.attrs.智力 += 4; s.skills.硬 += 5; s.flags.add('choice_college_startup'); },
            result: '你们做了个 MVP，居然真拿到了天使轮。虽然公司后来黄了，但简历上这行字值千金。',
          },
          {
            weight: 60,
            condition: { attrLt: { 智力: 50 } },
            apply: (s) => { s.attrs.财富 -= 5; s.attrs.快乐 -= 4; s.attrs.智力 += 3; s.attrs.体质 -= 4; },
            result: '三个月后团队因为方向分歧散伙了。你亏了几千块，但第一次知道创业不是请客吃饭。',
          },
        ],
      },
      {
        label: '还是先把书读好',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 4; s.attrs.快乐 += 2; },
          result: '你拒绝了邀请。后来那个 App 真的没做起来，你暗暗松了口气。',
        }],
      },
    ],
  },
];
