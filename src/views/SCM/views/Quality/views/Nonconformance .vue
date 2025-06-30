<script setup>
import { ref, watch, nextTick, onMounted ,onBeforeUnmount} from 'vue'
import * as echarts from 'echarts'
import { getTop5PurchaseBad } from '@/api/getScmInfo.js'
import {formatPieChartData} from '@/utils/map'
import { eventBus } from '@/utils/eventbus'
import Hualun from './hualun.vue'
const rawData = ref({ performance: [], appearance: [] })

const chartAppearance = ref(null)
let chartInstance = null;
const performanceList = ref([])
const marqueeVisible = ref(true)
const scrollList = ref([])
const showData = ref([])

// 3. 监听数据变化，确保获取数据后绘制
watch(performanceList, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });


// 5. 初始化 ECharts
const drawIndicators = () => {
  if (!chartAppearance.value) return;

  // 确保 ECharts 初始化时父容器已有大小
  chartInstance = echarts.init(chartAppearance.value);
  updateChart();

  // 监听窗口大小变化，使图表自适应
  window.addEventListener('resize', resizeChart);
};

// 7. 监听窗口变化，自适应图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

const updateChart = () => {
  if (!chartInstance) return;
  let option={}
 if(performanceList.value.length!=0){ 
   option = {
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
  text: '今日功性能问题',
  top: '2%',
  left: 'left',
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
        data: performanceList.value , // 使用计算出来的数据
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
}else{
  option = {
    color: [  
    'green',  // 柔和紫蓝

] , // 淡蓝紫, // ✅ 扇区配色放这里
title: {
  text: '今日其他类问题不良',
  top: '2%',
  left: 'left',
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
        data: [{value:0,name:'暂无异常'}] , // 使用计算出来的数据
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
}

  // 设置图表选项
  chartInstance.setOption(option);
};






const fetchData = async () => {
  const res = await getTop5PurchaseBad()
  rawData.value = res.data

// 格式化数据放入饼图
  performanceList.value = formatPieChartData(rawData.value.performance, 'description', 'total')
    // 过滤掉没有有效数据的项
  performanceList.value = performanceList.value.filter(item => item.name && item.value > 0);
  performanceList.value  = performanceList.value.map(item => ({
  name: item.name || '未知',
  value: item.value ? parseInt(item.value, 10) : 0
}));

 
}


onMounted(() => {
  fetchData()
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
})

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
      <div class="dv-bg">
        <div class="chart-row">
          <div ref="chartAppearance" class="chart-box"></div>
        </div>
        <Hualun></Hualun>
      </div>
    </dv-border-box8>
  </div>
</template>

<style scoped>
.Nonconformance {
  width: 100%;
  height: 100%; /* ⭐重点：确保父容器有高度 */
  box-sizing: border-box;
  overflow: hidden;
}

.dv-bg {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
}

.chart-row {
  display: flex;
  gap: 10px;
  flex: 1;
  min-height: 0; /* ⭐防止撑爆父容器 */
}

.chart-box {
  flex: 1;
  height: 100%;
  min-height: 200px;
}

.bottom-scroll {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #00ffff;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
}

.scroll-title {
  font-weight: bold;
  margin-bottom: 5px;
  width: 3vw;
}

.scroll-item {
  padding: 4px 0;
  border-bottom: 1px dashed #444;
}
:deep(.vue3-marquee.horizontal) {
  height: 100% !important;
  align-items: center;
}

.scroll-item {
  white-space: nowrap;
}
</style>