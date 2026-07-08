// src/content/endings/lifestyle-endings.ts
import type { Ending } from '../../engine/types';

// 1. 百岁老人 — 罕见长寿，priority 45
export const centenarianEnding: Ending = {
  id: 'ending_centenarian',
  priority: 45,
  condition: (s) => s.age >= 95,
  title: '百岁老人',
  desc: () => '你竟然活过了一百岁。儿孙满堂也好，独身一人也罢，你把同时代的人都熬走了。临走前你笑着说：「这局，我赢了。」',
  rating: () => 'S',
};

// 2. 创业成功 — 呼应 career_startup 的 choice_started_business flag
export const entrepreneurEnding: Ending = {
  id: 'ending_entrepreneur',
  priority: 45,
  condition: (s) => s.flags.has('choice_started_business'),
  title: '创业者',
  desc: () => '当年辞职那晚你彻夜未眠。如今公司养活了上百号人，你成了别人故事里的「那个老板」。',
  rating: () => 'A',
};

// 3. 环球旅行家 — 富有且未婚，priority 39 (低于 earlyDeath 40 不冲突，因为需要活到老)
export const globalTravelerEnding: Ending = {
  id: 'ending_global_traveler',
  priority: 39,
  condition: (s) => s.attrs.财富 >= 70 && !s.flags.has('milestone_married'),
  title: '环球旅行家',
  desc: () => '没有房贷，没有牵挂。你的护照盖满了戳，行李箱角的划痕是各大洲的纪念章。自由是有代价的，你付得起。',
  rating: () => 'A',
};

// 4. 终身学习者 — 智力极高，priority 38
export const lifelongLearnerEnding: Ending = {
  id: 'ending_lifelong_learner',
  priority: 38,
  condition: (s) => s.attrs.智力 >= 75,
  title: '终身学习者',
  desc: () => '别人退休打麻将，你退休读博士。书架上的书比存款还多，你说：「脑子这东西，越用越灵光。」',
  rating: () => 'B',
};

// 5. 负债累累 — 财富极低，priority 37
export const debtRiddenEnding: Ending = {
  id: 'ending_debt_ridden',
  priority: 37,
  condition: (s) => s.attrs.财富 < 15,
  title: '负债累累',
  desc: () => '房租、网贷、信用卡，每个月的账单像一座山。你不是不努力，只是命运的总账总是算不到你头上。',
  rating: () => 'D',
};

// 6. 隐居者 — 老年且极不快乐，priority 36
export const hermitEnding: Ending = {
  id: 'ending_hermit',
  priority: 36,
  condition: (s) => s.attrs.快乐 < 25 && s.age >= 55,
  title: '隐居者',
  desc: () => '你搬到了城郊的老房子，拉上窗帘，关掉手机。世界很吵，你选择听不见。',
  rating: () => 'D',
};

// 7. 孤独终老 — 未婚无子女且不快乐，priority 35 (与 hermit 互斥：快乐 25-44 区间)
export const dyingAloneEnding: Ending = {
  id: 'ending_dying_alone',
  priority: 35,
  condition: (s) => !s.flags.has('milestone_married') && !s.flags.has('milestone_family') && s.attrs.快乐 >= 25 && s.attrs.快乐 < 45 && s.age >= 55,
  title: '孤独终老',
  desc: () => '没有伴侣，没有子嗣。你一个人走过了大半生，病了为自己倒水，夜里为自己留灯。独立，是你最熟练的技能。',
  rating: () => 'D',
};

// 8. 多面手 — 三项技能均衡发展，priority 34
export const jackOfAllTradesEnding: Ending = {
  id: 'ending_jack_of_all_trades',
  priority: 34,
  condition: (s) => s.skills.硬 >= 25 && s.skills.软 >= 25 && s.skills.摸 >= 25,
  title: '多面手',
  desc: () => '硬技能能写代码，软技能能搞演讲，摸鱼技能……也炉火纯青。你什么都会一点，什么都玩得转。',
  rating: () => 'B',
};
