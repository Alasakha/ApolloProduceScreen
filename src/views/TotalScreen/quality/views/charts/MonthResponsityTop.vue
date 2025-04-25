<template>

  <div class="box1"> 
    <div class="w-full h-full">
        <div ref="qualityIndicators" class="chart-container w-full h-full"></div>
      </div>
  </div>
  </template>
  
  
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, computed,watch,nextTick } from 'vue';
import { getResponsityCategoryRank } from '../../../../../api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import * as echarts from 'echarts';


  const route = useRoute();
const prodLine = route.query.prodLine;
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
let chartInstance = null;
const qualityIndicators = ref(null);
const rawData = ref([]);

// 5. 初始化 ECharts
const drawIndicators = () => {
  if (!qualityIndicators.value) return;

  // 确保 ECharts 初始化时父容器已有大小
  chartInstance = echarts.init(qualityIndicators.value);
  updateChart();

  // 监听窗口大小变化，使图表自适应
  window.addEventListener('resize', resizeChart);
};


const processData = (data) => {
    const formattedData = formatPieChartData(data, 'ngName', 'total');

    rawData.value = formattedData.map(item => ({
  name: item.name || '未知',
  value: item.value ? parseInt(item.value, 10) : 0
}));


    if (formattedData.length === 0) {

      isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
    } else {

      isDataEmpty.value = false;
      config.data = formattedData;  // 这里赋值给 config.data
    }
  };

  const updateChart = () => {
  if (!chartInstance) return;

  const option = {
    color: [  
    '#8F87F1',  // 柔和紫蓝
  '#C68EFD',  // 主色偏紫
  '#E9A5F1',  // 淡紫蓝
  '#FED2E2',  // 淡紫
  '#5F6DF8',  // 深蓝紫
  '#B6A0FF',  // 淡一点的粉紫
  '#493DF5'   // 饱和偏深的紫蓝
] , // 淡蓝紫, // ✅ 扇区配色放这里
title: {
  text: '今日功性能不良',
  top: '2%',
  left: 'center',
  textStyle: {
    color: '#ffffff',     // 标题颜色
    fontSize: 25,         // 字号（推荐 16～24 大屏用 18+）
    fontWeight: 'bold',   // 字体粗细：normal / bold / bolder / lighter
    fontFamily: 'Microsoft YaHei', // 可指定字体
    letterSpacing: 2      // 字间距（单位 px）
  }
},
    tooltip: {
      trigger: 'item',
      textStyle: {
        color: 'black' // 设置 tooltip 字体颜色为黑色
      }
    },
    legend: {
      orient: 'horizontal',  // ✅ 横向排列
      top: '10%',          // ✅ 放在图表下方
      left: 'center',         // ✅ 水平居中
      textStyle: {
        color: '#ffffff'
      }
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: rawData.value, // 使用计算出来的数据
        label: {
            show: true,
            position: 'outside',
            formatter: (params) => {
              return `{name|${params.name}}\n{value|${params.value} 件}  {percent|${params.percent}%}`;
            },
            rich: {
              name: {
                fontSize: 14,
                fontWeight: '',
                color: '#fff',
                lineHeight: 22
              },
              value: {
                fontSize: 12,
                color: '#aaa'
              },
              percent: {
                fontSize: 12,
                color: '#66ccff'
              }
            }
          },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
      }
    ]
  };

  // 设置图表选项
  chartInstance.setOption(option);
};

// 7. 监听窗口变化，自适应图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};


// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });


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
  const fetchData = () => {
    getResponsityCategoryRank(prodLine).then(res => {
    isLoading.value = false;   // 加载完成，关闭 loading 状态
    processData(res.data);
  }).catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
    });
  }
  </script>
  
  
  <style scoped>
  .box1{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: start;
    color:aliceblue;

  }
  h1{
    font-size: 1.5vw;
    color:aliceblue;
    letter-spacing: 0.5vw;
  }
  :deep(.inside-column) {
  height: 2vh !important; /* 这里改成你想要的宽度 */
}
</style>