// src/content/special/followup-extensions.ts
import type { GameEvent } from '../../engine/types';

// Task 9: 10 个 followUp 回响事件。
// 全部 trigger: { baseWeight: 0 }，不带 requires — 只靠 followUp 机制触发。
// 每个 apply 末尾 delete 对应 flag（清理，避免 flag 残留）。
export const followupExtensionEvents: GameEvent[] = [
  // 1. 复读一年的煎熬
  {
    id: 'gaokao_retake_consequence',
    stage: 'school',
    ageRange: [18, 20],
    once: true,
    trigger: { baseWeight: 0 },
    text: '复读这一年，你尝到了什么叫"度日如年"。身边同学都在大学里军训、社团、谈恋爱，你还在刷去年的试卷。',
    choices: [{
      label: '咬牙撑过去',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.体质 -= 3;
          s.attrs.快乐 -= 8;
          s.flags.delete('choice_gaokao_retake');
        },
        result: '你的黑眼圈比课本还厚。但模考成绩在慢慢回升。',
      }],
    }],
  },

  // 2. 收到退学警告
  {
    id: 'college_academic_warning',
    stage: 'college',
    ageRange: [19, 22],
    once: true,
    trigger: { baseWeight: 0 },
    text: '教务处寄来一封正式通知：因多门挂科未补考通过，你被列入退学警告名单。辅导员约你下周谈话。',
    choices: [{
      label: '痛定思痛，下次一定',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 -= 10;
          s.attrs.智力 += 2;
          s.flags.delete('choice_failed_skip');
        },
        result: '你把警告信贴在书桌前。从今天起，每节课都坐第一排。',
      }],
    }],
  },

  // 3. 猝死边缘住院
  {
    id: 'overwork_hospital_stay',
    stage: 'career',
    ageRange: [25, 45],
    once: true,
    trigger: { baseWeight: 0 },
    text: '加班到凌晨三点，你突然胸口剧痛，眼前一黑。再醒来时，已经躺在ICU，旁边是心电监护仪的滴滴声。',
    choices: [{
      label: '老老实实住院治疗',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.体质 -= 15;
          s.attrs.财富 -= 10;
          s.flags.delete('choice_overwork_ignore');
        },
        result: '医生说你的心血管已经拉响了警报。再晚来半小时，可能就真的回不来了。',
      }],
    }],
  },

  // 4. 劳动仲裁 (反转: 智力≥55 赢官司)
  {
    id: 'layoff_lawsuit',
    stage: 'career',
    ageRange: [35, 50],
    once: true,
    trigger: { baseWeight: 0 },
    text: '被裁后你越想越憋屈——加班费没结清、N+1也没给够。你决定申请劳动仲裁，跟公司死磕到底。',
    choices: [{
      label: '走法律程序',
      outcomes: [
        {
          weight: 50,
          condition: { attrGte: { 智力: 55 } },
          apply: (s) => {
            s.attrs.财富 += 15;
            s.flags.delete('choice_layoff_fight');
          },
          result: '你提前搜集了加班记录、微信聊天截图、考勤数据。仲裁庭上证据链完整，公司败诉，你拿到了应得的赔偿。',
        },
        {
          weight: 50,
          condition: { attrLt: { 智力: 55 } },
          apply: (s) => {
            s.attrs.财富 -= 5;
            s.attrs.快乐 -= 10;
            s.flags.delete('choice_layoff_fight');
          },
          result: '证据不足，你缺乏法律知识，被公司律师绕得团团转。仲裁败诉，你白白搭进去半年时间和律师费。',
        },
      ],
    }],
  },

  // 5. 房子被法拍
  {
    id: 'house_auction',
    stage: 'career',
    ageRange: [30, 50],
    once: true,
    trigger: { baseWeight: 0 },
    text: '连续六个月断供后，银行寄来了最后通牒。法院的人上门贴了封条，你的房子要被强制法拍了。',
    choices: [{
      label: '眼睁睁看着房子被拍走',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.财富 -= 30;
          s.attrs.快乐 -= 15;
          s.flags.delete('choice_house_default');
        },
        result: '拍卖那天你去了，但什么也做不了。买家用低于你购入价三成的价格拍走了你的家。',
      }],
    }],
  },

  // 6. 婚姻咨询 / 离婚危机 (反转: 魅力≥50 挽回)
  {
    id: 'marriage_counseling',
    stage: 'career',
    ageRange: [28, 45],
    once: true,
    trigger: { baseWeight: 0 },
    text: '长期的冷暴力终于把婚姻推到了悬崖边。爱人摔下碗说：「过不下去了，我们去咨询，看看还能不能过。」',
    choices: [{
      label: '去做婚姻咨询',
      outcomes: [
        {
          weight: 50,
          condition: { attrGte: { 魅力: 50 } },
          apply: (s) => {
            s.attrs.快乐 += 5;
            s.flags.delete('choice_marriage_cold');
          },
          result: '咨询师帮你们打开了心结。原来你们都以为是对方不在乎。那晚你们聊到天亮，决定重新开始。',
        },
        {
          weight: 50,
          condition: { attrLt: { 魅力: 50 } },
          apply: (s) => {
            s.attrs.快乐 -= 10;
            s.flags.delete('choice_marriage_cold');
          },
          result: '咨询室里你才发现，原来对方已经忍了很久。你们签了协议，平静地分开了。',
        },
      ],
    }],
  },

  // 7. 养老金被骗后续 (反转: 智力≥50 追回)
  {
    id: 'pension_fraud_aftermath',
    stage: 'retirement',
    ageRange: [61, 70],
    once: true,
    trigger: { baseWeight: 0 },
    text: '养老金被骗后你彻夜难眠。儿女说「报警吧，把骗子的信息整理一下」。你翻出了所有的转账记录。',
    choices: [{
      label: '去报案',
      outcomes: [
        {
          weight: 50,
          condition: { attrGte: { 智力: 50 } },
          apply: (s) => {
            s.attrs.财富 += 10;
            s.flags.delete('choice_pension_fraud');
          },
          result: '你保留的证据链完整，配合警方迅速锁定了诈骗团伙。三个月后，大部分钱被追了回来。',
        },
        {
          weight: 50,
          condition: { attrLt: { 智力: 50 } },
          apply: (s) => {
            s.attrs.快乐 -= 15;
            s.flags.delete('choice_pension_fraud');
          },
          result: '证据零散，骗子早把钱转移干净了。警方说会继续查，但你心里清楚，钱大概率是回不来了。',
        },
      ],
    }],
  },

  // 8. 老师找家长 / 被揍 (反转: 体质低 被揍更惨)
  {
    id: 'childhood_bully_escalation',
    stage: 'childhood',
    ageRange: [4, 8],
    once: true,
    trigger: { baseWeight: 0 },
    text: '勒索同学的事败露了。班主任把你叫到办公室，电话已经打了你爸妈。被你欺负的那个同学家长也来了，脸色铁青。',
    choices: [{
      label: '认错挨训',
      outcomes: [
        {
          weight: 70,
          condition: { all: [] },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.attrs.魅力 -= 3;
            s.flags.delete('choice_bully_extort');
          },
          result: '你当着双方家长的面道了歉。回家后被罚站两小时。你在班里有了个外号叫"小霸王"，但没几个人觉得是夸你。',
        },
        {
          weight: 30,
          condition: { attrLt: { 体质: 30 } },
          apply: (s) => {
            s.attrs.快乐 -= 5;
            s.attrs.体质 -= 3;
            s.attrs.魅力 -= 3;
            s.flags.delete('choice_bully_extort');
          },
          result: '你嘴硬不肯认错。对方家长直接动手，你被揍得鼻青脸肿。从此你再也不敢欺负人了。',
        },
      ],
    }],
  },

  // 9. 被当众羞辱
  {
    id: 'crush_rejection_trauma',
    stage: 'school',
    ageRange: [10, 14],
    once: true,
    trigger: { baseWeight: 0 },
    text: '你的死缠烂打终于让对方忍无可忍。TA把你写的所有信拍照发到了班群里，附文：「能不能别再来烦我了？」全班哄堂大笑。',
    choices: [{
      label: '恨不得找个地缝钻进去',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 -= 10;
          s.attrs.魅力 -= 5;
          s.flags.delete('choice_crush_stalk');
        },
        result: '你在厕所里哭了一整个午休。从那以后，你再也不敢主动跟任何人表白。',
      }],
    }],
  },

  // 10. 留校察看
  {
    id: 'roommate_violence_aftermath',
    stage: 'college',
    ageRange: [18, 22],
    once: true,
    trigger: { baseWeight: 0 },
    text: '和室友动手的事惊动了学院。辅导员黑着脸把处分通知书递给你：「留校察看。再有下次，直接开除。」',
    choices: [{
      label: '接受处分',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => {
          s.attrs.快乐 -= 5;
          s.attrs.体质 -= 3;
          s.flags.delete('choice_roommate_violence');
        },
        result: '你签了字，搬出了那个宿舍。新室友们听说了你的"事迹"，对你客客气气，但没人跟你交心。',
      }],
    }],
  },
];
