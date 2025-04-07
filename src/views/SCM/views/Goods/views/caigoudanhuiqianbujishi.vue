<!-- 到货不及时TOP5 -->
<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getTop5PurchaserSignBackDelayed } from '@/api/getScmInfo.js';

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
const categories = computed(() => sortedData.value.map(item => item.purchaserName)); 
const seriesData = computed(() => sortedData.value.map(item => (parseFloat(item.ratio) * 100).toFixed(1)));
// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getTop5PurchaserSignBackDelayed()
    .then(res => {
      rawData.value = res.data;
      console.log(rawData.value);
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
      text: '采购单单回签不及时采购员TO5',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'value',
      min: 0,  // 设置最小值为0
      max: 100, // 设置最大值为100
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12,
        formatter: function (value) {
          return value.toFixed(2) + '%'; // 将数值转换为百分比并保留两位小数
        }
      },
    },
    yAxis: {
      data: categories.value,
      type: 'category',
      axisLabel: {
        color: '#fff',
        fontSize: 15,
      }
    },
    series: [
      {
        data: seriesData.value,
        type: 'bar',
        itemStyle: {
          color: '#3498db',
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
          formatter: '{c}%' // 显示百分比
        }
      },
    ],
    grid: {
      top: '15%',  // 调整标题和图表的间距
      left: '2%', // 让 Y 轴有更合适的边距
      right: '10%', // 右侧留一点边距
      bottom: '5%', // 减少底部空白，让柱状图向下填充
      containLabel: true // 让标签不会被裁剪
    },
  };

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
  <div class="daohuobujishi">
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
