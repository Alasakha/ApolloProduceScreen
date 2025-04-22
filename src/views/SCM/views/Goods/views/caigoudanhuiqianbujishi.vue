<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getTop5PurchaserSignBackDelayed } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';

// 1. 响应式数据
const rawData = ref([]);
const qualityIndicators = ref(null);
let chartInstance = null;

// 2. 计算属性 - 取前面5个数
const sortedData = computed(() => {
  return rawData.value
    .map(item => ({
      name: item.purchaserName || '未知', // 你可以根据需要选择其他字段作为 name
      value: item.whfs ? parseInt(item.whfs, 10) : 0 // 如果 whfs 存在，则转换为整数，否则为 0
    }))
});

// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getTop5PurchaserSignBackDelayed()
    .then(res => {
      rawData.value = res.data;
      console.log(rawData.value)
    })
    .catch(() => {
      console.log('数据获取失败');
    });
};

// 5. 初始化 ECharts
const drawIndicators = () => {
  if (!qualityIndicators.value) return;

  // 确保 ECharts 初始化时父容器已有大小
  chartInstance = echarts.init(qualityIndicators.value);
  updateChart();

  // 监听窗口大小变化，使图表自适应
  window.addEventListener('resize', resizeChart);
};

// 6. 图表更新
const updateChart = () => {
  if (!chartInstance) return;

  const option = {
    title: {
      text: '进货不良问题',
      left: 'center',
      textStyle: {
        color: '#ffffff' // 设置标题字体颜色为白色
      }
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        color: 'black' // 设置 tooltip 字体颜色为白色
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#ffffff' // 设置 legend 字体颜色为白色
      }
    },
    series: [
      {
        name: '进货不良问题',
        type: 'pie',
        radius: '50%',
        data: sortedData.value, // 使用计算出来的数据
        label: {
        show: true,
        position: 'outside', // 标签显示在外侧
        formatter: '{b}:{c}', // 格式化标签内容，显示名称、数值和百分比
        fontSize: 12, // 设置标签字体大小
        color: '#fff' // 设置标签字体颜色
      },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  console.log(sortedData.value)
  // 设置图表选项
  chartInstance.setOption(option);
};

// 7. 监听窗口变化，自适应图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 8. 页面挂载时获取数据
onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件并销毁图表
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose(); // 销毁图表实例
  }
  window.removeEventListener('resize', resizeChart); // 移除监听器
});
</script>

<template>
  <div class="Nonconformance">
    <dv-border-box8 :dur="5">
      <div class="dv-bg pt-2">
        <div ref="qualityIndicators" class="chart-container"></div>
      </div>
    </dv-border-box8>
  </div>
</template>

<style scoped>
/* dv-bg 作为父容器，确保它有大小 */
.dv-bg {
  width: 100%;
  height: 100%; /* 可调整 */
}

/* ECharts 图表容器 */
.chart-container {
  width: 100%;
  height: 100%;
}
 </style> 
