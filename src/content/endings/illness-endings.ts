// src/content/endings/illness-endings.ts
import type { Ending } from '../../engine/types';

export const illnessRebornEnding: Ending = {
  id: 'ending_illness_reborn',
  priority: 85,
  condition: (s) => s.flags.has('milestone_illness') && s.attrs.快乐 >= 50,
  title: '涅槃重生',
  desc: (s) =>
    `病没有完全好，但你已经不怕它了。${s.age}岁，你站在体检报告前，各项指标依然有箭头，但你学会了和它们共处。你不再是那个被诊断击垮的人——你是从那道门里走出来的另一个自己。`,
  rating: () => 'A',
};

export const illnessAdvocateEnding: Ending = {
  id: 'ending_illness_advocate',
  priority: 85,
  condition: (s) => s.flags.has('milestone_illness') && s.attrs.魅力 >= 60,
  title: '病友灯塔',
  desc: (s) =>
    `你的名字在病友群里被频繁提起。${s.age}岁，你管理着一个几百人的互助组织，每天回复消息到深夜。有人说"没有你我撑不下来"。你知道这话太重了，但你也知道，当年的自己，确实需要这样一个人。`,
  rating: () => 'B',
};

export const illnessDefeatedEnding: Ending = {
  id: 'ending_illness_defeated',
  priority: 85,
  condition: (s) => s.flags.has('milestone_illness') && s.attrs.体质 < 15,
  title: '耗尽',
  desc: (s) =>
    `药盒越堆越高，体力越来越少。${s.age}岁，你已经分不清是在"活着"还是在"撑着"。最后一次复查，医生欲言又止，你替他说了："我知道。"窗外阳光很好，你闭上眼，想睡一会儿。`,
  rating: () => 'D',
};
