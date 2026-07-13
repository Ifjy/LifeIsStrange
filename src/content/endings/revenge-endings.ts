// src/content/endings/revenge-endings.ts
import type { Ending } from '../../engine/types';

// 同归于尽：复仇把身体耗尽
export const revengeMutualEnding: Ending = {
  id: 'ending_revenge_mutual',
  priority: 65,
  condition: (s) => s.flags.has('milestone_revenge') && s.attrs.体质 < 25,
  title: '同归于尽',
  desc: (s) =>
    `复仇完成了，你也完成了。${s.age}岁，你的身体像一盏熬干的油灯。你躺在病床上，手机里是 ta 身败名裂的新闻，窗外是看不见的月亮。你赢了，但赢得连庆祝的力气都没有——你用一生，换了一个两败俱伤。`,
  rating: () => 'D',
};

// 大仇得报：复仇成功但内心空虚
export const revengeEmptyEnding: Ending = {
  id: 'ending_revenge_empty',
  priority: 62,
  condition: (s) => s.flags.has('milestone_revenge') && s.attrs.快乐 < 30,
  title: '大仇得报',
  desc: (s) =>
    `该报的都报了。${s.age}岁，你坐在空荡荡的房间里，面前是一份再也不会有人看的复仇清单——每一项都打了勾。你本以为会有如释重负的感觉，但真正到了这一天，你只是觉得空。仇恨撑了你这么多年，一下子抽走，你不知道明天该为什么起床。`,
  rating: () => 'C',
};

// 放下屠刀：在复仇完成后选择放下，放过自己
// 需要 twist_revenge_forgive（由 revenge_aftermath "放下" 选项设置）
export const revengeLetgoEnding: Ending = {
  id: 'ending_revenge_letgo',
  priority: 62,
  condition: (s) =>
    s.flags.has('milestone_revenge') &&
    s.attrs.智力 >= 65 &&
    s.flags.has('twist_revenge_forgive'),
  title: '放下屠刀',
  desc: (s) =>
    `你终于明白：复仇不是终点，放下才是。${s.age}岁，你把那个名字从心里轻轻拿了出来，看了最后一眼，然后放在了风里。不是为了原谅 ta，是为了放过你自己。你转身，背后是半生的执念，面前是剩下的、属于你自己的日子。`,
  rating: () => 'B',
};
