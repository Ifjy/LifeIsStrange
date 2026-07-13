// src/content/endings/crime-endings.ts
import type { Ending } from '../../engine/types';

export const crimeJailedEnding: Ending = {
  id: 'ending_crime_jailed',
  priority: 62,
  condition: (s) => s.flags.has('milestone_crime') && s.attrs.体质 < 30,
  title: '铁窗余生',
  desc: (s) => `你在 ${s.age} 岁那年进去了。铁窗外的月亮和当年一样圆，只是你已经老了。`,
  rating: () => 'C',
};

export const crimeBossEnding: Ending = {
  id: 'ending_crime_boss',
  priority: 62,
  condition: (s) => s.flags.has('milestone_crime') && s.attrs.财富 >= 70 && s.flags.has('twist_crime_mastermind'),
  title: '洗白大佬',
  desc: () => '几番沉浮，你把黑钱洗得干干净净。如今你是慈善晚会的常客，没人记得你的第一桶金是怎么来的。',
  rating: () => 'A',
};

export const crimeScapegoatEnding: Ending = {
  id: 'ending_crime_scapegoat',
  priority: 65,
  condition: (s) => s.flags.has('milestone_crime') && s.flags.has('foreshadow_crime_setup'),
  title: '替罪羊',
  desc: () => '上面的人全身而退，所有的证据都指向你。你成了新闻里的"主犯"，真正的玩家从不留名。',
  rating: () => 'D',
};
