// src/content/endings/art-endings.ts
import type { Ending } from '../../engine/types';

// 传世之作：需要 milestone_art + 智力≥75 + twist_art_breakthrough
// twist_art_breakthrough 由 art_crossroad "死磕到底" 罕见反转设置
export const artMasterpieceEnding: Ending = {
  id: 'ending_art_masterpiece',
  priority: 55,
  condition: (s) =>
    s.flags.has('milestone_art') &&
    s.attrs.智力 >= 75 &&
    s.flags.has('twist_art_breakthrough'),
  title: '传世之作',
  desc: (s) =>
    `你写出了这个时代没人能替代的东西。${s.age}岁，那部作品已经印了十七版，被翻译成十几种语言，有人读了之后辞职、有人读了之后原谅了父亲、有人在最后一页哭了整夜。而你知道，这是你用半生贫穷、孤独和怀疑换来的。你没白来这一趟。`,
  rating: () => 'S',
};

// 穷困潦倒：需要 milestone_art + 财富<20
export const artStarvingEnding: Ending = {
  id: 'ending_art_starving',
  priority: 55,
  condition: (s) =>
    s.flags.has('milestone_art') && s.attrs.财富 < 20,
  title: '穷困潦倒',
  desc: (s) =>
    `${s.age}岁，你住在一间不见光的出租屋里，身边堆满了写废的稿纸。你的才华或许真的存在过——但这个时代不需要它，或者说，不需要你。你看着窗外，想起当年走出写字楼时刺眼的阳光，和那个觉得自己"终于活了"的年轻人。那好像是上辈子的事了。`,
  rating: () => 'C',
};

// 燃尽：需要 milestone_art + 体质<20 + foreshadow_art_spark
// B 级，priority 58（介于 cyberbully 60 和 homesick 55 之间）
export const artSacrificeEnding: Ending = {
  id: 'ending_art_sacrifice',
  priority: 58,
  condition: (s) =>
    s.flags.has('milestone_art') &&
    s.attrs.体质 < 20 &&
    s.flags.has('foreshadow_art_spark'),
  title: '燃尽',
  desc: (s) =>
    `你把自己烧光了。${s.age}岁，你的身体像一根烧到尽头的蜡烛——再也挺不直了。但你的桌上还放着最后一份手稿，墨迹未干。你想起十五岁那年脑子里"嗡"的那一下，想起你曾经追着的那道光。它没骗你——你真的看到了别人看不到的东西。只是代价，是你的一切。`,
  rating: () => 'B',
};
