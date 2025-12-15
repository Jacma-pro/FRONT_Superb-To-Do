import { ref, computed } from 'vue'
import en from './en.json'
import fr from './fr.json'

const messages = { en, fr }
const currentLang = ref('en')

// Simple "translations" object that returns the current language strings
export const translations = computed(() => messages[currentLang.value])

// Function to switch language
export const setLang = (lang) => { 
  currentLang.value = lang 
}

// Expose current lang if needed
export const activeLang = currentLang