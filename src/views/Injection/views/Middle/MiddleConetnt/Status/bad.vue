<template>
  <div>
    <!-- 如果正在加载，显示 loading -->
    <div v-if="isLoading" class="loading-container">
      <dv-loading>Loading...</dv-loading>
    </div>

    <!-- 如果没有数据，显示暂无数据 -->
    <div v-if="!isLoading && isDataEmpty" class="empty-container">
      暂无数据
    </div>

    <!-- 数据加载完成且非空时显示图表 -->
    <div v-if="!isLoading && !isDataEmpty" ref="badIndicators" style="width:10vw; height: 15vh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts';
import {getDeviceStatus} from '@/api/getInjection'
const badvalue = ref()
const badIndicators = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const isDataEmpty = ref(false);
let chartInstance: echarts.ECharts | null = null;

// 初始化 ECharts
const drawhstatusIndicators = () => {
  if (!badIndicators.value) return;
  
  // 初始化 ECharts
  chartInstance = echarts.init(badIndicators.value);

  // 配置 option
  const option: echarts.EChartsOption = {
    series: [
      {
        type: 'gauge',
        progress: {
        show: true,
        width: 18,
        // 进度条的颜色s
      },
      
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
            [0.6, 'rgba(248, 90, 73, 1)'],
              [1, 'rgba(216, 216, 216, 1)'],
            ]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 1,
          lineStyle: {
            width: 2,
            color: 'red'
          }
        },
        axisLabel: {
          distance: 25,
          color: 'red',
          fontSize: 0,
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 10,
          itemStyle: {
            borderWidth: 10
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 30,
          offsetCenter: [0, '50%'],
          color:'red'
        },
        data: [
          {
            value: badvalue.value
          }
        ]
      }
    ]
  };

  chartInstance.setOption(option);

  // 监听窗口大小变化，确保图表自适应
  window.addEventListener('resize', resizeChart);
};

// 窗口变化时重绘图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

const fetchData = async () => {
  try {
    const res = await getDeviceStatus();
    badvalue.value = res.data.deviceFault
    nextTick(drawhstatusIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
  }
};
// 组件挂载时初始化图表
onMounted(() => {
  fetchData()
  nextTick(() => {
    drawhstatusIndicators();
  });
});

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', resizeChart);
});
</script>

<style scoped>
.loading-container {
  text-align: center;
  padding: 20px;
}

.empty-container {
  text-align: center;
  font-size: 18px;
  color: #999;
}
</style>