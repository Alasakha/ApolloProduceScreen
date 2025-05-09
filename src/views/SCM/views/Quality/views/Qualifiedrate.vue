<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getJinhuoHege } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';
// 1. 响应式数据
const rawData = ref([]);
const qualityIndicators = ref(null);
let chartInstance = null;

// 2. 计算属性 - 处理排序
const sortedData = computed(() =>
  rawData.value.slice().sort((a, b) => new Date(a.checkDate) - new Date(b.checkDate))
);
const categories = computed(() => 
  sortedData.value.map(item => {
    // 假设 checkDate 是 '2023-04-25' 格式的日期字符串
    const date = new Date(item.checkDate); 
    // 提取 'MM-DD' 格式的日期，去掉年份
    return `${date.getMonth() + 1}-${date.getDate()}`; 
  })
);
const seriesData = computed(() => sortedData.value.map(item => parseFloat(item.ratio)));

// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getJinhuoHege()
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
      text: '来料合格率趋势图',
      left: 'left',
      top: '2%',
      left: '1%',
      textStyle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category',
      data: categories.value,
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12
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
        fontSize: 15,
        formatter: value => value + '%' // Y轴单位加 "%"
      }
    },
    series: [
      {
        data: seriesData.value,
        type: 'bar',
        itemStyle: {
          color:(params)=>{
            const value = seriesData.value[params.dataIndex];
            if (value >= 98) {
              return '#0b874d'; // 绿色
            } else if (value >= 95) {
              return '#ffa500'; // 黄色
            } else {
              return '#FF0000'; // 红色
            }
          }
        },
        label: {
  show: true,
  position: 'insideTop',
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
  formatter: function (params) {
    return `${params.value.toFixed(1)}%`; // 保留一位小数
  }
}
      },
      {
        name: '合格率变化趋势', // 新增折线图
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
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose(); // 销毁图表实例
  }
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