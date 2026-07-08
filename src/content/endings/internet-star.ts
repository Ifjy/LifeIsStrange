// src/content/endings/internet-star.ts
import type { Ending } from '../../engine/types';

export const internetStarEnding: Ending = {
  id: 'ending_internet_star',
  priority: 90,
  condition: (s) => s.flags.has('twist_internet_star'),
  title: '正能量头部 UP 主',
  desc: () => '当年偷偷传视频的少年，如今成了千万粉丝的头部创作者。颁奖礼上你说：「被看见，是一种力量。」',
  rating: () => 'S',
};
