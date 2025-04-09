<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getDeliveryRate5Day } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';
// 1. 响应式数据
const rawData = ref([]);
const qualityIndicators = ref(null);
let chartInstance = null;

// 2. 计算属性 - 处理排序
const sortedData = computed(() =>
  rawData.value.slice().sort((a, b) => new Date(a.statisticalDate) - new Date(b.statisticalDate))
);
const categories = computed(() => sortedData.value.map(item => item.statisticalDate)); 
const seriesData = computed(() => 
  sortedData.value.map(item => 
    item.ratio ? parseFloat(parseFloat(item.ratio).toFixed(1)) : 0
  )
);

// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getDeliveryRate5Day()
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
      text: '到货及时率',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category',
      data: categories.value,
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 10
      },
      name: '时间 (日期)',
      nameLocation: 'end', // X轴单位位置调整到右侧
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [15, 0, 0, 0]
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 10,
        formatter: value => value + '%' // Y轴单位加 "%"
      },
      name: '及时率 (百分比)',
      nameLocation: 'end', // X轴单位位置调整到右侧
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [15, 0, 0, 0]
      },
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
          position: 'insideTop',
          color: '#fff',
          fontSize: 10,
          fontWeight: 'bold',
          formatter: '{c}%'
        }
      },
      {
        name: '到货及时率近5天柱状图', // 新增折线图
        data: seriesData.value,
        type: 'line',
        itemStyle: {
          color: 'orange', // 折线颜色
        },
        symbol: 'circle', // 数据点形状
        symbolSize: 8, // 数据点大小
        lineStyle: {
          width: 2 // 线条粗细
        },
      }
  
    ],
    grid: {
      top: '15%',  // 调整标题和图表的间距
      left: '2%', // 让 Y 轴有更合适的边距
      right: '15%', // 右侧留一点边距
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
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  window.removeEventListener('resize', resizeChart);
  
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