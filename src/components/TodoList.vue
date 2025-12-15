<script setup>
import { ref, nextTick } from 'vue'
import { translations } from '../assets/i18n/i18n'

defineProps(['todos'])
const emit = defineEmits(['remove-todo', 'toggle-todo', 'update-todo'])

const editingId = ref(null)
const editText = ref('')
const editDate = ref('')

const startEdit = (todo) => {
  editingId.value = todo.id
  editText.value = todo.text
  editDate.value = todo.deadline || ''
  // Focus input after render
  nextTick(() => {
    const input = document.querySelector(`.edit-input[data-id="${todo.id}"]`)
    if (input) input.focus()
  })
}

const cancelEdit = () => {
  editingId.value = null
  editText.value = ''
  editDate.value = ''
}

const finishEdit = (todo) => {
  if (editText.value.trim()) {
    emit('update-todo', { 
      ...todo, 
      text: editText.value,
      deadline: editDate.value 
    })
  }
  editingId.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateString) < today
}
</script>

<template>
  <TransitionGroup name="list" tag="ul" class="todo-list">
    <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.done }">
      
      <!-- Checkbox -->
      <input 
        type="checkbox" 
        :checked="todo.done" 
        @change="$emit('toggle-todo', todo)"
      />

      <!-- Content (View Mode) -->
      <div v-if="editingId !== todo.id" class="todo-content" @dblclick="startEdit(todo)">
        <div class="text-group">
          <span class="todo-text">{{ todo.text }}</span>
          <span v-if="todo.deadline" :class="['deadline-badge', { overdue: isOverdue(todo.deadline) && !todo.done }]">
            📅 {{ formatDate(todo.deadline) }}
          </span>
        </div>
        <span :class="['priority-badge', todo.priority]">{{ translations.priorities[todo.priority] }}</span>
      </div>

      <!-- Content (Edit Mode) -->
      <div v-else class="todo-content">
        <input 
          v-model="editText" 
          @keyup.enter="finishEdit(todo)"
          @keyup.esc="cancelEdit"
          class="edit-input"
          :data-id="todo.id"
        />
        <input 
          type="date"
          v-model="editDate"
          @keyup.enter="finishEdit(todo)"
          @keyup.esc="cancelEdit"
          class="date-input edit-date"
        />
        <button @click="finishEdit(todo)" class="icon-btn save-btn" title="Save">✓</button>
        <button @click="cancelEdit" class="icon-btn cancel-btn" title="Cancel">✕</button>
      </div>

      <!-- Actions -->
      <div class="actions" v-if="editingId !== todo.id">
        <button @click="startEdit(todo)" class="icon-btn edit-btn" :title="translations.actions.edit">
          ✎
        </button>
        <button @click="$emit('remove-todo', todo)" class="icon-btn delete-btn" :title="translations.actions.delete">
          ×
        </button>
      </div>
    </li>
  </TransitionGroup>
</template>
