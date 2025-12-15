<script setup>
import { t } from '../assets/i18n/i18n'
defineProps(['currentFilter'])
defineEmits(['set-filter'])
</script>

<template>
  <div class="filters">
    <button 
      @click="$emit('set-filter', 'all')" 
      :class="{ active: currentFilter === 'all' }"
    >{{ t.filters.all }}</button>
    <button 
      @click="$emit('set-filter', 'active')" 
      :class="{ active: currentFilter === 'active' }"
    >{{ t.filters.active }}</button>
    <button 
      @click="$emit('set-filter', 'completed')" 
      :class="{ active: currentFilter === 'completed' }"
    >{{ t.filters.completed }}</button>
  </div>
</template>
