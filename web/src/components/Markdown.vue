<script setup lang="ts">
import { md } from '@/utils/markdown'

const props = defineProps<{
  value: string
}>()
</script>

<template>
  <div class="markdown-body" v-html="md.render(props.value)" />
</template>
