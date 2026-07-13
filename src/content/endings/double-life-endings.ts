// src/content/endings/double-life-endings.ts
import type { Ending } from '../../engine/types';

// 身份暴露：需要 milestone_double_life + 快乐<30
// C 级，priority 55
export const doubleLifeExposedEnding: Ending = {
  id: 'ending_double_life_exposed',
  priority: 55,
  condition: (s) =>
    s.flags.has('milestone_double_life') && s.attrs.快乐 < 30,
  title: '身份暴露',
  desc: (s) =>
    `${s.age}岁，你的两个世界终于撞在了一起——以你最害怕的方式。那些年精心维护的平衡，在真相浮出水面的那一刻轰然崩塌。同事、朋友、家人，他们看着你的眼神里写满了"我不认识你"。你忽然明白：有些秘密之所以是秘密，是因为它一旦见光，就什么都不剩了。你曾经拥有过的另一个完整的自己，最终成了把你压垮的那块石头。`,
  rating: () => 'C',
};

// 永远的秘密：需要 milestone_double_life + 智力≥70
// B 级，priority 55
export const doubleLifeForeverEnding: Ending = {
  id: 'ending_double_life_forever',
  priority: 55,
  condition: (s) =>
    s.flags.has('milestone_double_life') && s.attrs.智力 >= 70,
  title: '永远的秘密',
  desc: (s) =>
    `${s.age}岁，你带着那个秘密走到了人生的尽头。没有人知道，你曾拥有过另一个完整的身份、另一段完全不同的人生。那个深夜世界里的你——冷静、锋利、自由——已经被你亲手埋进了记忆最深处。它是你一个人的。这个世界记得的，只是你白天的那张脸。但你心里清楚：你活过两次，比任何人都完整。`,
  rating: () => 'B',
};

// 双面大师：需要 milestone_double_life + 魅力≥65 + 快乐≥50
// A 级，priority 55
export const doubleLifeBalanceEnding: Ending = {
  id: 'ending_double_life_balance',
  priority: 55,
  condition: (s) =>
    s.flags.has('milestone_double_life') &&
    s.attrs.魅力 >= 65 &&
    s.attrs.快乐 >= 50,
  title: '双面大师',
  desc: (s) =>
    `${s.age}岁，你做到了一件几乎不可能的事——把两种人生活成了同一种智慧。白天的你和夜晚的你不再是对立的两个名字，而是彼此的延伸、彼此的底气。你从暗面学来的洞察、冷静、驾驭复杂，全部成了明面上你最锋利的底牌。人们只知道你"深不可测"，却永远猜不到为什么。这就是你留给这个世界的谜底——一个只有你自己知道的答案。`,
  rating: () => 'A',
};
