import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as API from '@/api/chat'

export const useChatStore = defineStore('chat', () => {
  const controller = ref<AbortController>()

  const messages = ref<Message[]>([])

  const chat = async (text: string, callback: Function) => {
    controller.value = new AbortController()
    const symbol = Symbol('message')
    messages.value.push({
      symbol,
      user: text,
      assistant: '',
    })
    callback()
    const result = await API.chat(messages.value, controller.value, (data) => {
      messages.value.find(item => item.symbol === symbol)!.assistant = data
      callback()
    }).catch((e) => {
      window.console.error(e)
      return `<${e.message}>`
    })
    messages.value.find(item => item.symbol === symbol)!.assistant = result || '<Empty Message>'
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
