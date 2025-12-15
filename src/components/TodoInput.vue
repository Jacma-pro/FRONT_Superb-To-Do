<script setup>
import { ref } from 'vue'
import { translations } from '../assets/i18n/i18n'

const newTodo = ref('')
const priority = ref('medium') // default priority
const deadline = ref('')
const emit = defineEmits(['add-todo'])

const handleSubmit = () => {
  if (newTodo.value.trim()) {
    emit('add-todo', {
      text: newTodo.value,
      priority: priority.value,
      deadline: deadline.value
    })
    newTodo.value = ''
    priority.value = 'medium' // reset to default
    deadline.value = ''
  }
}
</script>

<template>
  <div class="input-section">
    <input 
      v-model="newTodo" 
      @keyup.enter="handleSubmit"
      :placeholder="translations.inputPlaceholder" 
      class="todo-input"
    />
    
    <input 
      type="date" 
      v-model="deadline" 
      class="date-input"
      :title="translations.deadline"
    />

    <select v-model="priority" class="priority-select">
      <option value="low">{{ translations.priorities.low }}</option>
      <option value="medium">{{ translations.priorities.medium }}</option>
      <option value="high">{{ translations.priorities.high }}</option>
    </select>

    <button @click="handleSubmit" class="add-btn">{{ translations.add }}</button>
  </div>
</template>
