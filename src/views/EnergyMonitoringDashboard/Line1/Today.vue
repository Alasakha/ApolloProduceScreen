<template>
  <div class="h-full">
    <div class="text-center text-[#00eeff] text-3xl 
      3xl:text-xl 
      4xl:text-3xl font-light tracking-widest mb-2 title-elegant w-full">
      今日电表
    </div>

    <div class="gauge-container">
      <div 
        class="gauge-item" 
        v-for="item in energyStore.allConfiguredElectricMeters" 
        :key="item.machCode"
      >
        <v-chart :option="getGaugeOption(item)" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

// 获取仪表盘配置
const getGaugeOption = (item: EnergyData) => {
  const config = ELECTRIC_METER_CONFIG[item.machCode] || { 
    name: item.machName, 
    colors: ['#00eeff', '#0066ff'] 
  };
  
  return getGaugeBaseOption(
    config.name,
    0,
    Math.max(200, item.numberPower * 1.2), // 动态设置最大值
    item.numberPower,
    'kW',
    config.colors
  );
};

// 定时刷新数据
const startDataRefresh = async () => {
  await refreshData();
  updateInterval.value = window.setInterval(refreshData, 180000); // 每3分钟刷新一次
};

// 刷新数据
const refreshData = async () => {
  const today = new Date().toISOString().split('T')[0];
  await energyStore.fetchEnergyData(today);
};

// 生命周期钩子
onMounted(() => {
  startDataRefresh();
});

onUnmounted(() => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value);
  }
});
</script>

<style scoped>
.gauge-container {
  height: calc(100% - 40px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  padding: 10px;
}

.gauge-item {
  height: 250px;
  min-width: 200px;
}

:deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}
</style>