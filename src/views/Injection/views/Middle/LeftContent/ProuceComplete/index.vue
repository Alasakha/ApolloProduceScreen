<template>
  <!-- 数据加载完成且非空时显示图表 -->
  <div v-show="!isLoading" class="h-[100%] w-full">
    <div ref="completedIndicators" class="h-[32vh] w-[30vw]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getProductPlanCompleteRate } from '@/api/getInjection';
import { formatProductionRateData } from './DataHandle';
import {convertDateFormat} from './Date'
const completedIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const handleData = ref({ dates: [], rates: [] }); // 初始化数据

// 图表绘制函数
const drawcompletedIndicators = () => {
  if (!completedIndicators.value) return;

  const completedIndicatorsElement = echarts.init(completedIndicators.value);
  const option = {  
    tooltip: { trigger: 'axis' },
  legend: {
    data: ['系列1', '系列2', '系列3', '系列4'],
    textStyle: { color:'white' }
  },
    xAxis: {
      type: 'category',
      data: convertDateFormat(handleData.value.dates), // 设置 x 轴数据
    },
    yAxis: {
      type: 'value',
    },
  series: [
    {
      name: '系列1',
      data: handleData.value.series[0].data, // 设置 y 轴数据
      type: 'bar',
    },
    {
      name: '系列2',
      data: handleData.value.series[1].data, // 设置 y 轴数据
      type: 'bar',
    },
    {
      name: '系列3',
      data: handleData.value.series[2].data, // 设置 y 轴数据
      type: 'bar',
    },
    {
      name: '系列4',
      data: handleData.value.series[3].data, // 设置 y 轴数据
      type: 'bar',
    },
  ],
  };

  completedIndicatorsElement.setOption(option);
};

const fetchData = async () => {
  try {
    const res = await getProductPlanCompleteRate();
    handleData.value = formatProductionRateData(res.data); // 处理数据
    isLoading.value = false;
    
    console.log('处理后的数据:', handleData.value);
   console.log('x轴',convertDateFormat(handleData.value.dates))
   console.log('y轴',handleData.value.series[1].data)
    nextTick(drawcompletedIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
  }
};

onMounted(fetchData);
</script>

<style scoped></style>
