<template>
  <div class="box1" > 
        <BarChart :chartData="chartData" />
  </div>
  </template>
  
  
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import { getFivedayRate } from '../../../../api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '../../../../utils/eventbus';
import { formatPieChartData } from '../../../../utils/map';
import BarChart from '../../../../components/bar.vue';
const route = useRoute();
const prodLine = route.query.prodLine;
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
  
const chartData = ref({
  axisData: [],
  seriesData: []
});

const processData = (data) => {

if (data.length === 0 ) {
  isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
} else {
    // 提取日期和对应的百分比
for (let date in data) { // 过滤掉空值
    chartData.value.axisData.push(date);
    chartData.value.seriesData.push(parseFloat(data[date]));
} 
console.log(chartData.value)
  isDataEmpty.value = false;
}
};

  onMounted(() => {
    fetchData(); // 组件挂载时先请求一次
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
    });

 // 清理定时器，避免组件卸载后定时器继续执行
 onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });
  
  const fetchData = () => {
    getFivedayRate(prodLine).then(res => {
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
    margin-top: 1.5vh;
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