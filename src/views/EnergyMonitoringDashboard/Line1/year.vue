<template>
    <div class="h-full">
      <div class="text-center text-[#00eeff] text-3xl 
  3xl:text-xl 
  4xl:text-3xl font-light tracking-widest mb-2 title-elegant w-full">
  本年电表
</div>
      
      <!-- 样式3：未来科幻 -->
      <!-- <div class="text-center text-[#00eeff] text-3xl font-bold uppercase tracking-[0.2em] mb-2 title-future">
        今日电表
      </div> -->
    
      <div class="gauge-container">
        <div 
          class="gauge-item" 
          v-for="(option, key) in TodaygaugeOptions" 
          :key="key"
        >
          <v-chart :option="option" autoresize />
        </div>
    </div>
    </div>
    </template>
    
    
    <script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { use } from 'echarts/core'
    import { CanvasRenderer } from 'echarts/renderers'
    import { GaugeChart } from 'echarts/charts'
    import { TitleComponent, TooltipComponent } from 'echarts/components'
    import VChart from 'vue-echarts'
    import { getGaugeBaseOption } from './echarts'
    import { useEnergyStore } from '@/store/energy'
    import { MACHINE_CODES, ELECTRIC_METER_CONFIG } from '@/types/energy'
    const energyStore = useEnergyStore()
    
    use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent])
    // 年度数据（响应式）
    const yearlyData = computed(() => energyStore.getYearlyData)

    // 根据当年数据构建每个表的仪表盘配置
    const TodaygaugeOptions = computed<Record<string, any>>(() => {
      const dataMap = new Map(yearlyData.value.map(item => [item.machCode, item]))
      const options: Record<string, any> = {}
      MACHINE_CODES.ELECTRIC.forEach(code => {
        const cfg = ELECTRIC_METER_CONFIG[code]
        const value = Number(dataMap.get(code)?.numberPower ?? 0)
        options[code] = getGaugeBaseOption(
          cfg?.name || code,
          0,
          Math.max(100, value * 1.2),
          value,
          'kW·h',
          cfg?.colors || ['#00eeff', '#0066ff']
        )
      })
      return options
    })

    onMounted(() => {
      energyStore.fetchYearlyData()
    })
    </script>
    
    
    <style scoped>
    /* 引入在线字体 */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;300;400;500;700;900&display=swap');
    
    .title-elegant {
      font-family: 'Noto Sans SC', sans-serif;
    }
    
    .gauge-container {
      height: 100%;
      display: flex;
      justify-content: space-between;
      gap: 5px;
      padding: 5px;
    }
    
    .gauge-item {
      width: calc(10% - 5px);
      height: calc(100% - 10px);
      padding: 2px;
    }
    
    :deep(.echarts) {
      width: 100% !important;
      height: 85% !important;
    }
    </style>
    
    
    
    
    