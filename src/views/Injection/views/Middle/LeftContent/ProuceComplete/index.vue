<template>
  <!-- 数据加载完成且非空时显示图表 -->
  <div v-show="!isLoading" class="h-[100%] w-full">
    <div ref="completedIndicators" class="h-[27vh] w-[25vw]"></div>
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
    data: ['102050101001', '102050101002', '102050101003', '102050101004'],
    textStyle: { 
      color:'white' ,
      fontSize: 10 // 设置字体大小
    },
    top: '0%', // 调整图例与图表之间的距离
    itemWidth: 15,   // 图例图标的宽度
    itemHeight: 10,  // 图例图标的高度
  },
  grid: {
    top:'25%',
    left: '0%',
    right: '0%',
    bottom: '0%', // 增加图表底部空白，调整与图例之间的间距
    containLabel: true
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
      name: '102050101001',
      data: handleData.value.series[0].data, // 设置 y 轴数据
      type: 'bar',
    },
    {
      name: '102050101002',
      data: handleData.value.series[1].data, // 设置 y 轴数据
      type: 'bar',
    },
    {
      name: '102050101003',
      data: handleData.value.series[2].data, // 设置 y 轴数据
      type: 'bar',
    },
    {
      name: '102050101004',
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
