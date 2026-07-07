// src/stores/game.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState } from '../engine/types';
import { STAGE_OF_AGE } from '../engine/constants';
import { loadGame, saveGame, clearSave, hasSave, type SaveData } from '../utils/save';

type View = 'start' | 'game' | 'ending' | 'settings';

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState | null>(null);
  const view = ref<View>('start');
  const currentEventIds = ref<string[]>([]);
  const eventQueueIndex = ref(0);
  const currentEndingId = ref<string | null>(null);
  const unlockedEndings = ref<string[]>([]);
  const totalPlaythroughs = ref(0);
  const lastLog = ref<string[]>([]);

  const hasOngoingGame = computed(() => state.value !== null && view.value === 'game');

  function newGame(seed: number, carryover?: GameState['meta']['carryover']) {
    const attrs = {
      智力: 30 + Math.floor(seedRandom(seed, 1) * 21),
      魅力: 30 + Math.floor(seedRandom(seed, 2) * 21),
      体质: 30 + Math.floor(seedRandom(seed, 3) * 21),
      运气: 30 + Math.floor(seedRandom(seed, 4) * 21),
      财富: 30 + Math.floor(seedRandom(seed, 5) * 21),
      快乐: 30 + Math.floor(seedRandom(seed, 6) * 21),
    };
    state.value = {
      age: 1,
      stage: 'childhood',
      attrs,
      skills: { 硬: 0, 软: 0, 摸: 0 },
      flags: new Set(),
      history: [],
      meta: { seed, playthrough: totalPlaythroughs.value + 1, carryover },
    };
    // 应用 NG+ 继承
    if (carryover === 'intelligence') state.value.attrs.智力 += 15;
    if (carryover === 'soft') state.value.skills.软 += 15;
    if (carryover === 'slacker') state.value.skills.摸 += 15;
    if (carryover === 'memory') state.value.flags.add('ng_plus_memory');
    view.value = 'game';
    currentEventIds.value = [];
    eventQueueIndex.value = 0;
    currentEndingId.value = null;
  }

  function persist() {
    if (state.value) {
      saveGame({
        version: '1',
        state: state.value,
        unlockedEndings: unlockedEndings.value,
        totalPlaythroughs: totalPlaythroughs.value,
      });
    }
  }

  function loadFromSave() {
    const data = loadGame();
    if (!data) return false;
    state.value = data.state;
    unlockedEndings.value = data.unlockedEndings;
    totalPlaythroughs.value = data.totalPlaythroughs;
    view.value = 'game';
    return true;
  }

  function checkHasSave(): boolean {
    return hasSave();
  }

  function resetAll() {
    clearSave();
    state.value = null;
    view.value = 'start';
  }

  function setView(v: View) {
    view.value = v;
  }

  return {
    state, view, currentEventIds, eventQueueIndex, currentEndingId,
    unlockedEndings, totalPlaythroughs, lastLog,
    hasOngoingGame, newGame, persist, loadFromSave, checkHasSave, resetAll, setView,
  };
});

function seedRandom(seed: number, n: number): number {
  // 简单确定性 hash，给 newGame 起手属性用
  let x = seed + n * 2654435761;
  x = Math.imul(x ^ (x >>> 15), 2246822507);
  x = Math.imul(x ^ (x >>> 13), 3266489909);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}
