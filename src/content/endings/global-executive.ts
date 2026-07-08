// src/content/endings/global-executive.ts
import type { Ending } from '../../engine/types';

export const globalExecutiveEnding: Ending = {
  id: 'ending_global_executive',
  priority: 90,
  condition: (s) => s.flags.has('twist_global_exec'),
  title: '环球高管',
  desc: () => '当年坐在宣讲会后排那个偷偷记笔记的少年，如今飞遍三大洲开会。护照盖满了签证页，你说：「世界比想象的小，也比想象的大。」',
  rating: () => 'S',
};
