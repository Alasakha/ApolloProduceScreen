<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getFivedayRate } from '@/api/getQuiltyinfo.js';
import { eventBus } from '@/utils/eventbus';
import { useRoute } from 'vue-router';

const route = useRoute();
const prodLine = route.query.prodLine;
// 1. 响应式数据
const rawData = ref([]);
const testIndicators = ref(null);
let chartInstance = null;


// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getFivedayRate(prodLine)
    .then(res => {
      rawData.value = res.data;

    })
    .catch(() => {
      console.log('数据获取失败');
    });
};

// 5. 初始化 ECharts
const drawIndicators = () => {
  if (!testIndicators.value) return;

  // 如果 chartInstance 已经存在，直接更新图表；否则初始化一个新的实例
  if (chartInstance) {
    updateChart();
  } else {
    chartInstance = echarts.init(testIndicators.value);
    updateChart();
  }

  // 监听窗口大小变化，使图表自适应
  window.addEventListener('resize', resizeChart);
};

// 6. 图表更新
const updateChart = () => {
  const xData = Object.keys(rawData.value);  // 获取所有的键
  // 转换 yData 的每个百分比字符串为数字
const yData = Object.values(rawData.value).map(value => {
  // 去掉百分号并转换为数字
  return parseFloat(value.replace('%', '')) || 0; // 如果转换失败则使用 0
});


  if (!chartInstance) return;

  const option = {
    title: {
      text: '近五日合格率',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category', // 改为 category 类型
      data:xData, // 使用供应商名称作为 X 轴数据
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12
      },
      name: '日期',
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
      name: '合格率 (%)',
      nameLocation: 'end',
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [0, 0, 10, 0]
      },
    },
    series: [
      {
        data: yData, // 使用不良率数据
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
        },
        itemStyle: {
          color: '#1370fb',
        },
      },
      {
        name: '', // 新增折线图
        data: yData,
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
  eventBus.off("refreshData", fetchData);
  if (chartInstance) {
    chartInstance.dispose(); // 销毁图表实例
  }
  window.removeEventListener('resize', resizeChart);
});
</script>

<template>
  <div class="Qualifiedrate h-full">
    <dv-border-box8 :dur="5">
      <div class="dv-bg pt-2">
        <div ref="testIndicators" class="chart-container"></div>
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
