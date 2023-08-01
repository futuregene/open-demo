<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import Markdown from './Markdown.vue'
import Spin from './Spin.vue'
import { useChatStore } from '@/stores/chat'
import useScrollHook from '@/hooks/scroll'

const chatStore = useChatStore()
const { messages } = storeToRefs(chatStore)
const { chat, stop } = chatStore
const { scrollRef, scrollToBottomIfAtBottom } = useScrollHook()
const newMessage = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<HTMLInputElement>()

async function handleChat() {
  if (newMessage.value !== '') {
    loading.value = true
    const m = newMessage.value
    newMessage.value = ''
    await chat(m, () => {
      scrollToBottomIfAtBottom()
    }).finally(() => {
      loading.value = false
    })
    scrollToBottomIfAtBottom()
    inputRef.value?.focus()
  }
}

function handleClear() {
  messages.value = []
}
</script>

<template>
  <div class="h-[100vh] flex flex-col bg-white">
    <div ref="scrollRef" class="h-[calc(100%-4rem)] overflow-x-hidden">
      <ul>
        <li v-for="m of messages" :key="m.symbol">
          <div class="flex gap-4 items-start p-4 border-b">
            <div class="w-8 h-8 py-1 flex justify-center text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2Zm-8-9a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" /></svg>
            </div>
            <div class="flex-1 font-markdown self-center">
              <div class="text-base">
                {{ m.user }}
              </div>
            </div>
          </div>
          <div class="flex gap-4 items-start p-4 border-b">
            <div class="w-8 h-8 py-1 flex justify-center text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.062A8.001 8.001 0 0 1 12 23v-2a6 6 0 0 0 6-6V9A6 6 0 0 0 6 9v7H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1.062a8.001 8.001 0 0 1 15.876 0H21ZM7.76 15.785l1.06-1.696A5.972 5.972 0 0 0 12 15a5.972 5.972 0 0 0 3.18-.911l1.06 1.696A7.963 7.963 0 0 1 12 17a7.962 7.962 0 0 1-4.24-1.215Z" /></svg>
            </div>
            <div
              v-if="m.assistant"
              class="flex-1 self-center"
            >
              <Markdown
                :value="m.assistant"
              />
            </div>
            <div v-else class="self-center">
              <Spin class="text-sky-500" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="h-16 flex gap-2 p-3 border-t bg-slate-50">
      <input
        ref="inputRef"
        v-model="newMessage" type="text" :disabled="loading" autocomplete="off" placeholder="请输入"
        class="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        @keypress.enter="handleChat"
      >
      <button
        v-if="!loading"
        class="inline-flex items-center px-4 leading-6 text-sm rounded-md shadow text-white bg-sky-500 hover:bg-sky-400 transition ease-in-out duration-150"
        @click="handleChat"
      >
        发送
      </button>
      <button
        v-else
        class="inline-flex items-center px-4 leading-6 text-sm rounded-md shadow text-white bg-amber-500 hover:bg-amber-400 transition ease-in-out duration-150"
        @click="stop"
      >
        <Spin class="text-white" />
        停止
      </button>
      <button
        class="inline-flex items-center px-4 leading-6 text-sm border border-slate-300 shadow-sm rounded-md text-slate-600 hover:bg-slate-100 transition ease-in-out duration-150"
        :disabled="loading"
        @click="handleClear"
      >
        重置
      </button>
    </div>
  </div>
</template>
