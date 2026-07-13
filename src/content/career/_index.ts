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
      {
        label: '冷暴力',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 8; s.flags.add('choice_marriage_cold'); },
          followUp: 'marriage_counseling',
          result: '你们结婚了，但很快开始了无休止的冷战。同在一个屋檐下，却像两个陌生人。',
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
      {
        label: '断供',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.flags.add('choice_house_default');
          },
          followUp: 'house_auction',
          result: '月供还不上了。你盯着银行卡余额发呆，最后咬咬牙决定不还了——后果以后再说。',
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
    choices: [
      { label: '继续', outcomes: [
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
      ]},
      {
        label: '跟 HR 硬刚',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => {
            s.flags.add('milestone_fired');
            s.flags.delete('milestone_has_job');
            s.attrs.快乐 -= 5;
            s.flags.add('choice_layoff_fight');
          },
          followUp: 'layoff_lawsuit',
          result: '你在 HR 办公室拍了桌子：「N+1 不够，加班费、年终奖、未休年假，一样不能少！」对方脸都绿了。',
        }],
      },
    ],
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
            apply: (s) => {
              s.attrs.快乐 -= 6;
              s.attrs.财富 -= 3;
              s.skills.软 += 3;
              s.flags.add('choice_picked_wrong_side');
            },
            followUp: 'career_office_politics_backlash',
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
            apply: (s) => { s.attrs.体质 += 12; s.attrs.快乐 += 5; s.attrs.财富 -= 5; },
            result: '你一周去三次健身房，三个月后指标明显好转。整个人精神状态都不一样了。',
          },
          {
            weight: 50,
            condition: { attrLt: { 体质: 35 } },
            apply: (s) => { s.attrs.体质 += 3; s.attrs.财富 -= 5; s.attrs.快乐 -= 2; },
            result: '健身卡用了三次就吃灰了。你安慰自己"至少办卡支持了 GDP"。',
          },
        ],
      },
      {
        label: '调整饮食，少加班',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.体质 += 8; s.attrs.快乐 += 3; s.attrs.财富 -= 2; },
          result: '你开始自己做饭，戒掉了宵夜。指标慢慢往回走，虽然慢，但方向是对的。',
        }],
      },
      {
        label: '不当回事，继续卷',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.体质 -= 8;
            s.attrs.财富 += 5;
            s.attrs.快乐 -= 3;
            s.flags.add('choice_ignored_health_warning');
          },
          followUp: 'career_health_warning_hospital',
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

  // 14. 中年考公 — 30-40 岁 (Task 8 #1)
  {
    id: 'career_civil_service',
    stage: 'career', ageRange: [30, 40], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '单位里掀起"考编热"。同事桌上都摆着行测和申论，连午休都在刷题。',
    choices: [
      {
        label: '跟风备考，搏一个编制',
        outcomes: [
          {
            weight: 40,
            condition: { attrGte: { 智力: 60 } },
            apply: (s) => { s.attrs.智力 += 3; s.attrs.财富 += 10; s.attrs.快乐 += 8; },
            result: '你上岸了。虽然工资差不多，但那种踏实感是钱买不到的。',
          },
          {
            weight: 60,
            condition: { all: [] },
            apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 -= 5; },
            result: '考了两年没考上。行测题刷了几千道，梦里都是图形推理。',
          },
        ],
      },
      {
        label: '不折腾了，过好现在',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; },
          result: '你看着同事们焦头烂额的样子，喝了一口茶。',
        }],
      },
    ],
  },

  // 15. 学区房 — 32-42 岁 (Task 8 #2)
  {
    id: 'career_school_district',
    stage: 'career', ageRange: [32, 42], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '孩子快上学了。爱人天天刷家长论坛：「这个学区对应的学校去年考上重点的有一半！就是房子……」',
    choices: [
      {
        label: '砸锅卖铁也要上学区房',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 财富: 50 } },
            apply: (s) => { s.attrs.财富 -= 25; s.attrs.智力 += 3; s.attrs.快乐 += 3; },
            result: '你咬牙签了合同。房子又老又小，但学区稳。你安慰自己：为了下一代。',
          },
          {
            weight: 100,
            condition: { attrLt: { 财富: 50 } },
            apply: (s) => { s.attrs.财富 -= 25; s.attrs.智力 += 3; s.attrs.快乐 -= 6; },
            result: '首付借了一圈人，月供压得你喘不过气。但孩子能上好学校了，值。',
          },
        ],
      },
      {
        label: '顺其自然，就近入学',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; },
          result: '你给孩子报了几个兴趣班，剩下的交给缘分。孩子每天乐呵呵的，你觉得也挺好。',
        }],
      },
    ],
  },

  // 16. 同学聚会攀比 — 30-40 岁 (Task 8 #3)
  {
    id: 'career_reunion_compare',
    stage: 'career', ageRange: [30, 40], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '又一场同学聚会。这次有人开了保时捷来，有人掏出新出的折叠屏手机给大家看「我公司刚融了 A 轮」。',
    choices: [
      {
        label: '租个好车，撑撑场面',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 10; s.attrs.快乐 -= 5; },
          result: '聚会那晚你确实是焦点。但回家路上你把租来的车还了，看着自己的旧车发了很久的呆。',
        }],
      },
      {
        label: '坦然赴约，我就是我',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; s.attrs.魅力 += 2; },
          result: '你穿着平时的衣服去了。意外地，好几个人说羡慕你「活得真实」。',
        }],
      },
    ],
  },

  // 17. 父母住院 — 35-48 岁 (Task 8 #4)
  {
    id: 'career_parents_hospital',
    stage: 'career', ageRange: [35, 48], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '老爸突发脑梗住院了。老妈电话里哭着说：「医生说要把人接回来照顾，护工只能帮忙……」',
    choices: [
      {
        label: '辞职全职照顾',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 15; s.attrs.快乐 -= 5; s.attrs.体质 -= 3; s.flags.add('choice_parents_fulltime'); },
          result: '你把工作停了下来，每天往返医院。老爸一天天好转，但你的简历多了个空白。',
        }],
      },
      {
        label: '花钱请专业护工',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 25; s.attrs.快乐 -= 2; },
          result: '你请了口碑最好的护工，自己周末才能去看。老妈每次都说「你忙你的，这里有我们」。',
        }],
      },
    ],
  },

  // 18. 职场 PUA — 28-40 岁 (Task 8 #5)
  {
    id: 'career_office_pua',
    stage: 'career', ageRange: [28, 40], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '新来的领导对你百般挑剔，当众贬低你的方案，却私下说「我是为你好」。同事们渐渐疏远你，怕被牵连。',
    choices: [
      {
        label: '忍了，多一事不如少一事',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 8; s.attrs.体质 -= 3; },
          result: '你学会了在领导面前沉默。但每天起床越来越难，镜子里的自己越来越陌生。',
        }],
      },
      {
        label: '收集证据，找 HR 反击',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 魅力: 50 } },
            apply: (s) => { s.attrs.快乐 += 5; s.attrs.智力 += 3; s.flags.add('choice_fought_back'); },
            result: 'HR 介入后，领导被调走了。同事们私下给你点赞：「没想到你这么有种。」',
          },
          {
            weight: 50,
            condition: { attrLt: { 魅力: 50 } },
            apply: (s) => { s.attrs.快乐 -= 4; s.attrs.智力 += 2; s.flags.add('choice_fought_back'); },
            result: 'HR 和稀泥，你反被打上了「难管」的标签。但你不后悔——至少你没低头。',
          },
        ],
      },
      {
        label: '此处不留爷，准备跳槽',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 5; s.attrs.快乐 += 3; s.attrs.智力 += 2; },
          result: '你悄悄更新了简历。三个月后拿到新 offer，离职那天你头也没回。',
        }],
      },
    ],
  },

  // 19. 副业升级 — 30-45 岁 (Task 8 #6)
  {
    id: 'career_side_business',
    stage: 'career', ageRange: [30, 45], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '你的副业越做越像样了。有人愿意投资，劝你「全职 all in，搞大了再融资上市」。你看着还在跑的工资卡陷入沉思。',
    choices: [
      {
        label: '辞职全力做副业',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 智力: 55 } },
            apply: (s) => { s.attrs.财富 += 15; s.attrs.快乐 -= 3; s.attrs.体质 -= 5; s.flags.add('choice_side_all_in'); },
            result: '前半年煎熬，但你赌对了。第二年流水翻了三倍，你成了别人嘴里的「那个创业的」。',
          },
          {
            weight: 50,
            condition: { attrLt: { 智力: 55 } },
            apply: (s) => { s.attrs.财富 -= 10; s.attrs.快乐 -= 6; s.attrs.体质 -= 4; },
            result: '全职后反而失去了节奏，副业收入掉了一半。你开始怀念有工资的安稳日子。',
          },
        ],
      },
      {
        label: '当个爱好，稳着来',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 += 5; s.attrs.快乐 += 4; },
          result: '你不贪心，每月稳定多个两三千外快，日子宽松了不少。知足常乐。',
        }],
      },
    ],
  },

  // 20. 出轨诱惑 — 35-48 岁 (Task 8 #7)
  {
    id: 'career_affair',
    stage: 'career', ageRange: [35, 48], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '婚姻进入平淡期，你们已经很久没好好说话了。公司新来的同事／健身房认识的ta，眼神里有些不一样的东西。',
    choices: [
      {
        label: '守住界限，回家好好谈谈',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 4; s.attrs.智力 += 2; s.flags.add('choice_stayed_loyal'); },
          result: '你约爱人吃了顿饭，聊了很久。原来你们都累了。那天晚上你们重新找回了些旧时的温度。',
        }],
      },
      {
        label: '……越界了',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; s.flags.add('choice_affair'); },
          result: '刺激是真的。但每次手机震动你都心惊肉跳。这条路一旦走上去，就回不了头了。',
        }],
      },
    ],
  },

  // 21. FIRE 提前退休 — 45-55 岁 (Task 8 #8)
  {
    id: 'career_fire_plan',
    stage: 'career', ageRange: [45, 55], once: true,
    trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
    text: '你刷到一篇「FIRE（财务独立提前退休）」的帖子，博主 40 岁就辞职环游世界了。你看了看自己的存款计算器。',
    choices: [
      {
        label: '激进攒钱，几年后退休',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 -= 20; s.attrs.快乐 += 10; s.flags.add('choice_fire_plan'); },
          result: '你把开支砍到最低，三年后被动收入覆盖了基本生活。你在四十多岁递了辞呈，第一次感到「时间是自己的」。',
        }],
      },
      {
        label: '继续干，退休金要紧',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.财富 += 10; s.attrs.快乐 -= 3; },
          result: '你算了又算，不敢赌。继续朝九晚五，看着博主更新朋友圈，心里有点酸。',
        }],
      },
    ],
  },
];
