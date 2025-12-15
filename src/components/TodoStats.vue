<script setup>
import { computed } from 'vue'
import { translations } from '../assets/i18n/i18n'

const props = defineProps(['todos'])

const total = computed(() => props.todos.length)
const completed = computed(() => props.todos.filter(t => t.done).length)
const percentage = computed(() => {
  if (total.value === 0) return 0
  return Math.round((completed.value / total.value) * 100)
})
</script>

<template>
  <div class="stats-container" v-if="total > 0">
    <div class="stats-text">
      <span>{{ translations.stats.progress }}</span>
      <span>{{ percentage }}%</span>
    </div>
    <div class="progress-bar-bg">
      <div 
        class="progress-bar-fill" 
        :style="{ width: percentage + '%' }"
        :class="{ 'full': percentage === 100 }"
      ></div>
    </div>
  </div>
</template>
