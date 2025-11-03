<template>
  <div :dur="5" class="w-full h-full">
    <div class="chartsbox w-full h-full">
      <div v-if="!isDataEmpty && !isLoading" ref="chartRef" class="w-full h-full"></div>
      <div v-else-if="isLoading" class="text-white flex items-center justify-center h-full">正在加载配送异常数据...</div>
      <div v-else class="text-white flex items-center justify-center h-full">暂无数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { getPmcKpiWithCk } from '@/api/getScmInfo.js'
import { createChartOption } from './charts';
import * as echarts from 'echarts';

const chartRef = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const data = ref([]);
let chartInstance = null;
let resizeHandler = null;
let resizeObserver = null;

const drawChart = (retryCount = 0) => {
  nextTick(() => {
    console.log('drawChart chartRef.value:', chartRef.value);
    console.log('isDataEmpty:', isDataEmpty.value, 'data.length:', data.value.length);
    
    if (!chartRef.value || isDataEmpty.value || data.value.length === 0) {
      // 如果容器还没准备好，且重试次数少于20次，则延迟重试
      if (!chartRef.value && retryCount < 20) {
        setTimeout(() => drawChart(retryCount + 1), 100);
      }
      return;
    }
    
    // 检查容器尺寸，使用 clientHeight 更准确
    const width = chartRef.value.clientWidth || chartRef.value.offsetWidth;
    const height = chartRef.value.clientHeight || chartRef.value.offsetHeight;
    console.log('容器尺寸:', width, height, 'clientHeight:', chartRef.value.clientHeight);
    
    // 如果容器尺寸为0，延迟重试（增加重试次数）
    if ((width === 0 || height === 0) && retryCount < 20) {
      setTimeout(() => drawChart(retryCount + 1), 150);
      return;
    }
    
    // 如果容器有尺寸，初始化图表
    try {
      if (chartInstance) {
        chartInstance.dispose();
      }
      
      chartInstance = echarts.init(chartRef.value);
      const option = createChartOption(data.value, '配送异常', ['total']);
      console.log('option:', option);
      chartInstance.setOption(option);
      
      // 使用 ResizeObserver 监听容器尺寸变化
      if (!resizeObserver && chartRef.value) {
        resizeObserver = new ResizeObserver(() => {
          if (chartInstance && !chartInstance.isDisposed()) {
            chartInstance.resize();
          }
        });
        resizeObserver.observe(chartRef.value);
      }
      
      // 确保 resize 事件监听器只添加一次（作为备用）
      if (!resizeHandler) {
        resizeHandler = () => {
          if (chartInstance && !chartInstance.isDisposed()) {
            chartInstance.resize();
          }
        };
        window.addEventListener('resize', resizeHandler);
      }
    } catch (error) {
      console.error('初始化图表失败:', error);
      // 如果初始化失败，延迟重试
      if (retryCount < 10) {
        setTimeout(() => drawChart(retryCount + 1), 200);
      }
    }
  });
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const res = await getPmcKpiWithCk('E', '总仓');
    console.log('fetchData 接口返回:', res);
    if (res.code === 200 && res.data && res.data.length > 0) {
      data.value = res.data;
      isDataEmpty.value = false;
    } else {
      data.value = [];
      isDataEmpty.value = true;
    }
  } catch (e) {
    isDataEmpty.value = true;
    data.value = [];
    console.error('fetchData error:', e);
  } finally {
    isLoading.value = false;
  }
};

watch(
  [isLoading, isDataEmpty, data],
  async ([loading, empty, d]) => {
    if (!loading && !empty && d && d.length > 0) {
      await nextTick();
      // 给容器更多时间渲染，特别是 dv-border-box8 动画需要时间
      setTimeout(() => {
        drawChart();
      }, 300);
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  fetchData();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<style scoped>
.chartsbox {
  min-height: 200px; /* 确保最小高度 */
}
</style>