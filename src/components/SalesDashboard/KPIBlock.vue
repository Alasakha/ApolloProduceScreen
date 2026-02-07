<template>
    <div
      class="relative group rounded-2xl border bg-slate-900/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-1"
      :class="[
        // 动态绑定边框颜色和阴影
        theme.borderColor,
        theme.shadowColor,
        'hover:shadow-lg' // 悬停增强阴影
      ]"
    >
      <!-- 内部光晕背景 (Hover时显现) -->
      <div
        class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br"
        :class="theme.gradientBg"
      ></div>
  
      <div class="relative p-5 h-full flex flex-col justify-between">
        <!-- 头部：标题 + 趋势标签 -->
        <div class="flex items-start justify-between mb-2">
          <span class="text-sm text-slate-400 font-medium tracking-wide">
            {{ title }}
          </span>
          
          <!-- 趋势胶囊 -->
          <div
            class="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono bg-slate-800/80 border border-white/5"
            :class="isTrendUp ? 'text-emerald-400' : 'text-rose-400'"
          >
            <component :is="isTrendUp ? ArrowUpIcon : ArrowDownIcon" class="w-3 h-3" />
            <span>{{ trendValue }}</span>
          </div>
        </div>
  
        <!-- 核心数值 -->
        <div class="relative">
          <span
            class="text-4xl font-black tracking-tight font-[DIN,sans-serif]"
            :class="[
              'bg-clip-text text-transparent bg-gradient-to-r',
              theme.textGradient
            ]"
          >
            {{ value }}
          </span>
          
          <!-- 底部装饰线条 (原本是一个宽度变化的线，现在做成底部微光) -->
          <div 
            class="absolute -bottom-2 left-0 h-[2px] w-8 rounded-full transition-all duration-300 group-hover:w-full opacity-60"
            :class="theme.accentBg"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  // 简单的 SVG 图标组件，避免引入外部库导致报错
  const ArrowUpIcon = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>' }
  const ArrowDownIcon = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m0 0l-7-7m7 7l7-7"/></svg>' }
  
  // 定义 Props
  interface Props {
    title: string
    value: string
    trend?: 'up' | 'down' // 默认为 up
    trendValue: string
    color?: 'cyan' | 'orange' | 'purple' // 默认为 cyan
  }
  
  const props = withDefaults(defineProps<Props>(), {
    trend: 'up',
    color: 'cyan'
  })
  
  // === 核心优化：样式配置映射表 ===
  // 这种写法比在 template 里写一堆三元运算符要清晰得多，也容易扩展颜色
  const colorMap = {
    cyan: {
      borderColor: 'border-cyan-500/50 group-hover:border-cyan-400',
      shadowColor: 'shadow-cyan-500/10 hover:shadow-cyan-500/30',
      gradientBg: 'from-cyan-400/30 to-blue-600/30',
      textGradient: 'from-cyan-300 via-cyan-400 to-blue-400',
      accentBg: 'bg-cyan-400'
    },
    orange: {
      borderColor: 'border-orange-500/50 group-hover:border-orange-400',
      shadowColor: 'shadow-orange-500/10 hover:shadow-orange-500/30',
      gradientBg: 'from-orange-400/30 to-red-600/30',
      textGradient: 'from-orange-300 via-orange-400 to-amber-400',
      accentBg: 'bg-orange-400'
    },
    purple: {
      borderColor: 'border-purple-500/50 group-hover:border-purple-400',
      shadowColor: 'shadow-purple-500/10 hover:shadow-purple-500/30',
      gradientBg: 'from-purple-400/30 to-fuchsia-600/30',
      textGradient: 'from-purple-300 via-purple-400 to-pink-400',
      accentBg: 'bg-purple-400'
    }
  }
  
  // 计算当前主题
  const theme = computed(() => colorMap[props.color])
  const isTrendUp = computed(() => props.trend === 'up')
  </script>