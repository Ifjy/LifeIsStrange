// src/content/endings/cyberbully-victim.ts
import type { Ending } from '../../engine/types';

export const cyberbullyVictimEnding: Ending = {
  id: 'ending_cyberbully_victim',
  priority: 60,
  condition: (s) => s.flags.has('twist_cyberbullied'),
  title: '网暴受害者',
  desc: () => '一夜爆红又一夜坠落。你注销了所有账号，再也不敢打开手机。屏幕背后的恶意，你花了半辈子才慢慢消化。',
  rating: () => 'D',
};
