import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const JWT = computed(() => `Bearer ${token.value}`)

  return { token, JWT }
})
