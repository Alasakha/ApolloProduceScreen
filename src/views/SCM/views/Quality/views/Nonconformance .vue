<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getTop5SupplierBad } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';
// 1. 响应式数据
const rawData = ref([]);
const qualityIndicators = ref(null);
let chartInstance = null;

// 2. 计算属性 - 取前面5个数
const sortedData = computed(() =>
  rawData.value
    .slice() // 复制原始数据
    .slice(0, 5) // 取前五个数据
);
const categories = computed(() => sortedData.value.map(item => item.supplierName)); 
const seriesData = computed(() => sortedData.value.map(item => 100 - parseFloat(item.ratio))); // 取不合格率

// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getTop5SupplierBad()
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
      text: '供应商不良TOP5',
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
      name: '供应商',
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
      name: '不良率 (%)',
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

<template>
  <div class="Qualifiedrate">
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
