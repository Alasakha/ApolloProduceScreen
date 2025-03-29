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
import {getDeviceStatus} from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
const runIndicators = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const isDataEmpty = ref(false);
const runvalue = ref('')
const totalvalue = ref('')
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
      max: Number(runvalue.value), // 让最大值动态等于 runvalue
      type: 'gauge',
      progress: {
        show: true,
        width: 10, // 统一宽度
        itemStyle: {
          color: 'rgb(0, 186, 255)' // 这里修改进度条的颜色
        }
      },
      axisLine: {
        lineStyle: {
          width: 5, // 统一宽度
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 3, // 统一长度
        lineStyle: {
          width: 1, // 统一线条宽度
          color: '#999'
        }
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 0,
      },
      anchor: {
        show: false, // 统一关闭
        showAbove: true,
        size: 10,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      pointer: {
        itemStyle: {
          color: 'rgb(0, 186, 255)' // 修改指针颜色
        }
      },
      detail: {
        valueAnimation: true,
        fontSize: 30,
        offsetCenter: [0, '100%'],
        color: 'rgb(0, 186, 255)' // 确保数值颜色一致
      },
      data: [
        {
          value: Number(runvalue.value)
        }
      ]
    }
  ]
};


  chartInstance.setOption(option);

  // 监听窗口大小变化，确保图表自适应
  window.addEventListener('resize', resizeChart);
};

const fetchData = async () => {
  try {
    const res = await getDeviceStatus();
    runvalue.value = res.data.deviceRun
    totalvalue.value = res.data.deviceTotal
    nextTick(drawhstatusIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
  }
};


// 窗口变化时重绘图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 组件挂载时初始化图表
onMounted(() => {
  fetchData()
  nextTick(() => {
    drawhstatusIndicators();
  });
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', resizeChart);
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
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