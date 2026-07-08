// src/content/career/_index.ts
import type { GameEvent } from '../../engine/types';

export const careerEvents: GameEvent[] = [
  // 1. 首次晋升 — 27-32 岁
  {
    id: 'career_first_promotion',
    stage: 'career', ageRange: [27, 32], once: true,
    trigger: {
      baseWeight: 7,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '领导把你叫到办公室，神秘一笑：「最近表现不错，有个升职的机会……」',
    choices: [
      {
        label: '接受晋升，迎接新挑战',
        outcomes: [
          {
            weight: 60,
            condition: { skillGte: { 硬: 30 } },
            apply: (s) => {
              s.attrs.财富 += 12;
              s.attrs.快乐 += 5;
              s.flags.add('achievement_first_promotion');
            },
            result: '你升了主管，薪水涨了一截，朋友圈晒了 offer letter。',
          },
          {
            weight: 40,
            condition: { skillLt: { 硬: 30 } },
            apply: (s) => {
              s.attrs.财富 += 5;
              s.attrs.体质 -= 5;
              s.attrs.快乐 -= 3;
            },
            result: '升是升了，但新岗位压力山大，你常常加班到深夜。',
          },
        ],
      },
      {
        label: '婉拒，保持生活平衡',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; s.skills.软 += 3; },
          result: '你选择做好手头的事。领导似乎有点失望，但你不后悔。',
        }],
      },
    ],
  },

  // 2. 跳槽 — 28-35 岁
  {
    id: 'career_job_hopping',
    stage: 'career', ageRange: [28, 35], once: true,
    trigger: {
      baseWeight: 6,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '猎头找上门了：「对面公司给你涨 30%，考虑一下？」你心动了一下。',
    choices: [
      {
        label: '跳！换地方继续卷',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 10;
            s.attrs.快乐 += 3;
            s.skills.硬 += 3;
            s.flags.add('choice_job_hop');
          },
          result: '新公司零食柜很丰盛，你愉快地入职了。',
        }],
      },
      {
        label: '留下来，老东家更稳',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; s.attrs.财富 += 3; },
          result: '老板看你没走，年底多发了点奖金。安稳也是一种选择。',
        }],
      },
    ],
  },

  // 3. 结婚 — 28-40 岁 (transcribed from brief)
  {
    id: 'career_marriage',
    stage: 'career', ageRange: [28, 40], once: true,
    trigger: {
      baseWeight: 8,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '你和恋人到了谈婚论嫁的时候。',
    choices: [
      {
        label: '结婚生子',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 财富: 40 } },
            apply: (s) => {
              s.attrs.快乐 += 15;
              s.attrs.财富 -= 20;
              s.flags.add('milestone_family');
              s.flags.add('milestone_married');
            },
            result: '你成家了。',
          },
          {
            weight: 100,
            condition: { attrLt: { 财富: 40 } },
            apply: (s) => { s.attrs.快乐 -= 5; },
            result: '彩礼和房贷让你喘不过气，婚礼只好从简。',
          },
        ],
      },
      {
        label: '丁克',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 10; s.flags.add('milestone_married'); },
          result: '你们选择丁克，享受二人世界。',
        }],
      },
      {
        label: '不结婚',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; s.flags.add('choice_stay_single'); },
          result: '你享受单身生活。',
        }],
      },
    ],
  },

  // 4. 房贷 — 30-45 岁
  {
    id: 'career_house_loan',
    stage: 'career', ageRange: [30, 45], once: true,
    trigger: {
      baseWeight: 6,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '中介带你看了一套房，落地窗、南向、地铁口……但价格也漂亮。你咬着笔杆算账。',
    choices: [
      {
        label: '咬牙买房，背三十年房贷',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 财富: 50 } },
            apply: (s) => {
              s.attrs.财富 -= 15;
              s.attrs.快乐 += 8;
              s.flags.add('milestone_house_owner');
              s.flags.add('choice_buy_house');
            },
            result: '你成了有房一族。每月还款心痛，但推开家门那一刻值了。',
          },
          {
            weight: 100,
            condition: { attrLt: { 财富: 50 } },
            apply: (s) => { s.attrs.快乐 -= 10; s.attrs.财富 -= 10; },
            result: '你硬着头皮贷了三十年，每月工资大半还了房贷。',
          },
        ],
      },
      {
        label: '继续租房，保持自由',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.财富 += 3;
            s.attrs.快乐 += 3;
            s.flags.add('choice_keep_renting');
          },
          result: '你把买房的钱拿去理财，继续做个轻盈的租客。',
        }],
      },
    ],
  },

  // 5. 裁员 — 35-50 岁
  {
    id: 'career_layoff',
    stage: 'career', ageRange: [35, 50], once: true,
    trigger: {
      baseWeight: 5,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '公司传闻要「优化」，HR 约你下周一对一谈话。你心里咯噔一下。',
    choices: [{ label: '继续', outcomes: [
      {
        weight: 50,
        condition: { skillGte: { 硬: 40 } },
        apply: (s) => { s.attrs.快乐 += 3; s.attrs.财富 += 5; },
        result: '危机解除——你是核心骨干，公司还得靠你扛。',
      },
      {
        weight: 30,
        condition: { all: [
          { skillLt: { 硬: 40 } },
          { skillGte: { 软: 30 } },
        ]},
        apply: (s) => {
          s.attrs.快乐 -= 5;
          s.skills.软 += 3;
          s.flags.add('choice_survived_layoff');
        },
        result: '你被调岗降薪，但保住了饭碗。职场政治学了一课。',
      },
      {
        weight: 20,
        condition: { all: [
          { skillLt: { 硬: 40 } },
          { skillLt: { 软: 30 } },
        ]},
        apply: (s) => {
          s.flags.add('milestone_fired');
          s.flags.delete('milestone_has_job');
          s.attrs.财富 += 8;
          s.attrs.快乐 -= 10;
        },
        result: '你被裁了，拿了 N+1 赔偿。回家路上既慌又有点松口气。',
      },
    ]}],
  },

  // 6. 办公室政治 — 28-35 岁
  {
    id: 'career_office_politics',
    stage: 'career', ageRange: [28, 35], once: true,
    trigger: {
      baseWeight: 5,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '两个部门老大在掰手腕，你被夹在中间。A 领导暗示你「站对队很重要」，B 领导请你单独吃饭。',
    choices: [
      {
        label: '倒向 A，背靠大树好乘凉',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 运气: 50 } },
            apply: (s) => { s.attrs.财富 += 6; s.attrs.快乐 += 3; s.skills.软 += 4; },
            result: 'A 领导赢了那场博弈，你跟着吃香喝辣，半年内调到了核心项目。',
          },
          {
            weight: 50,
            condition: { attrLt: { 运气: 50 } },
            apply: (s) => { s.attrs.快乐 -= 6; s.attrs.财富 -= 3; s.skills.软 += 3; },
            result: 'A 领导被调走了。新来的领导对你的"站队"心知肚明，从此你坐冷板凳。',
          },
        ],
      },
      {
        label: '谁都不靠，只做自己的事',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 2; s.attrs.智力 += 3; s.skills.硬 += 4; },
          result: '两派都不待见你，但也不敢动你——你的活儿没人能替。你学会了"不可替代"四个字。',
        }],
      },
      {
        label: '想办法调去别的部门',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; s.attrs.财富 -= 2; s.skills.软 += 3; },
          result: '你费了一番周折调走了。新部门清净不少，但错过了原来的年终奖。',
        }],
      },
    ],
  },

  // 7. 副业 — 26-35 岁
  {
    id: 'career_side_hustle',
    stage: 'career', ageRange: [26, 35], once: true,
    trigger: {
      baseWeight: 5,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '同事神秘兮兮地拉你到茶水间：「我晚上在做自媒体，一个月外快比工资还高，要不要一起搞？」',
    choices: [
      {
        label: '一起做，多条收入来源',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 体质: 40 } },
            apply: (s) => { s.attrs.财富 += 10; s.attrs.快乐 += 4; s.attrs.体质 -= 5; s.skills.硬 += 3; },
            result: '白天上班晚上剪视频，你累成了狗，但看着第二份收入进账，值了。',
          },
          {
            weight: 50,
            condition: { attrLt: { 体质: 40 } },
            apply: (s) => { s.attrs.财富 += 3; s.attrs.快乐 -= 5; s.attrs.体质 -= 8; },
            result: '副业没做起来，主业倒是先撑不住了。领导找你谈话：「最近状态不对啊。」',
          },
        ],
      },
      {
        label: '不了，专注主业',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 3; s.skills.硬 += 4; s.attrs.快乐 += 2; },
          result: '你拒绝了。同事的副业三个月后没了动静，而你的本职工作越做越扎实。',
        }],
      },
    ],
  },

  // 8. 体检警告 — 30-40 岁
  {
    id: 'career_health_warning',
    stage: 'career', ageRange: [30, 40], once: true,
    trigger: {
      baseWeight: 5,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '体检报告出来了。脂肪肝、血脂偏高、颈椎曲度变直——医生用红笔圈了三处，建议你「调整生活方式」。',
    choices: [
      {
        label: '办健身卡，痛改前非',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 体质: 35 } },
            apply: (s) => { s.attrs.体质 += 8; s.attrs.快乐 += 5; s.attrs.财富 -= 5; },
            result: '你一周去三次健身房，三个月后指标明显好转。整个人精神状态都不一样了。',
          },
          {
            weight: 50,
            condition: { attrLt: { 体质: 35 } },
            apply: (s) => { s.attrs.体质 += 2; s.attrs.财富 -= 5; s.attrs.快乐 -= 2; },
            result: '健身卡用了三次就吃灰了。你安慰自己"至少办卡支持了 GDP"。',
          },
        ],
      },
      {
        label: '调整饮食，少加班',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.体质 += 5; s.attrs.快乐 += 3; s.attrs.财富 -= 2; },
          result: '你开始自己做饭，戒掉了宵夜。指标慢慢往回走，虽然慢，但方向是对的。',
        }],
      },
      {
        label: '不当回事，继续卷',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.体质 -= 8; s.attrs.财富 += 5; s.attrs.快乐 -= 3; },
          result: '你把报告塞进抽屉。半年后复查，指标更难看了，医生的表情也严肃了起来。',
        }],
      },
    ],
  },

  // 9. 同学聚会 — 28-35 岁
  {
    id: 'career_class_reunion',
    stage: 'career', ageRange: [28, 35], once: true,
    trigger: {
      baseWeight: 4,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '十年同学聚会。包厢里有人开公司了，有人二胎了，有人刚从国外飞回来。你端着酒杯，笑着听大家互相寒暄。',
    choices: [
      {
        label: '积极社交，交换资源',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 魅力: 45 } },
            apply: (s) => { s.attrs.财富 += 6; s.skills.软 += 5; s.attrs.快乐 += 3; },
            result: '你和几个混得不错的同学聊得很投机，后来真合作了一个项目。',
          },
          {
            weight: 50,
            condition: { attrLt: { 魅力: 45 } },
            apply: (s) => { s.attrs.快乐 -= 5; s.attrs.智力 += 2; },
            result: '你努力融入话题，但总插不上话。回家路上你盯着天花板失眠到两点。',
          },
        ],
      },
      {
        label: '就当叙旧，不谈工作',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; s.attrs.智力 += 2; },
          result: '你和几个老朋友窝在角落聊学生时代，笑到肚子疼。这才是聚会的意义。',
        }],
      },
      {
        label: '找借口不去',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.智力 += 2; },
          result: '你在朋友圈发了条「加班，下次一定」。其实那天你只是不想被比较。',
        }],
      },
    ],
  },

  // 10. 离职创业 — 30-45 岁
  {
    id: 'career_startup',
    stage: 'career', ageRange: [30, 45], once: true,
    trigger: {
      baseWeight: 4,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '你攒了些钱和人脉，有个想法在脑子里转了很久了。朋友说「趁还年轻，不搏一把？」',
    choices: [
      {
        label: '辞职创业，搏一把',
        outcomes: [
          {
            weight: 35,
            condition: { attrGte: { 智力: 55 } },
            apply: (s) => {
              s.attrs.财富 += 15;
              s.attrs.快乐 += 8;
              s.attrs.体质 -= 8;
              s.skills.硬 += 5;
              s.skills.软 += 5;
              s.flags.add('choice_started_business');
            },
            result: '前两年九死一生，但公司活了下来。你不是打工仔了，你是创始人。',
          },
          {
            weight: 65,
            condition: { attrLt: { 智力: 55 } },
            apply: (s) => {
              s.attrs.财富 -= 12;
              s.attrs.快乐 -= 10;
              s.attrs.体质 -= 6;
              s.flags.add('choice_business_failed');
            },
            result: '一年后资金链断裂，公司关了。你赔了一笔钱，但也认清了自己的能力边界。',
          },
        ],
      },
      {
        label: '兼职试试水，不急着辞职',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 3; s.attrs.快乐 += 2; s.attrs.体质 -= 4; s.skills.硬 += 3; },
          result: '你下班后做原型、跑客户。虽然进展慢，但至少保住了工资，睡得着觉。',
        }],
      },
      {
        label: '算了，稳定最重要',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 4; s.attrs.智力 += 2; },
          result: '你把想法记在了备忘录里。偶尔翻出来看看，叹口气，然后继续工作。',
        }],
      },
    ],
  },

  // 11. 出差艳遇 / 诱惑 — 30-45 岁
  {
    id: 'career_temptation',
    stage: 'career', ageRange: [30, 45], once: true,
    trigger: {
      baseWeight: 4,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '出差三天，客户那边的对接人对你格外热情，最后一天晚上约你去酒吧，说「聊聊人生」。',
    choices: [
      {
        label: '赴约，看看会发生什么',
        outcomes: [
          {
            weight: 40,
            condition: { attrGte: { 魅力: 50 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.魅力 += 3; s.attrs.运气 -= 5; },
            result: '那晚很浪漫。但回到公司你发现对方的"热情"里掺了一半生意。你有点说不清这算什么。',
          },
          {
            weight: 60,
            condition: { attrLt: { 魅力: 50 } },
            apply: (s) => { s.attrs.快乐 -= 4; s.attrs.魅力 += 2; },
            result: '对方只是客气，你以为的"暗示"全是你脑补的。你在酒店房间里尴尬了一整晚。',
          },
        ],
      },
      {
        label: '婉拒，保持专业距离',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 3; s.skills.软 += 4; s.attrs.快乐 += 2; },
          result: '你回了句「下次有机会再约」，然后关掉手机。第二天谈判桌上，对方对你反而更客气了。',
        }],
      },
    ],
  },

  // 12. 父母养老 — 35-50 岁
  {
    id: 'career_parents_aging',
    stage: 'career', ageRange: [35, 50], once: true,
    trigger: {
      baseWeight: 5,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '老妈打电话来，声音有点慌：「你爸住院了，医生说要做个手术……」你握着电话，看了一眼日历上密密麻麻的会议。',
    choices: [
      {
        label: '立刻请假回家',
        outcomes: [
          {
            weight: 60,
            condition: { skillGte: { 软: 30 } },
            apply: (s) => { s.attrs.快乐 -= 3; s.attrs.财富 -= 8; s.attrs.智力 += 3; s.flags.add('choice_cared_for_parents'); },
            result: '你陪床了两周，老爸手术顺利。领导嘴上说理解，但你回来发现好项目已经被分走了。',
          },
          {
            weight: 40,
            condition: { skillLt: { 软: 30 } },
            apply: (s) => { s.attrs.快乐 -= 8; s.attrs.财富 -= 10; s.attrs.体质 -= 5; },
            result: '领导不太高兴，你回来后被边缘化了。但你不后悔——爸只有一个。',
          },
        ],
      },
      {
        label: '出钱请护工，工作走不开',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 12; s.attrs.快乐 -= 6; s.attrs.智力 += 2; },
          result: '你请了最好的护工，每天视频三次。老妈嘴上说「你忙你的」，但你听得出她的失落。',
        }],
      },
    ],
  },

  // 13. 投资理财 — 28-45 岁
  {
    id: 'career_investment',
    stage: 'career', ageRange: [28, 45], once: true,
    trigger: {
      baseWeight: 5,
      requires: [{ flag: 'milestone_has_job' }],
    },
    text: '同事老张神秘兮兮地给你看手机：「这只基金上半年涨了 40%，我加了杠杆，你要不要跟？内部消息。」',
    choices: [
      {
        label: '跟着投，搏一把',
        outcomes: [
          {
            weight: 40,
            condition: { attrGte: { 运气: 50 } },
            apply: (s) => { s.attrs.财富 += 15; s.attrs.快乐 += 6; s.attrs.运气 -= 5; s.flags.add('choice_invested_big'); },
            result: '你买入第二周就涨了 20%，果断止盈离场。老张说你是他见过运气最好的人。',
          },
          {
            weight: 60,
            condition: { attrLt: { 运气: 50 } },
            apply: (s) => { s.attrs.财富 -= 12; s.attrs.快乐 -= 8; s.attrs.智力 += 4; },
            result: '你满仓进去，第二周大盘闪崩。割肉离场那天，你盯着账户半天说不出话。',
          },
        ],
      },
      {
        label: '定投指数基金，细水长流',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 += 6; s.attrs.智力 += 3; s.attrs.快乐 += 2; },
          result: '你选了几只指数基金每月定投。不刺激，但一年下来收益还不错，晚上也睡得着。',
        }],
      },
      {
        label: '不碰，保本最重要',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 += 3; s.attrs.智力 += 2; },
          result: '你把钱放在了定期里。老张那只基金后来暴跌了 30%，你没敢看他朋友圈。',
        }],
      },
    ],
  },
];
