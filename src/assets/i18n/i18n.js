import { ref, computed } from 'vue'
import en from './en.json'
import fr from './fr.json'

const messages = { en, fr }
const currentLang = ref('en')

export const t = computed(() => messages[currentLang.value])

export const setLang = (lang) => { 
  currentLang.value = lang 
}
export const lang = currentLang
