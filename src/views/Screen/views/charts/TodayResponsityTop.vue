<template>
  <div class="box1">
    <h1>今日其他问题</h1>
    <!-- 图表容器 -->
    <div ref="Indicators1" class="w-full h-[100%]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getResponsityDepartmentRank } from '../../../../api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '../../../../utils/eventbus';
import { formatPieChartData } from '../../../../utils/map';
import * as echarts from 'echarts';
import { createChartOption } from './components/othercharts';
  
const route = useRoute();
const prodLine = route.query.prodLine;
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
const Indicators1 = ref(null);
const otherreasonType = 2; // 其他问题类型

// 渲染图表的函数
const drawMonthlyIndicators = (formattedData) => {
  nextTick(() => {
    console.log('准备初始化图表', Indicators1.value);
    const Indicators1Element = echarts.init(Indicators1.value);
    const option = createChartOption(); // 先用写死的，不传 formattedData
    Indicators1Element.setOption(option);
  });
};

// 处理数据
const processData = (data) => {
  const formattedData = formatPieChartData(data, 'md002', 'total');
  console.log('其他', formattedData);

  if (formattedData.length != 0) {
    isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
  } else {
    isDataEmpty.value = false;
    drawMonthlyIndicators(formattedData);  // 直接渲染图表
  }
};

// 请求数据
const fetchData = () => {
  getResponsityDepartmentRank(prodLine, otherreasonType).then(res => {
    isLoading.value = false;   // 加载完成，关闭 loading 状态
    processData(res.data);  // 处理数据并渲染图表
  }).catch(() => {
    isLoading.value = false;
    isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
  });
};

onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
});
</script>

<style scoped>
.box1 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: start;
  color: aliceblue;
}

h1 {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.5vw;
  color: aliceblue;
  letter-spacing: 0.5vw;
}

.w-full {
  width: 100%;
}


</style>
