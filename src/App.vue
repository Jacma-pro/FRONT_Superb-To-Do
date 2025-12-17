<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoFilters from './components/TodoFilters.vue'
import TodoList from './components/TodoList.vue'
import TodoStats from './components/TodoStats.vue'
import { translations, setLang, activeLang } from './assets/i18n/i18n'

// State
const todos = ref([])
const filter = ref('all')
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('my-todos')
  if (saved) {
    todos.value = JSON.parse(saved)
  }
  
  // Load theme
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.body.classList.add('dark-mode')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.body.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
}

watch(todos, (newVal) => {
  localStorage.setItem('my-todos', JSON.stringify(newVal))
}, { deep: true })

// Actions
const addTodo = ({ text, priority, deadline }) => {
  todos.value.unshift({
    id: Date.now(),
    text: text,
    priority: priority,
    deadline: deadline,
    done: false
  })
}

const removeTodo = (todo) => {
  todos.value = todos.value.filter(item => item.id !== todo.id)
}

const toggleTodo = (todo) => {
  const foundTodo = todos.value.find(item => item.id === todo.id)
  if (foundTodo) foundTodo.done = !foundTodo.done
}

const updateTodo = (updatedTodo) => {
  const index = todos.value.findIndex(item => item.id === updatedTodo.id)
  if (index !== -1) {
    todos.value[index] = updatedTodo
  }
}

const clearCompleted = () => {
  if (confirm(translations.value.confirm.clearCompleted)) {
    todos.value = todos.value.filter(todo => !todo.done)
  }
}

const clearAll = () => {
  if (confirm(translations.value.confirm.clearAll)) {
    todos.value = []
  }
}

const filteredTodos = computed(() => {
  let list = todos.value
  
  if (filter.value === 'active') list = list.filter(todo => !todo.done)
  else if (filter.value === 'completed') list = list.filter(todo => todo.done)
  
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  
  return list.sort((todoA, todoB) => {
    if (todoA.done === todoB.done) {
      return priorityOrder[todoB.priority] - priorityOrder[todoA.priority]
    }
    return todoA.done ? 1 : -1
  })
})
</script>

<template>
  <div class="container">
    <div class="header-row">
      <h1>{{ translations.title }}</h1>
      <div class="controls">
        <button @click="toggleTheme" class="theme-btn" :title="isDark ? 'Light Mode' : 'Dark Mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <div class="lang-switch">
          <button @click="setLang('en')" :class="{ active: activeLang === 'en' }">🇬🇧</button>
          <button @click="setLang('fr')" :class="{ active: activeLang === 'fr' }">🇫🇷</button>
        </div>
      </div>
    </div>
    
    <TodoStats :todos="todos" />

    <TodoInput @add-todo="addTodo" />
    
    <TodoFilters 
      :currentFilter="filter" 
      @set-filter="(newFilter) => filter = newFilter" 
    />
    
    <TodoList 
      :todos="filteredTodos"
      @remove-todo="removeTodo"
      @toggle-todo="toggleTodo"
      @update-todo="updateTodo"
    />

    <div class="footer" v-if="todos.length > 0">
      <p>{{ todos.filter(todo => !todo.done).length }} {{ translations.itemsLeft }}</p>
      <div class="footer-actions">
        <button @click="clearCompleted" v-if="todos.some(todo => todo.done)"
          class="text-btn">{{ translations.actions.clearCompleted }}
        </button>
        <button @click="clearAll" class="text-btn danger">{{ translations.actions.clearAll }}</button>
      </div>
    </div>
  </div>
</template>