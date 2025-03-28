<template>
  <div class="h-full w-100px">
  <!-- 数据加载完成且非空时显示图表 -->
    <div ref="StatisticIndicators" style="height:100%;width: 100%; "></div>
  </div>
</template>

<script setup> 
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getBadCategory } from '@/api/getInjection';

const StatisticIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const Data = ref({ faultType: [] }); // 初始化数据
const uniqueGuZhangTypeNames = ref([]); // 用于存储不重复的故障类型名称
const total = ref([]); // 用于存储总数

// 预设所有可能的故障类型名称和对应的颜色
const allGuZhangTypes = ['缺料异常', '设备异常', '质量异常'];
const guZhangTypeColors = {
  '缺料异常': '#FF6347', // 红色
  '设备异常': '#FFA500', // 橙色
  '质量异常': '#FFD700', // 黄色
};
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: [], // 这里会动态填充日期
    axisLabel: { color: 'rgb(83, 234, 253)' } // 让字体变蓝色
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: 'rgb(83, 234, 253)' },
    minInterval: 20,
  },
  series: [
  {
      name: '故障时长',
      type: 'bar',
      data: [], // 这里会动态填充数值
      itemStyle: {
        color: 'rgb(83, 234, 253)' // 设定柱状图颜色
      },
      label: {
        show: true, // 显示数值
        position: 'top', // 让数值显示在柱子顶部
        color: 'rgb(83, 234, 253)', // 让数值颜色与柱子一致
        fontSize: 14, // 设置字体大小
        fontWeight: 'bold' // 加粗提高可读性
      }
    }
  ],
};

// 图表绘制函数
const drawStatisticIndicators = () => {
  if (!StatisticIndicators.value) return;

  const StatisticIndicatorsElement = echarts.init(StatisticIndicators.value);
  // 设置图表
  StatisticIndicatorsElement.setOption(option);
};



const processData = (data) => {
  // 获取 x 轴的日期
  const xData = data.faultSevenDay.map(item => item.guzhangDate);
  // 获取 y 轴的 duration
  const yData = data.faultSevenDay.map(item => item.duration);
  console.log(data,xData,yData)
  return { xData, yData };
};

// 获取数据并处理
const fetchData = async () => {
  try {
    const res = await getBadCategory();
    isLoading.value = false;

    const { xData, yData } = processData(res.data);

    option.xAxis.data = xData;
    option.series[0].data = yData;

    nextTick(drawStatisticIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
  }
};


// 组件挂载时获取数据
onMounted(fetchData);
</script>

<style scoped>
/* 添加样式 */
</style>
