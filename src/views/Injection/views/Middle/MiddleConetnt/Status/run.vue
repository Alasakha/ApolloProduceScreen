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
    <div v-if="!isLoading && !isDataEmpty" ref="runIndicators" style="width:10vw; height: 15vh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts';

const runIndicators = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const isDataEmpty = ref(false);
let chartInstance: echarts.ECharts | null = null;

// 初始化 ECharts
const drawhstatusIndicators = () => {
  if (!runIndicators.value) return;
  
  // 初始化 ECharts
  chartInstance = echarts.init(runIndicators.value);

  // 配置 option
  const option: echarts.EChartsOption = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: 18
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 1,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
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
          color:'blue'
        },
        data: [
          {
            value: 70
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

// 组件挂载时初始化图表
onMounted(() => {
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