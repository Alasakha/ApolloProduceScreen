<template>
  <div :id="chartId" class="bar-chart"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  chartData: Object,
  chartId: { type: String, default: "barChart1" },
  style: { type: Object, default: () => ({ width: "100%", height: "100%" }) }
});

let chartInstance = null;
let intervalId = null;
const chunkedData = ref([]);
const chunkedXAxis = ref([]);
let currentIndex = 0;

// 处理数据，每次取 5 条
const handleData = () => {
  if (!props.chartData || !props.chartData.seriesData) return;

  chunkedData.value = [];
  chunkedXAxis.value = [];

  let rawData = props.chartData.seriesData;
  let xAxisData = props.chartData.axisData;
  
  // 获取最大值作为 100% 的基准
  let maxValue = Math.max(...rawData);
  
  let length = xAxisData.length > 5 ? 5 : xAxisData.length;

  for (let i = 0; i < length; i++) {
    // 将数据转换为百分比
    chunkedData.value.push((rawData[i] / maxValue) * 100);
    chunkedXAxis.value.push(xAxisData[i]);
  }
};

// 加载 ECharts
const loadChart = () => {
  if (!chartInstance) {
    chartInstance = echarts.init(document.getElementById(props.chartId));
  }

  let option = {
    title: {
    text: '今日工单完成进度 ', // Title text 
    left: 'center', // Position of the title
    textStyle: {
      color: '#fff', // Title color
      fontSize: 23, // Font size
      fontWeight: 'bold', // Font weight
      letterSpacing: 10
    }
  },
    animationDurationUpdate: 500, // 数据更新时的动画时长
    animationEasingUpdate: "cubicOut", // 缓动效果
    animationType: 'move',
    grid: { left: "5%", right: "5%", bottom: "5%", containLabel: true },
    xAxis: {
      type: "value",    // 使用数值型 X 轴
      min: 0,           // 设置最小值为 0
      max: 100,         // 设置最大值为 100
      axisLabel: {
        color: "#fff",
        fontSize: 10,
        formatter: (value) => `${value.toFixed(0)}%` // **确保百分比保留 1 位小数**
      },
      splitLine: {
          show: true,        // 显示分割线
          lineStyle: {
            color: '#ffffff', // 设置分割线颜色
            type: 'dashed'    // 设置分割线类型为虚线
          }
        }
      
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: chunkedXAxis.value,
      axisLabel: { color: "#fff", fontSize: 14 },

 axisLabel: { // 控制坐标轴标签  
                        show: true, 
                        inside: true,
                        interval: 0, //横轴信息全部显
                        splitNumber: 50,
                        textStyle: {
                            color:'white',
                            verticalAlign: 'bottom',
                            fontSize: 10,
                            align: 'left',
                            padding: [0, 0, 10, 0]
                        }
                    }
    },
    series: [{
  barWidth: 100, // Increase the width of the bars
  type: "bar",
  data: chunkedData.value.map((value) => ({
    value: value,
    itemStyle: {
      barBorderRadius: [0, 15, 15, 0],
      color: getBarColor(value) // Set the bar color
    },
    label: {
      show: true,
      color: "#fff",
      fontSize: 10,
      fontWeight: "bold",
      position: getposition(value), // Use getPosition to set position
 // Slightly move right to avoid overlap
      formatter: (params) => {  
        // Access params.value to format the label
        return params.value === 0 ? "0%" : `${params.value.toFixed(1)}%`;
      }
    }
  })),
  barWidth: 20,
  itemStyle: {
    barBorderRadius: [0, 5, 15, 0],
  }
}]
  };

  chartInstance.setOption(option, true);
};
const getposition = (params) => {

  if (params === 0) { 
    return "right";
  } else {
    return "insideRight";
  }
  }
  // 开启轮播
const startRotation = () => {
  if (!props.chartData || !props.chartData.axisData || props.chartData.axisData.length === 0) return;

  clearInterval(intervalId); // 先清除旧的 interval，防止重复轮播

  intervalId = setInterval(() => {
    let totalLength = props.chartData.seriesData.length;

    // 计算当前轮播的数据范围
    let endIndex = currentIndex + 5;

    if (endIndex > totalLength) {
      // **不补充前面的数据，只显示最后剩余的部分**
      chunkedData.value = props.chartData.seriesData.slice(currentIndex);
      chunkedXAxis.value = props.chartData.axisData.slice(currentIndex);
    } else {
      chunkedData.value = props.chartData.seriesData.slice(currentIndex, endIndex);
      chunkedXAxis.value = props.chartData.axisData.slice(currentIndex, endIndex);
    }

    console.log("当前轮播数据:", chunkedData.value); // **调试日志**
    loadChart();

    // **如果到达最后一组数据，下一次从头开始**
    currentIndex = endIndex >= totalLength ? 0 : endIndex;
  }, 2000);
};


onMounted(() => {
  handleData();
  loadChart();
  startRotation();
  window.addEventListener("resize", () => chartInstance?.resize());
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

watch(() => props.chartData, (newData) => {
  if (newData && newData.axisData.length > 0) {
    handleData();
    loadChart();
    clearInterval(intervalId);  // 清除旧的 interval
    startRotation();  // 重新启动轮播
  }
}, { deep: true });

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
</script>

<style scoped>
.bar-chart {
  width: 100%;
  height: 50vh;
}
</style>
