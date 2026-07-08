<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/game';
import { ALL_ENDINGS } from '../content/_registry';
import type { Rating, GameState } from '../engine/types';

const store = useGameStore();

const unlockedSet = computed(() => new Set(store.unlockedEndings));
// 隐藏 default_ordinary（兜底结局）不展示在图鉴中，避免剧透"平凡"也是结局
const displayEndings = computed(() => ALL_ENDINGS.filter((e) => e.priority > 0));
const total = displayEndings.value.length;
const unlockedCount = computed(() =>
  store.unlockedEndings.filter((id) => displayEndings.value.some((e) => e.id === id)).length,
);

function safeRating(ratingFn: (s: GameState) => Rating): Rating {
  try {
    return ratingFn({} as GameState);
  } catch {
    return 'C';
  }
}

function back() {
  store.setView('start');
}
</script>

<template>
  <div class="endings-view">
    <header>
      <h1>结局图鉴</h1>
      <p class="progress">{{ unlockedCount }} / {{ total }} 已解锁</p>
    </header>

    <div class="grid">
      <div
        v-for="ending in displayEndings"
        :key="ending.id"
        class="card"
        :class="{ locked: !unlockedSet.has(ending.id) }"
      >
        <template v-if="unlockedSet.has(ending.id)">
          <div class="rating" :class="safeRating(ending.rating)">{{ safeRating(ending.rating) }}</div>
          <h3>{{ ending.title }}</h3>
          <span class="status">已解锁</span>
        </template>
        <template v-else>
          <div class="rating unknown">?</div>
          <h3>???</h3>
          <span class="status">未解锁</span>
        </template>
      </div>
    </div>

    <button class="back" @click="back">返回首页</button>
  </div>
</template>

<style scoped>
.endings-view { padding: 2rem 1rem; max-width: 720px; margin: 0 auto; }
header { text-align: center; margin-bottom: 1.5rem; }
h1 { margin: 0; }
.progress { color: #666; margin-top: 0.5rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; text-align: center;
  background: #fafafa; transition: transform 0.1s; }
.card.locked { background: #f0f0f0; color: #aaa; }
.card h3 { margin: 0.5rem 0; font-size: 1rem; }
.rating { display: inline-block; width: 2rem; height: 2rem; line-height: 2rem;
  border-radius: 50%; font-weight: bold; font-size: 0.9rem; }
.rating.S { background: gold; color: black; }
.rating.A { background: #c0c0c0; color: black; }
.rating.B { background: #cd7f32; color: white; }
.rating.C { background: #888; color: white; }
.rating.D { background: #444; color: white; }
.rating.unknown { background: #ccc; color: #888; }
.status { font-size: 0.8rem; color: #888; }
.card.locked .status { color: #aaa; }
.back { display: block; margin: 2rem auto 0; padding: 0.6rem 1.5rem; cursor: pointer;
  background: #2c3e50; color: white; border: none; border-radius: 4px; font-size: 0.95rem; }
</style>
