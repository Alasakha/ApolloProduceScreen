<template>
<dv-border-box8 :dur="5">
  <GlobalTitle title="到货及时率"/>
  <!-- 图表容器 -->
  <div class="chartsbox w-full h-full flex">
    <div v-if="!isDataEmpty" ref="Indicators1" class="w-full h-[100%] flex-3"></div>
    <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl flex-3">今日暂无数据</div>
    
    <!-- 右侧数据展示区域
    <div class="flex-1 pr-4">
      <div v-if="!isDataEmpty" class="data-list flex flex-col justify-around h-full">
        <div v-for="(item, index) in processDataByStatus()" :key="index" class="data-item bg-[#8f88f7] rounded-lg flex h-[15%] items-center pl-2 mb-2">
          <div class="data-title text-white text-sm font-semibold flex-1">{{ item.purchaserName }}:</div>
          <div class="data-detail text-white text-sm flex-2 flex justify-around">
            <span>预交达成率: <span class="font-semibold text-cyan-300">{{ (item.deliveryRate * 100).toFixed(1) }}%</span></span>
            <span>准时排交达成率: <span class="font-semibold text-green-300">{{ (item.productionRate * 100).toFixed(1) }}%</span></span>
          </div>
        </div>
      </div>
      <div v-else class="data-list flex flex-col justify-around h-full">
        <div class="data-item bg-[#8f88f7] rounded-lg flex h-[15%] items-center pl-2">
          <div class="data-title text-white text-sm font-semibold flex-1">暂无数据:</div>
          <div class="data-detail text-white text-sm flex-2 flex justify-around">
            <span>预交达成率: <span class="font-semibold text-cyan-300">0%</span></span>
            <span>准时排交达成率: <span class="font-semibold text-green-300">0%</span></span>
          </div>
        </div>
      </div> -->
    <!-- </div> -->
   </div>  
  </dv-border-box8>
</template>


<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getPurchaseDeliveryRate } from '@/api/getnewInjection';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import * as echarts from 'echarts';
import { createChartOption } from './charts';

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const queryDate = getYesterday(); // 昨天的日期
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
const dataStatus = ref('none'); // 'none' | 'onlyDelivery' | 'onlyProduction' | 'both'
const deliveryData = ref([]);
const productionData = ref([]);
const Indicators1 = ref(null);
let chart = null;

// 渲染图表的函数
const drawMonthlyIndicators = (data) => {
  nextTick(() => {
    if (chart) {
      chart.dispose();
    }
    chart = echarts.init(Indicators1.value);
    const option = createChartOption(data);
    chart.setOption(option);
    
    // 添加窗口大小改变时的自适应
    window.addEventListener('resize', () => {
      chart && chart.resize();
    });
  });
};

// 请求数据
const fetchData = async () => {
  try {
    isLoading.value = true;
    // 获取交货日数据
    const deliveryRes = await getPurchaseDeliveryRate(1);
    // 获取排产日期数据
    const productionRes = await getPurchaseDeliveryRate(2);
    
    isLoading.value = false;
    
    // 保存原始数据
    deliveryData.value = deliveryRes.data || [];
    productionData.value = productionRes.data || [];
    
    // 判断数据状态
    const hasDelivery = deliveryData.value.length > 0;
    const hasProduction = productionData.value.length > 0;
    
    if (!hasDelivery && !hasProduction) {
      dataStatus.value = 'none';
      isDataEmpty.value = true;
    } else if (hasDelivery && !hasProduction) {
      dataStatus.value = 'onlyDelivery';
      isDataEmpty.value = false;
    } else if (!hasDelivery && hasProduction) {
      dataStatus.value = 'onlyProduction';
      isDataEmpty.value = false;
    } else {
      dataStatus.value = 'both';
      isDataEmpty.value = false;
    }
    
    // 根据状态处理数据并绘制图表
    const processedData = processDataByStatus();
    drawMonthlyIndicators(processedData);
    
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
    dataStatus.value = 'none';
  }
};

// 根据状态处理数据
const processDataByStatus = () => {
  switch (dataStatus.value) {
    case 'none':
      return [{
        purchaserName: '暂无数据',
        deliveryRate: 0,
        productionRate: 0
      }];
    
    case 'onlyDelivery':
      return deliveryData.value.map(item => ({
        purchaserName: item.purchaserName,
        deliveryRate: item.rate,
        productionRate: 0
      }));
    
    case 'onlyProduction':
      return productionData.value.map(item => ({
        purchaserName: item.purchaserName,
        deliveryRate: 0,
        productionRate: item.rate
      }));
    
    case 'both':
      // 合并两组数据
      return deliveryData.value.map(delivery => {
        const production = productionData.value.find(
          p => p.purchaserName === delivery.purchaserName
        ) || { rate: 0 };
        
        return {
          purchaserName: delivery.purchaserName,
          deliveryRate: delivery.rate,
          productionRate: production.rate
        };
      });
    
    default:
      return [];
  }
};

onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData);
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData);
  // 清理图表实例
  if (chart) {
    chart.dispose();
    chart = null;
  }
  // 移除窗口大小改变的监听
  window.removeEventListener('resize', () => {
    chart && chart.resize();
  });
});
</script>




<style scoped>
.chartsbox {
  padding: 20px;
}
</style>