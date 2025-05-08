<template>
  <!-- 小图表的外边框组件 -->
  <dv-border-box-10 class="box1">
    <div ref="barChart" class="workprogress">
      <!-- 这里我们会通过 ECharts 动态渲染图表 -->
    </div>
  </dv-border-box-10>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getTodayOrderProgressInfo } from '../../../api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '../../../utils/eventbus';
import * as echarts from 'echarts';

const route = useRoute();
const prodLine = route.query.prodLine;

const isLoading = ref(true);
const isDataEmpty = ref(false);
const chartData = ref({
  axisData: [],
  seriesData: []
});

let chartInstance = null;

// 处理数据
const processData = (data) => {
  if (!data || data.length === 0) {
    isDataEmpty.value = true;
    return;
  }

  isDataEmpty.value = false;

  chartData.value = {
    axisData: data.map(item => item.gd), // 工单号
    seriesData: data.map(item => item.doneRate) // 进度
  };
  console.log(chartData.value);
};

// 请求数据
const fetchData = () => {
  getTodayOrderProgressInfo(prodLine)
    .then(res => {
      isLoading.value = false;
      console.log(res.data);
      processData(res.data);
      initChart(); // 获取数据后初始化图表
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;
    });
};

// 初始化图表
const initChart = () => {
  if (!chartData.value.axisData.length) return; // 没有数据则不初始化

  // 获取 DOM 元素
  const chartDom = document.querySelector('.workprogress');
  chartInstance = echarts.init(chartDom);

  const option = {
    title: {
      text: '今日工单完成进度',
      left: 'center',
      top: '1%', // 让标题距离容器顶部 10% 的位置
      textStyle: {
        color: '#ffffff', // 设置标题字体颜色为白色
        fontSize: 30  ,
      }
    },
    grid: {
      left: '6%',
      right: '4%',
      bottom: '5%',
      top: '10%',
      containLabel: true,
      backgroundColor: '#2c343c', // 设置背景颜色
    },
  tooltip: {
    trigger: 'item',
  },
  yAxis: {
    type: 'category',
    data: chartData.value.axisData,
    axisLabel: {
      interval: 0,   // 显示所有标签
      color: 'white', // 设置字体颜色为白色
      align: 'right', // 设置标签的水平对齐方式
      verticalAlign: 'middle', // 设置标签的垂直对齐方式
    },
    inverse: true,
    min: 0  // 设置 yAxis 的最小值为 0，确保 Y 轴标签不会被遮挡
  },
  xAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} %',  // 显示百分比
      color: 'white' // 设置字体颜色为白色
    },
    
  },
  series: [
    {
      data: chartData.value.seriesData.map(value => ({
          value,
          itemStyle: {
            color: getBarColor(value), // 动态设置每个柱子的颜色
          }
        })),

      type: 'bar',
      color: '#4CAF50',  // 设置柱状图颜色

      label: {
        show: true,
        position: 'insideLeft',
        formatter: '{c}%' , // 显示百分比
        valueAnimation: true,
        color: 'white' // 设置标签字体颜色为白色
      },
    }
  ],
  animationDuration: 0,
  animationDurationUpdate: 3000,
  animationEasing: 'linear',
  animationEasingUpdate: 'linear',
 
};

  chartInstance.setOption(option);
};

// 监听窗口大小变化，调整图表大小
const resizeChart = () => {
  chartInstance?.resize();
};

// 动态设置柱子颜色
const getBarColor = (value) => {
  if (value >= 90) {
    return '#4CAF50'; // 绿色
  } else if (value >= 80) {
    return '#FFEB3B'; // 黄色
  } else if (value >= 75) {
    return '#FF9800'; // 橙色
  } else {
    return '#F44336'; // 红色
  }
};

onMounted(() => {
  fetchData(); // 请求数据
  eventBus.on("refreshData", fetchData); // 监听数据刷新
  window.addEventListener("resize", resizeChart); // 监听窗口大小变化
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData);
  window.removeEventListener("resize", resizeChart);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
.box1 {
  width: 100% !important;
  padding: 0; /* 确保内部没有额外的 padding */
}

.workprogress {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ranking-title {
  color: aliceblue;
  font-size: 1.3vw;
  margin-top: 1vh;
}
</style>
