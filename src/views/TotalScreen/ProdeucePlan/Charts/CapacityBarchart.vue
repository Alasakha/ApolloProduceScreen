<template>
  
  <dv-border-box-9 class="box1">
    <div class="wrapper">
     <h2>当日小时产能柱状图</h2>
     
     <!-- 如果正在加载，显示 loading -->
     <div v-if="isLoading" class="loading-container">
       <dv-loading>Loading...</dv-loading>
     </div>
     
     <!-- 如果没有数据，显示暂无数据 -->
     <div v-if="!isLoading && isDataEmpty" class="empty-container">
       暂无数据
     </div>
     
     <!-- 数据加载完成且非空时显示图表 -->
      <div v-if="!isLoading && !isDataEmpty" ref="monthlyIndicators" style="margin-top: 5vh;"></div>

    </div>
  </dv-border-box-9>
</template>

<script setup>
import { ref, onMounted, watch, nextTick ,onBeforeUnmount} from 'vue';
import * as echarts from 'echarts';
import { getColumnarHourInfo } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventBus';

const route = useRoute();
const prodLine = route.query.prodLine;
const monthlyIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const categories = ref([]); // X 轴数据
const values = ref([]); // Y 轴数据
let chartInstance = null;

// 处理数据
const processData = (data) => {

  if (Object.keys(data).length === 0) { // 修正数据为空的判断
    isDataEmpty.value = true;
  } else {
    isDataEmpty.value = false;
    categories.value = Object.keys(data); // X 轴
    values.value = Object.values(data);  // Y 轴
  }
};

// 初始化 ECharts
const drawhourlyIndicators = () => {
  if (!monthlyIndicators.value) return;
  chartInstance = echarts.init(monthlyIndicators.value);
  updateChart();
};

// 更新 ECharts 数据
const updateChart = () => {
  if (!chartInstance) return;

  const option = {
    xAxis: {
      type: 'category',
      data: categories.value,
      axisLabel: {
        interval: 0, // 显示所有标签
        color:'#fff',
        fontSize: 12,
      },
      name: '时间 (小时)', // 设置 X 轴的总单位
    nameLocation: 'middle', // 设置单位的位置在 X 轴末尾
    nameTextStyle: {
      color: '#fff', // 设置单位文字颜色
      fontSize: 10,  // 设置单位文字大小
      padding: [15, 0, 0, 0] // 调整单位文字的间距
    },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color:'#fff',
        fontSize: 15,
      },
      lineStyle: {
      color: '#33ccff', // 设置横线颜色（红色）
      width: 20, // 线条宽度
      type: 'dashed' // 线条样式：'solid'（实线）, 'dashed'（虚线）, 'dotted'（点线）
    }
    },
    series: [
      {
        data: values.value,
        type: 'bar',
        itemStyle: {
      color: '#3498db', // 修改柱子颜色
    },
    label: {
        show: true, // 显示标签
        position: 'top', // 标签显示的位置（可以是 'top', 'inside', 'insideTop', 'insideBottom' 等）
        color: '#fff', // 标签文字颜色
        fontSize: 14, // 字体大小
        fontWeight: 'bold' // 字体加粗
      }
      }
    ]
  };

  chartInstance.setOption(option);
};

const fetchData = () => {
  getColumnarHourInfo(prodLine)
    .then(res => {
      isLoading.value = false;
      processData(res.data);
      nextTick(() => drawhourlyIndicators());
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;
    });
}

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });
</script>


<style scoped>
.box1 {
  position: relative;
  width: 35%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: aliceblue;
  padding: 20px;
}

h2 {
  position: absolute;
  top: 0.5vh;
  left: 1vw;
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 10px;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrapper div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20vh; /* 增加最小高度 */
}

/* 加载中的样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
}

/* 数据为空的提示样式 */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 2vw; 
  letter-spacing: 0.2vw;
}
</style>
