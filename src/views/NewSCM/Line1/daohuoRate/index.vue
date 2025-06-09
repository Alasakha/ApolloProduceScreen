<template>
<dv-border-box8 :dur="5">

  <GlobalTitle title="到货及时率"/>

  <!-- 图表容器 -->
  <div class="chartsbox w-full h-full ">
    <div v-if="!isDataEmpty" ref="Indicators1" class="w-full h-[100%]"></div>
    <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl"> 今日暂无数据</div>
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
    
    if (deliveryRes.data && productionRes.data && 
        deliveryRes.data.length > 0 && productionRes.data.length > 0) {
      isDataEmpty.value = false;
      
      // 合并两组数据
      const combinedData = deliveryRes.data.map(delivery => {
        const production = productionRes.data.find(
          p => p.purchaserName === delivery.purchaserName
        ) || { rate: 0 };
        
        return {
          purchaserName: delivery.purchaserName,
          deliveryRate: delivery.rate,
          productionRate: production.rate
        };
      });
      
      drawMonthlyIndicators(combinedData);
    } else {
      isDataEmpty.value = true;
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
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