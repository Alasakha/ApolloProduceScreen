<template>
  <div class="p-4">
    <div class="mb-4 text-lg">断点测试</div>
    
    <!-- 测试块 1：纯背景色 -->
    <div class="w-full h-20 mb-4 bg-red-500 sm:bg-orange-500 md:bg-yellow-500 lg:bg-green-500 xl:bg-blue-500 2xl:bg-indigo-500 3xl:bg-purple-500 4xl:bg-pink-500"></div>
    
    <!-- 测试块 2：文字颜色 -->
    <div class="w-full mb-4">
      <div class="text-red-500 sm:text-orange-500 md:text-yellow-500 lg:text-green-500 xl:text-blue-500 2xl:text-indigo-500 3xl:text-purple-500 4xl:text-pink-500">
        颜色测试文本
      </div>
    </div>
    
    <!-- 当前窗口信息 -->
    <div class="space-y-2">
      <div>当前窗口宽度: {{ width }}px</div>
      <div>当前断点:</div>
      <div class="pl-4">
        <div class="sm:hidden">xs (< 640px)</div>
        <div class="hidden sm:block md:hidden">sm (640px - 767px)</div>
        <div class="hidden md:block lg:hidden">md (768px - 1023px)</div>
        <div class="hidden lg:block xl:hidden">lg (1024px - 1279px)</div>
        <div class="hidden xl:block 2xl:hidden">xl (1280px - 1535px)</div>
        <div class="hidden 2xl:block 3xl:hidden">2xl (1536px - 1849px)</div>
        <div class="hidden 3xl:block 4xl:hidden">3xl (1850px - 2499px)</div>
        <div class="hidden 4xl:block">4xl (≥ 2500px)</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(window.innerWidth)

const updateWidth = () => {
  width.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script> 