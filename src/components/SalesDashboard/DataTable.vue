<template>
  <div class="h-full flex flex-col">
    <!-- Table Header -->
    <div class="flex-none shrink-0">
      <div class="grid grid-cols-7 gap-2 px-3 py-2 bg-slate-700/50 border-b border-white/10">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider truncate">{{ dimensionLabel }}</div>
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider text-right truncate">总销售额(万元)</div>
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider text-right truncate">毛利额(万元)</div>
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider text-right truncate">综合毛利率</div>
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider text-right truncate">销售额同比</div>
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider text-right truncate">毛利额同比</div>
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider text-right truncate">毛利率同比</div>
      </div>
    </div>

    <!-- Table Body -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <div
        v-for="(row, index) in data"
        :key="index"
        class="grid grid-cols-7 gap-2 px-3 py-2 border-b border-white/5 transition-colors items-center"
        :class="[
          index < 3 ? 'bg-gradient-to-r from-amber-500/5 to-transparent' : 'hover:bg-white/5',
          index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/60'
        ]"
      >
        <!-- 动态维度字段 -->
        <div class="flex items-center min-w-0">
          <div
            v-if="index < 3"
            class="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold shrink-0"
            :class="[
              index === 0 ? 'bg-amber-500 text-white' : '',
              index === 1 ? 'bg-gray-400 text-white' : '',
              index === 2 ? 'bg-orange-600 text-white' : ''
            ]"
          >
            {{ index + 1 }}
          </div>
          <span
            class="font-medium truncate"
            :class="index < 3 ? 'text-amber-400' : 'text-white'"
            :title="row.dimension"
          >
            {{ row.dimension }}
          </span>
        </div>

        <!-- 总销售额(万元) -->
        <div class="flex items-center justify-end text-white text-sm truncate" :title="row.totalSales.toLocaleString()">
          {{ formatNumber(row.totalSales) }}
        </div>

        <!-- 毛利额(万元) -->
        <div class="flex items-center justify-end text-white text-sm truncate" :title="row.grossProfit.toLocaleString()">
          {{ formatNumber(row.grossProfit) }}
        </div>

        <!-- 综合毛利率 -->
        <div class="flex items-center justify-end">
          <span
            class="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
            :class="getMarginClass(row.margin)"
          >
            {{ row.margin.toFixed(1) }}%
          </span>
        </div>

        <!-- 销售额同比 -->
        <div class="flex items-center justify-end">
          <span
            class="flex items-center text-xs font-medium whitespace-nowrap"
            :class="getYoYClass(row.salesYoY)"
          >
            <svg
              class="w-3 h-3 mr-0.5 shrink-0"
              :class="row.salesYoY >= 0 ? 'text-green-400' : 'text-red-400'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
                :transform="row.salesYoY < 0 ? 'rotate(180)' : ''"
              />
            </svg>
            {{ row.salesYoY >= 0 ? '+' : '' }}{{ row.salesYoY.toFixed(1) }}%
          </span>
        </div>

        <!-- 毛利额同比 -->
        <div class="flex items-center justify-end">
          <span
            class="flex items-center text-xs font-medium whitespace-nowrap"
            :class="getYoYClass(row.profitYoY)"
          >
            <svg
              class="w-3 h-3 mr-0.5 shrink-0"
              :class="row.profitYoY >= 0 ? 'text-green-400' : 'text-red-400'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
                :transform="row.profitYoY < 0 ? 'rotate(180)' : ''"
              />
            </svg>
            {{ row.profitYoY >= 0 ? '+' : '' }}{{ row.profitYoY.toFixed(1) }}%
          </span>
        </div>

        <!-- 毛利率同比 -->
        <div class="flex items-center justify-end">
          <span
            class="flex items-center text-xs font-medium whitespace-nowrap"
            :class="getYoYClass(row.marginYoY)"
          >
            <svg
              class="w-3 h-3 mr-0.5 shrink-0"
              :class="row.marginYoY >= 0 ? 'text-green-400' : 'text-red-400'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
                :transform="row.marginYoY < 0 ? 'rotate(180)' : ''"
              />
            </svg>
            {{ row.marginYoY >= 0 ? '+' : '' }}{{ row.marginYoY.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ROETableItem } from '@/api/roe'

interface Props {
  data: ROETableItem[]
  dimensionLabel?: string
}

const props = defineProps<Props>()
const dimensionLabel = computed(() => props.dimensionLabel || '维度')

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const getMarginClass = (margin: number): string => {
  if (margin >= 18) return 'bg-green-500/20 text-green-400'
  if (margin >= 15) return 'bg-yellow-500/20 text-yellow-400'
  return 'bg-red-500/20 text-red-400'
}

const getYoYClass = (value: number): string => {
  if (value > 15) return 'text-green-400'
  if (value > 0) return 'text-green-300'
  if (value > -15) return 'text-red-300'
  return 'text-red-400'
}
</script>

<style scoped>
/* Sticky header */
div:first-child {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Custom scrollbar for table body */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
