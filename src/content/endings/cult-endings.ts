// src/content/endings/cult-endings.ts
import type { Ending } from '../../engine/types';

export const cultMartyrEnding: Ending = {
  id: 'ending_cult_martyr',
  priority: 75,
  condition: (s) => s.flags.has('milestone_cult') && s.flags.has('foreshadow_cult_martyr') && s.attrs.快乐 < 20,
  title: '殉道者',
  desc: (s) =>
    `你在 ${s.age} 岁那年成为了"反面教材"。新闻里你的照片被打码，旁白是专家的分析。曾经温暖的客厅早已烧成灰烬，而你至死相信，那道光是真的。`,
  rating: () => 'D',
};

export const cultUsurpEnding: Ending = {
  id: 'ending_cult_usurp',
  priority: 75,
  condition: (s) =>
    s.flags.has('milestone_cult') &&
    s.attrs.魅力 >= 70 &&
    s.attrs.智力 >= 60,
  title: '新教主',
  desc: () =>
    '你推翻了旧偶像，自己坐上了那张椅子。信众依旧虔诚，仪式照常举行——只是"导师"换了张脸。你告诉自己这不一样，但深夜独坐时，你听见他们在下面诵你的名字。',
  rating: () => 'A',
};

export const cultEscapeEnding: Ending = {
  id: 'ending_cult_escape',
  priority: 75,
  condition: (s) =>
    s.flags.has('milestone_cult') && s.flags.has('twist_cult_awakened'),
  title: '劫后余生',
  desc: (s) =>
    `你逃出来了。${s.age}岁，身无分文，朋友早就断联。你在另一个城市找了份洗碗的工作，重新学一个人吃饭、睡觉、活着。有时凌晨惊醒，还听见诵念声——但你分得清，那只是梦。`,
  rating: () => 'B',
};
