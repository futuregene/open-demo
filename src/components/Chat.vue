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

const handleChat = async () => {
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

const handleClear = () => {
  messages.value = []
}
</script>

<template>
  <div class="h-[100vh] flex flex-col bg-white">
    <div ref="scrollRef" class="h-[calc(100%-4rem)] overflow-x-hidden">
      <ul>
        <li v-for="m of messages" :key="m.symbol">
          <div class="flex gap-4 items-start p-4 border-b">
            <div class="w-16 bg-black/10 text-center py-1">
              你
            </div>
            <div class="flex-1 font-markdown self-center">
              <div class="text-base">
                {{ m.user }}
              </div>
            </div>
          </div>
          <div class="flex gap-4 items-start p-4 border-b">
            <div class="w-16 bg-black/10 text-center py-1">
              客服
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
    <div class="h-16 flex gap-2 py-3 px-4 border-t bg-slate-50">
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
