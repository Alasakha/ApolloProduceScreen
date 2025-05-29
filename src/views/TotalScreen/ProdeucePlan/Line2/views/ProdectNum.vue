<template>
  <dv-border-box-1 class="box1">
    <GlobalTitle title="当日小时产能" />
    

    <!-- 图表区域 -->
     <div class="h-[6%]"></div>
   <div  ref="monthlyIndicators" class="w-full h-[85%]"></div>

  </dv-border-box-1>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getColumnarHourInfo, getEfficiencyHour } from '@/api/getProduceinfo';
import { useEcharts } from '@/utils/useEcharts';
import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './dailyCharts';

const route = useRoute();
const prodLine = route.query.prodLine;


const monthlyIndicators = ref(null);
const categories = ref([]);
const values = ref([]);
const standard = ref([]);

// 引入 echarts 封装逻辑
const { initChart, setOption, resizeChart } = useEcharts(monthlyIndicators);

// 请求数据 & 渲染图表
const fetchData = () => {


  Promise.all([
    getColumnarHourInfo(prodLine),
    getEfficiencyHour(prodLine)
  ])
    .then(([hourRes, efficiencyRes]) => {
      const hourData = hourRes.data;
      const efficiencyData = efficiencyRes.data;

      if (!hourData || Object.keys(hourData).length === 0) {

        return;
      }

      // 设置图表数据
      categories.value = Object.keys(hourData);
      values.value = Object.values(hourData);
      standard.value = Object.values(efficiencyData);
      console.log('hourData', hourData);
      console.log('efficiencyData', efficiencyData);

      // 等待 DOM 渲染后初始化图表
        nextTick(() => {
          initChart();
                console.log('categories', categories.value);
      console.log('values', values.value);
      console.log('standard', standard.value);
          const option = createChartOption({
            category: categories.value,
            value1: values.value,
            value2: standard.value,
          });
          console.log('option', option);
          setOption(option);

          // 延迟 resize 等 DOM 宽高完全生效
          setTimeout(() => {
            resizeChart();
          }, 1000); // 100ms 足够处理 v-show 的样式切换

        });
    })
    .catch((err) => {
      console.error('数据请求失败：', err);

    });
};

// 监听刷新事件
onMounted(() => {
  fetchData();
  eventBus.on('refreshData', fetchData);
});

// 清理事件监听
onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
.box1 {
  width: 25%;
  height: 20vw;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
}
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
