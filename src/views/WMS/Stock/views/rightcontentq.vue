<template>
    <div class="right-content h-full w-[35%]">
        <dv-border-box10>
          <div class="dv-bg w-full h-full">
        <div ref="qualityIndicators" class="chart-container h-full"></div>
      </div>
    </dv-border-box10>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getpositionUtilizationRate } from '@/api/getWMSinfo.js';
import { eventBus } from '@/utils/eventbus';
// 1. 响应式数据
const rawData = ref([]);
const qualityIndicators = ref(null);
let chartInstance = null;


const categories = computed(() => rawData.value.map(item => item.cw)); 
const seriesData = computed(() => rawData.value.map(item => {
  const percentValue = parseFloat(item.percent.replace('%', ''));
  return percentValue.toFixed(1); // 保证四舍五入后为1位小数
})); // 保证四舍五入后为1位小数
// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getpositionUtilizationRate()
    .then(res => {
      rawData.value = res.data;
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
      text: '各仓位库位利用率柱状图',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category', // 改为 category 类型
      data: categories.value, // 使用供应商名称作为 X 轴数据
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12
      },
      nameLocation: 'end',
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [15, 0, 0, 0]
      },
    },
    yAxis: {
      type: 'value', // 改为 value 类型
      min: 0, // 设置最小值为 0
      max: 100, // 设置最大值为 100
      axisLabel: {
        color: '#fff',
        fontSize: 12,
        formatter: function (value) {
          return value.toFixed(0) + '%'; // 将数值转换为百分比并保留两位小数
        }
      },
      nameLocation: 'end',
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [0, 0, 10, 0]
      },
    },
    series: [
      {
        data: seriesData.value, // 使用不良率数据
        type: 'bar',
        itemStyle: {
          color: '#3498db', // 设置柱状图颜色
        },
        label: {
          show: true,
          position: 'top', // 显示在柱子顶部
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
          formatter: '{c}%' // 显示百分比
        }
      },
    ],
    grid: {
      top: '15%', // 调整标题和图表的间距
      left: '2%', // 左侧留出空间
      right: '10%', // 右侧留出空间
      bottom: '10%', // 底部留出空间
      containLabel: true // 让标签不会被裁剪
    },
  };
  console.log(categories.value);
  console.log(seriesData.value);
  chartInstance.setOption(option);
};

// 7. 监听窗口变化，自适应图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();                 // 使图表自适应                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  }
};

// 8. 页面挂载时获取数据
onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件并销毁图表
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  if (chartInstance) {
    chartInstance.dispose(); // 销毁图表实例
  }
  window.removeEventListener('resize', resizeChart); // 移除监听器
});
</script>

<style scoped>

</style>