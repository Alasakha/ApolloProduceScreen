<template>
    
    <div class="bg-[#1B2A4F] rounded-lg text-center p-3 text-white shadow-md">
      <div class="text-sm opacity-80">{{ label }}</div>
      <div class="text-2xl font-bold  text-cyan-300">
        {{ valueDisplay }}
      </div>
    </div>


  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  // ✅ 定义 props 类型
  interface Props {
    label: string
    value: string | number | null | undefined
  }
  
  const props = defineProps<Props>()
  
  const valueDisplay = computed(() =>
    props.value === null || props.value === undefined || props.value === ''
      ? '无数据'
      : props.value
  )
  </script>