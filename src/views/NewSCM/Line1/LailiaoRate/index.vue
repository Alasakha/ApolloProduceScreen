
<template>
<dv-border-box8 :dur="5">
<GlobalTitle title="来料合格率" :size="1" />

  
      <!-- 图表容器 -->
      <div class="chartsbox w-full h-full">
        <div v-if="!isDataEmpty" ref="Indicators1" class="w-full h-[100%]"></div>
        <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl"> 今日暂无数据</div>
       </div>
     
  </dv-border-box8>
</template>


<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getIncome0kRateChart } from '@/api/getScmInfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import * as echarts from 'echarts';
import { createChartOption } from './charts';

// 获取本月1号
const getFirstDayOfMonth = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
};

// 获取昨天
const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const startDay = getFirstDayOfMonth(); // 本月1号
const endDay = getYesterday(); // 昨天

// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
const Indicators1 = ref(null);


// 渲染图表的函数
const drawMonthlyIndicators = (regularData, aClassData) => {
  nextTick(() => {
    const Indicators1Element = echarts.init(Indicators1.value);
    const option = createChartOption(regularData, aClassData);
    Indicators1Element.setOption(option);
  });
};

// 处理数据
const processData = (regularData, aClassData) => {
  const regularFormattedData = formatPieChartData(regularData, 'purchaserName', 'ratio');
  const aClassFormattedData = formatPieChartData(aClassData, 'purchaserName', 'ratio');
  
  console.log('regularFormattedData', regularFormattedData);
  console.log('aClassFormattedData', aClassFormattedData);
  
  // 检查是否有数据
  if (regularFormattedData.length === 0 && aClassFormattedData.length === 0) {
    isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
  } else {
    isDataEmpty.value = false;
    drawMonthlyIndicators(regularFormattedData, aClassFormattedData);  // 渲染合并柱状图
  }
};

// 请求数据
const fetchData = () => {
  // 并行请求常规客户和A类客户的数据
  Promise.all([
    getIncome0kRateChart(startDay, endDay, '1'),
    getIncome0kRateChart(startDay, endDay, '2')
  ]).then(([regularRes, aClassRes]) => {
    isLoading.value = false;   // 加载完成，关闭 loading 状态
    processData(regularRes.data, aClassRes.data);  // 处理数据并渲染图表
  }).catch(() => {
    isLoading.value = false;
    isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
  });
};

onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
});
</script>




<style scoped>

</style>