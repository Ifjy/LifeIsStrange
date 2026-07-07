<script setup lang="ts">
import { useGameStore } from '../stores/game';
const store = useGameStore();
</script>

<template>
  <div class="game-view">
    <h2>{{ store.state?.age }}岁 · {{ store.state?.stage }}</h2>
    <p>游戏视图占位（Task 11 实现）</p>
  </div>
</template>
