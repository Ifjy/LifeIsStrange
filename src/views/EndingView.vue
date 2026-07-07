<script setup lang="ts">
import { useGameStore } from '../stores/game';
const store = useGameStore();
</script>

<template>
  <div class="ending-view">
    <h2>结局：{{ store.currentEndingId }}</h2>
    <button @click="store.setView('start')">返回首页</button>
  </div>
</template>
