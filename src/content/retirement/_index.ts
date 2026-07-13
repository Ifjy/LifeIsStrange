// src/content/retirement/_index.ts
import type { GameEvent } from '../../engine/types';

export const retirementEvents: GameEvent[] = [
  // 1. 退休 — 61-62 岁 (transcribed from brief)
  {
    id: 'retirement_pension',
    stage: 'retirement', ageRange: [61, 62], once: true,
    trigger: { baseWeight: 10 },
    text: '你正式退休了。',
    choices: [
      { label: '继续', outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 10; s.flags.add('milestone_retired'); },
        result: '你开始享受退休生活。',
      }]},
      {
        label: '养老金被骗',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 15; s.attrs.快乐 -= 8; s.flags.add('milestone_retired'); s.flags.add('choice_pension_fraud'); },
          followUp: 'pension_fraud_aftermath',
          result: '一个"理财顾问"推荐了年化 15% 的"养老专项基金"，你把养老金全投了进去。第二个月，对方联系不上了。',
        }],
      },
    ],
  },

  // 2. 回望一生 — 70-80 岁 (authored, reflective callback)
  {
    id: 'retirement_legacy',
    stage: 'retirement', ageRange: [70, 80], once: true,
    trigger: { baseWeight: 7 },
    text: '一个阳光很好的下午，你坐在阳台上晒太阳，忽然想起很多事。',
    choices: [{ label: '回忆一生', outcomes: [
      // 富有版本
      {
        weight: 100,
        condition: { flag: 'milestone_house_owner' },
        apply: (s) => { s.attrs.快乐 += 8; s.flags.add('achievement_reflected'); },
        result: '你看着这套属于自己的房子，心想：这辈子至少没白忙。',
      },
      // 成家版本
      {
        weight: 100,
        condition: { flag: 'milestone_family' },
        apply: (s) => { s.attrs.快乐 += 10; s.flags.add('achievement_reflected'); },
        result: '孙辈在客厅嬉闹，你眯着眼笑。吵是吵了点，但热闹。',
      },
      // 丁克/已婚无子版本
      {
        weight: 100,
        condition: { flag: 'milestone_married' },
        apply: (s) => { s.attrs.快乐 += 6; s.flags.add('achievement_reflected'); },
        result: '老伴递来一杯茶。这么多年，你们依然聊得来。',
      },
      // 单身版本
      {
        weight: 100,
        condition: { flag: 'choice_stay_single' },
        apply: (s) => { s.attrs.快乐 += 4; s.attrs.智力 += 2; s.flags.add('achievement_reflected'); },
        result: '你翻开旧日记，独自行过的山川一一浮现。一个人也挺浪漫。',
      },
      // 大厂/科技职业版本
      {
        weight: 100,
        condition: { flag: 'milestone_first_job_tech' },
        apply: (s) => { s.attrs.智力 += 3; s.flags.add('achievement_reflected'); },
        result: '你想起当年深夜写的代码、上线的大版本——现在那些系统还在跑。',
      },
      // 被裁/失业版本
      {
        weight: 100,
        condition: { flag: 'milestone_fired' },
        apply: (s) => { s.attrs.快乐 += 5; s.flags.add('achievement_reflected'); },
        result: '被裁那天你以为是终点，原来只是拐了个弯。',
      },
      // 兜底版本
      {
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.快乐 += 3; s.flags.add('achievement_reflected'); },
        result: '一生说长不长，说短不短。你闭上眼，阳光很暖。',
      },
    ]}],
  },

  // 3. 退休爱好 — 60-68 岁
  {
    id: 'retirement_hobby',
    stage: 'retirement', ageRange: [60, 68], once: true,
    trigger: { baseWeight: 5 },
    text: '退休日子突然空了一大块。邻居张姐热情地拉你："走啊，广场舞/老年大学/摄影班，挑一个！"',
    choices: [
      {
        label: '去老年大学，重拾年轻时的爱好',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 智力: 40 } },
            apply: (s) => { s.attrs.快乐 += 8; s.attrs.智力 += 3; s.flags.add('choice_senior_college'); },
            result: '你报了书法班，笔墨纸砚一铺开，整个人都沉静下来。同学都叫你"老师"。',
          },
          {
            weight: 100,
            condition: { attrLt: { 智力: 40 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.智力 += 2; },
            result: '你选了智能手机课，终于学会了发朋友圈。儿女点赞点到手软。',
          },
        ],
      },
      {
        label: '加入广场舞队伍',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 6; s.attrs.体质 += 6; },
          result: '每天傍晚六点半，你是队伍里动作最整齐的那个。膝盖反而比退休前还好了。',
        }],
      },
      {
        label: '拿起相机，记录街头巷尾',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 7; s.attrs.魅力 += 3; s.flags.add('choice_photography'); },
          result: '你拍的老城墙根下棋的大爷，居然在社区比赛里拿了奖。',
        }],
      },
      {
        label: '算了，在家歇着吧',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.体质 -= 2; },
          result: '电视从早开到晚，你有时候分不清是午睡还是夜睡。',
        }],
      },
    ],
  },

  // 4. 带孙子 — 62-70 岁
  {
    id: 'retirement_grandchild',
    stage: 'retirement', ageRange: [62, 70], once: true,
    trigger: {
      baseWeight: 6,
      requires: [{ flag: 'milestone_family' }],
    },
    text: '儿女工作忙，把小孙子往你家一放："妈/爸，帮忙带几天！"门一关，小孩开始满地爬。',
    choices: [
      {
        label: '含饴弄孙，享受天伦之乐',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 体质: 40 } },
            apply: (s) => { s.attrs.快乐 += 10; s.attrs.体质 -= 3; s.flags.add('choice_raised_grandchild'); },
            result: '小家伙叫"奶奶/爷爷"的那一刻，你觉得一切都值了。只是腰有点酸。',
          },
          {
            weight: 100,
            condition: { attrLt: { 体质: 40 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.体质 -= 8; },
            result: '孩子精力太旺盛了，你追了两天就犯了腰。但看着他笑，舍不得送走。',
          },
        ],
      },
      {
        label: '婉拒，让儿女自己想办法',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 2; s.attrs.体质 += 5; },
          result: '儿女嘴上抱怨几句，最后请了保姆。你偶尔去看看，反而更亲。',
        }],
      },
    ],
  },

  // 5. 老友聚会 — 65-75 岁
  {
    id: 'retirement_old_friends',
    stage: 'retirement', ageRange: [65, 75], once: true,
    trigger: { baseWeight: 5 },
    text: '手机响了，是几十年前的老同学发的消息："老张走了，趁咱们还凑得齐，见一面吧。"',
    choices: [
      {
        label: '一定去，哪怕路远',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 体质: 35 } },
            apply: (s) => { s.attrs.快乐 += 10; s.attrs.魅力 += 2; s.flags.add('achievement_old_friends'); },
            result: '一桌白发苍苍的人，聊起当年罚站、抄作业、暗恋谁，笑得像少年。临别约好明年再见。',
          },
          {
            weight: 100,
            condition: { attrLt: { 体质: 35 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.体质 -= 3; s.flags.add('achievement_old_friends'); },
            result: '你拖着病体去了。聊得很开心，但回来后在床上躺了三天。值得。',
          },
        ],
      },
      {
        label: '身体不便，发个视频就好',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 4; },
          result: '视频里大家冲你挥手。你挂了电话，对着窗外的夕阳发了很久的呆。',
        }],
      },
    ],
  },

  // 6. 住院 — 70-80 岁
  {
    id: 'retirement_hospital',
    stage: 'retirement', ageRange: [70, 80], once: true,
    trigger: { baseWeight: 4 },
    text: '体检报告出来，医生推了推眼镜："这个指标不太好，建议住院查一查。"走廊的消毒水味让你心里发紧。',
    choices: [
      {
        label: '听医生的，住院治疗',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 财富: 40 } },
            apply: (s) => { s.attrs.体质 += 8; s.attrs.财富 -= 15; s.attrs.快乐 -= 3; s.flags.add('choice_hospitalized'); },
            result: '请了专家会诊，治疗效果不错。你暗暗庆幸年轻时没全花光。',
          },
          {
            weight: 100,
            condition: { attrLt: { 财富: 40 } },
            apply: (s) => { s.attrs.体质 -= 5; s.attrs.财富 -= 8; s.attrs.快乐 -= 6; s.flags.add('choice_hospitalized'); },
            result: '公立医院排了长长的队，你拖着一身病痛等了三天。所幸最后还是住进去了。',
          },
        ],
      },
      {
        label: '开点药回家养着',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 体质: 50 } },
            apply: (s) => { s.attrs.体质 -= 3; s.attrs.快乐 += 2; },
            result: '底子还在，回家按时吃药、散步，指标居然慢慢稳住了。',
          },
          {
            weight: 100,
            condition: { attrLt: { 体质: 50 } },
            apply: (s) => { s.attrs.体质 -= 10; s.attrs.快乐 -= 4; },
            result: '回家后病反复发作，儿女隔三差五请假陪你去急诊。你有点内疚。',
          },
        ],
      },
    ],
  },

  // 7. 黄昏恋 / 丧偶之痛 — 68-78 岁
  {
    id: 'retirement_late_love',
    stage: 'retirement', ageRange: [68, 78], once: true,
    trigger: {
      baseWeight: 4,
      requires: [{ flag: 'milestone_married' }],
      excludes: ['choice_stay_single'],
    },
    text: '老伴走了几年了。那天你在公园发呆，跳交谊舞的李阿姨凑过来："老哥哥/老姐姐，给你介绍个伴儿呗？"',
    choices: [
      {
        label: '见一面，给自己一个机会',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 魅力: 40 } },
            apply: (s) => { s.attrs.快乐 += 12; s.attrs.魅力 += 3; s.flags.add('choice_late_love'); },
            result: '对方也丧偶多年，聊得格外投缘。你们没领证，但每天一起买菜散步，日子又有了颜色。',
          },
          {
            weight: 100,
            condition: { attrLt: { 魅力: 40 } },
            apply: (s) => { s.attrs.快乐 += 4; },
            result: '见是见了，但话不投机。你礼貌地告别，回家给老伴的遗像前换了杯茶。',
          },
        ],
      },
      {
        label: '不了，我心里装不下别人',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 快乐: 40 } },
            apply: (s) => { s.attrs.快乐 += 3; s.attrs.智力 += 2; },
            result: '你把日子过成了一个人的仪式感：浇花、写信、整理旧照片。孤独，但不寂寞。',
          },
          {
            weight: 100,
            condition: { attrLt: { 快乐: 40 } },
            apply: (s) => { s.attrs.快乐 -= 8; s.attrs.体质 -= 3; },
            result: '夜里翻来覆去，伸手摸到身侧冰凉的空床。你把老伴的睡衣抱在怀里，哭了很久。',
          },
        ],
      },
    ],
  },

  // 8. 养老院抉择 — 78-88 岁
  {
    id: 'retirement_nursing_home',
    stage: 'retirement', ageRange: [78, 88], once: true,
    trigger: { baseWeight: 4 },
    text: '儿女把你叫到一起，表情有点为难："妈/爸，您一个人在家我们不放心……要不要考虑养老院？"',
    choices: [
      {
        label: '我自己拿主意——去考察一下',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 智力: 50 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.智力 += 2; s.flags.add('choice_nursing_home'); },
            result: '你跑了好几家，最后选了个能养猫、有书画室的。"自愿入住，随时回家"，合同上写得清清楚楚。',
          },
          {
            weight: 100,
            condition: { attrLt: { 智力: 50 } },
            apply: (s) => { s.attrs.快乐 -= 2; s.flags.add('choice_nursing_home'); },
            result: '你不太懂合同条款，被销售忽悠签了名。住进去才发现条件一般，但孩子们总算松了口气。',
          },
        ],
      },
      {
        label: '我哪儿也不去，死也要死在自己家',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 体质: 40 } },
            apply: (s) => { s.attrs.快乐 += 6; s.attrs.魅力 += 2; },
            result: '你把家政阿姨请到家里，每天还能自己下楼买菜。邻居都说你硬朗。',
          },
          {
            weight: 100,
            condition: { attrLt: { 体质: 40 } },
            apply: (s) => { s.attrs.快乐 -= 4; s.attrs.体质 -= 5; },
            result: '在家摔了一跤，躺了半天才被邻居发现。儿女红着眼把你送进了医院。',
          },
        ],
      },
      {
        label: '听儿女的安排吧',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.体质 += 3; s.flags.add('choice_nursing_home'); },
          result: '养老院有护工、有食堂，但你总坐在窗边看外面的树。孩子们周末有时来，有时不来。',
        }],
      },
    ],
  },

  // 9. 孙辈教育理念冲突 — 65-75 岁 (Task 8 #9)
  {
    id: 'retirement_grandchild_debate',
    stage: 'retirement', ageRange: [65, 75], once: true,
    trigger: { baseWeight: 4 },
    text: '你看着孙子写作业到十一点，忍不住说：「孩子这么小，逼这么紧干嘛？」儿媳/女婿脸色一沉：「妈/爸，现在的竞争您不懂。」',
    choices: [
      {
        label: '坚持干预，孩子不能这么养',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.魅力 -= 2; },
          result: '一场家庭冷战开始了。你觉得自己是对的，但孩子不再让你接送孙子了。',
        }],
      },
      {
        label: '尊重年轻人，他们有他们的道理',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; s.attrs.魅力 += 2; },
          result: '你把想说的话咽了回去。后来儿媳/女婿主动跟你道谢：「谢谢您理解我们。」',
        }],
      },
    ],
  },

  // 10. 老年大学 — 62-72 岁 (Task 8 #10)
  {
    id: 'retirement_elder_college',
    stage: 'retirement', ageRange: [62, 72], once: true,
    trigger: { baseWeight: 4 },
    text: '社区开了老年大学，课程表花花绿绿：书法、国画、智能手机、英语口语、太极……老伴说：「一起去报个班？」',
    choices: [
      {
        label: '报名，活到老学到老',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 += 5; s.attrs.魅力 += 2; s.flags.add('choice_elder_college'); },
          result: '你认识了一群有趣的老人。期末作品展，你的书法被挂在了走廊最显眼的位置。',
        }],
      },
      {
        label: '一个人待着更自在',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 2; },
          result: '你在家翻了几本书，看了几部老电影。日子安静，但有时安静得有点空。',
        }],
      },
    ],
  },

  // 11. 老友离世 — 68-80 岁 (Task 8 #11)
  {
    id: 'retirement_friend_passing',
    stage: 'retirement', ageRange: [68, 80], once: true,
    trigger: { baseWeight: 4 },
    text: '老朋友走了。你们认识五十年了，从穿开裆裤一起玩到拄着拐杖一起下棋。追悼会上你对着遗像鞠了三个躬。',
    choices: [
      {
        label: '人总要往前看，好好活着',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; s.attrs.智力 += 2; },
          result: '你整理了他的遗物，留了一张合照。每年的那天你会去看他，带他爱喝的酒。',
        }],
      },
      {
        label: '走不出来，整天发呆',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 5; s.attrs.体质 -= 3; },
          result: '你不再去公园那个棋摊了。孩子们劝你出去走走，你说「再等等」，一等就是半年。',
        }],
      },
    ],
  },

  // 12. 遗嘱 / 遗产分配 — 72-85 岁 (Task 8 #12)
  {
    id: 'retirement_will',
    stage: 'retirement', ageRange: [72, 85], once: true,
    trigger: { baseWeight: 4 },
    text: '律师坐在你家客厅，把文件铺开：「您这个年纪，立个遗嘱是对家人的负责。」你看着儿女们的照片陷入沉思。',
    choices: [
      {
        label: '公平分配，一人一份',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; },
          result: '遗嘱写完了，你心里一块石头落了地。不管以后怎样，至少不会让孩子们伤了和气。',
        }],
      },
      {
        label: '偏心那个过得最不好的',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.财富 -= 5; },
          result: '你多留了一份给小儿子——他生意失败后一直没翻身。但你怕其他孩子知道后寒心。',
        }],
      },
    ],
  },
];
