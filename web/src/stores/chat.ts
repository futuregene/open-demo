import { defineStore } from 'pinia'
import { ref, toRef } from 'vue'
import * as API from '@/api/chat'

export const useChatStore = defineStore('chat', () => {
  const controller = ref<AbortController>()
  const messages = ref<Message[]>([])

  const chat = async (text: string, callback: () => void) => {
    controller.value = new AbortController()
    const len = messages.value.push({
      symbol: Symbol('message'),
      user: text,
      assistant: '',
    })
    const currentMessage = toRef(messages.value, len - 1)
    callback()
    const result = await API.chat(messages.value, controller.value, (data) => {
      currentMessage.value.assistant = data
      callback()
    }).catch((e) => {
      window.console.error(e)
      return `<${e.message}>`
    })
    currentMessage.value.assistant = result || '<Empty Message>'
    callback()
  }

  const stop = () => {
    controller.value?.abort()
    controller.value = undefined
  }

  const clear = () => {
    messages.value = []
  }

  return {
    messages,
    chat,
    stop,
    clear,
  }
})
