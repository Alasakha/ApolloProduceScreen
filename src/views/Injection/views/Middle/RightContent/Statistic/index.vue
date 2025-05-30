<template>
  <div class="h-full w-100px">
    <!-- 数据加载完成且非空时显示图表 -->
    <div v-if="!isDataEmpty && !isLoading" ref="StatisticIndicators" style="height:32vh;width: 30vw;"></div>

    <!-- 数据加载中显示加载状态 -->
    <div v-if="isLoading" class="loading">
      <p>加载中...</p>
    </div>

    <!-- 数据为空时显示提示 -->
    <div v-if="isDataEmpty" class="no-data text-white text-3xl flex justify-center items-center h-full">  
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script setup> 
import { ref, onMounted, nextTick,onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getBadCategory } from '@/api/getInjection';
import { eventBus } from '@/utils/eventbus';

const StatisticIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
let chartInstance = null; // 保存 ECharts 实例


const option = {
  grid: {
      top: '10%',  // 调整标题和图表的间距
      left: '2%', // 让 Y 轴有更合适的边距
      right: '2%', // 右侧留一点边距
      bottom: '20%', // 减少底部空白，让柱状图向下填充
      containLabel: true // 让标签不会被裁剪
    },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: [], // 这里会动态填充日期
    axisLabel: { color: 'rgb(83, 234, 253)',
    fontSize: 9, // 设置字体大小
     } // 让字体变蓝色

  },
  yAxis: {
    name: '故障时长/分钟',
    nameLocation: 'end', // 调整名称的位置，可选值为 'start' | 'middle' | 'end'
    nameTextStyle: {
      color: 'rgb(255,255,255)', // 设置名称颜色
      fontSize: 12, // 设置名称字体大小
      fontWeight: 'bold' ,// 加粗提高可读性
      padding: [10, 0, 0, 60], // 调整名称与轴线的距离，格式为 [上, 右, 下, 左]
    },
    type: 'value',
    axisLabel: { color:'rgb(0,0,0)' },
    interval: 1, // 设置刻度间隔为 1
    min: 0, // 设置最小值为 0
  },
  series: [
  {
      name: '故障时长',
      type: 'bar',
      data: [], // 这里会动态填充数值
      itemStyle: {
        color: 'rgb(63, 80, 234)' // 设定柱状图颜色
      },
      label: {
        show: true, // 显示数值
        position: 'top', // 让数值显示在柱子顶部
        color: 'rgb(83, 234, 253)', // 让数值颜色与柱子一致
        fontSize: 14, // 设置字体大小
        fontWeight: 'bold' ,// 加粗提高可读性
        formatter: (params) => {
          return `${params.value}分钟`; // 显示数值和单位
        }
      }
    }
  ],
};

// 图表绘制函数
const drawStatisticIndicators = () => {
  if (!StatisticIndicators.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(StatisticIndicators.value);
  }

  chartInstance.setOption(option);
};

// 窗口变化时重绘图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

const processData = (data) => {
  // 获取 x 轴的日期
  const xData = data.faultSevenDay.map(item => item.macNo);

  // 获取 y 轴的 duration
  const yData = data.faultSevenDay.map(item => item.duration);

  return { xData, yData };
};

// 获取数据并处理
const fetchData = async () => {
  try {
    const res = await getBadCategory();

    if (res.data.faultSevenDay.length === 0) {
      isDataEmpty.value = true; // 数据为空
    } else {
      isDataEmpty.value = false;
      const { xData, yData } = processData(res.data);
      option.xAxis.data = xData;
      option.series[0].data = yData;
    }

    isLoading.value = false;
    console.log(isDataEmpty.value, '数据为空');
    nextTick(drawStatisticIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true; // 数据为空
  }
};


// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData();
  window.addEventListener('resize', resizeChart); // 监听窗口大小变化
  eventBus.on('refreshData', fetchData); // 监听全局刷新事件
});

// 清理资源
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  window.removeEventListener('resize', resizeChart); // 移除窗口大小变化监听
  eventBus.off('refreshData', fetchData); // 取消全局刷新事件监听
});
</script>

<style scoped>
/* 添加样式 */
/* "暂无数据" 提示样式 */

/* 加载中样式 */
.loading {
  text-align: center;
  color: rgb(200, 200, 200);
  font-size: 16px;
  margin-top: 20px;
}
</style>
