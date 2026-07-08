// src/content/endings/homesick-returnee.ts
import type { Ending } from '../../engine/types';

export const homesickReturneeEnding: Ending = {
  id: 'ending_homesick_returnee',
  priority: 55,
  condition: (s) => s.flags.has('twist_homesick'),
  title: '思乡归人',
  desc: () => '你拎着两个行李箱回国那天，妈妈在出口等你。异国的几年像一场漫长的感冒，你终于痊愈了。',
  rating: () => 'C',
};
