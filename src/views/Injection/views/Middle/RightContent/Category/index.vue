<template>
  <!-- 数据加载完成且非空时显示图表 -->
  <div v-show="!isLoading" class="h-[100%] w-full">
    <div ref="BadCategoryIndicators" class="h-[27vh] w-[30vw]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getBadCategory } from '@/api/getInjection';

const BadCategoryIndicators = ref(null);
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

// 图表绘制函数
const drawBadCategoryIndicators = () => {
  if (!BadCategoryIndicators.value) return;

  const BadCategoryIndicatorsElement = echarts.init(BadCategoryIndicators.value);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: 'rgb(83, 234, 239)' // 设置tooltip的字体颜色为蓝色
      }
    },
    legend: {
      data: uniqueGuZhangTypeNames.value, // 图例显示故障类型名称
      textStyle: {
        color: 'rgb(83, 234, 239)' // 设置图例的字体颜色为蓝色
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01], // 设置为 [0, 0.01] 来确保条形图正确显示
      axisLabel: {
        color: 'rgb(83, 234, 239)' // 设置x轴刻度标签的字体颜色为蓝色
      },
      axisLine: {
        lineStyle: {
          color: 'rgb(83, 234, 239)' // 设置x轴线的颜色为蓝色
        }
      }
    },
    yAxis: {
      type: 'category',
      data: uniqueGuZhangTypeNames.value, // 使用故障类型名称作为 y 轴数据
      axisLabel: {
        color: 'rgb(83, 234, 239)' // 设置y轴刻度标签的字体颜色为蓝色
      },
      axisLine: {
        lineStyle: {
          color: 'rgb(83, 234, 239)' // 设置y轴线的颜色为蓝色
        }
      }
    },
    series: uniqueGuZhangTypeNames.value.map((type) => ({
      name: type,
      type: 'bar',
      data: total.value.map((totalVal, index) => (uniqueGuZhangTypeNames.value[index] === type ? totalVal : 0)),
      itemStyle: {
        color: guZhangTypeColors[type], // 为每个故障类型设置对应的颜色
      },
      label: {
        show: true,
        position: 'top',
        textStyle: {
          color: 'rgb(83, 234, 239)' // 设置柱子上的文本（如数值）的字体颜色为蓝色
        }
      }
    }))
  };

  // 设置图表
  BadCategoryIndicatorsElement.setOption(option);
};

// 获取数据并处理
const fetchData = async () => {
  try {
    const res = await getBadCategory();
    isLoading.value = false;
    Data.value = res.data.faultType;

    // 提取后端返回的故障类型名称
    const returnedGuZhangTypeNames = Data.value.map(item => item.guZhangTypeName);

    // 根据所有预设的故障类型名称填充缺失的数据
    uniqueGuZhangTypeNames.value = allGuZhangTypes;
    total.value = allGuZhangTypes.map(type => {
      const data = Data.value.find(item => item.guZhangTypeName === type);
      return data ? parseInt(data.total, 10) : 0; // 如果没有返回数据，设置为 0
    });

    nextTick(drawBadCategoryIndicators); // 在 DOM 更新后绘制图表
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
