<template>
  <div class="h-full">
    <div class="text-center text-[#00eeff] text-3xl 
      3xl:text-xl 
      4xl:text-3xl font-light tracking-widest  title-elegant w-full">
      今日电表
    </div>

    <div class="gauge-container">
      <div 
        class="gauge-item" 
        v-for="item in energyStore.dailyElectricData" 
        :key="item.machCode"
      >
        <v-chart :option="getGaugeOption(item)" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getGaugeBaseOption } from './echarts';
import { useEnergyStore } from '@/store/energy';
import { ELECTRIC_METER_CONFIG } from '@/types/energy';
import type { EnergyData } from '@/types/energy';

use([CanvasRenderer, GaugeChart, TitleComponent, TooltipComponent]);

const energyStore = useEnergyStore();
const updateInterval = ref<number | null>(null);

// 获取响应式字体配置
const getResponsiveFontSizes = () => {
  const width = window.innerWidth;
  if (width < 1280) {
    return { axisLabel: 8, title: 10, detail: 14 };
  } else if (width < 1850) {
    return { axisLabel: 9, title: 11, detail: 16 };
  } else if (width < 2500) {
    return { axisLabel: 10, title: 12, detail: 18 };
  } else {
    return { axisLabel: 12, title: 14, detail: 22 };
  }
};

// 获取仪表盘配置
const getGaugeOption = (item: EnergyData) => {
  const config = ELECTRIC_METER_CONFIG[item.machCode] || { 
    name: item.machName, 
    colors: ['#00eeff', '#0066ff'] 
  };
  
  const fontSizes = getResponsiveFontSizes();
  const baseOption = getGaugeBaseOption(
    config.name,
    0,
    Math.max(200, item.numberPower * 1.2), // 动态设置最大值
    item.numberPower,
    'kW',
    config.colors
  );
  
  // 覆盖字体大小
  baseOption.series[0].axisLabel.fontSize = fontSizes.axisLabel;
  baseOption.series[0].title.fontSize = fontSizes.title;
  baseOption.series[0].detail.fontSize = fontSizes.detail;
  
  return baseOption;
};

// Today组件现在使用store中的当日数据，不再独立获取数据
// 数据由主组件统一管理

console.log('📊 Line1/Today组件：使用store中的当日数据')

// 清理不再需要的定时器
onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value);
    updateInterval.value = null;
  }
});
</script>

<style scoped>
.gauge-container {
  height: calc(100% - 60px);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  padding: 10px;
  overflow: visible;
}

/* 小屏幕断点：10列1行，紧凑布局 */
@media (max-width: 1279px) {
  .gauge-container {
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 1fr;
    height: calc(100% - 30px);
    gap: 1px;
    padding: 2px;
  }
}

/* xl断点：10列1行布局 */
@media (min-width: 1280px) and (max-width: 1849px) {
  .gauge-container {
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 1fr;
    height: calc(100% - 40px);
    gap: 2px;
    padding: 3px;
  }
}

/* 3xl断点优化：10列1行，适中间距 */
@media (min-width: 1850px) and (max-width: 2499px) {
  .gauge-container {
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 1fr;
    height: calc(100% - 35px);
    gap: 3px;
    padding: 4px;
    margin-top: 5px;
  }
}

/* 4xl断点：10列1行，较大间距 */
@media (min-width: 2500px) {
  .gauge-container {
    height: calc(100% - 50px);
    gap: 5px;
    padding: 6px;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 1fr;
  }
}

.gauge-item {
  min-height: 180px;
  min-width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 小屏幕断点：10列超紧凑布局 */
@media (max-width: 1279px) {
  .gauge-item {
    min-height: 100px;
    min-width: 60px;
    max-height: 120px;
    max-width: 80px;
  }
}

/* xl断点：10列紧凑布局 */
@media (min-width: 1280px) and (max-width: 1849px) {
  .gauge-item {
    min-height: 120px;
    min-width: 80px;
    max-height: 140px;
    max-width: 100px;
  }
}

/* 3xl断点：10列标准布局 */
@media (min-width: 1850px) and (max-width: 2499px) {
  .gauge-item {
    min-height: 140px;
    min-width: 100px;
    max-height: 160px;
    max-width: 120px;
  }
}

/* 4xl断点：10列舒适布局 */
@media (min-width: 2500px) {
  .gauge-item {
    min-height: 170px;
    min-width: 120px;
    max-height: 200px;
    max-width: 150px;
  }
}

:deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}
</style>