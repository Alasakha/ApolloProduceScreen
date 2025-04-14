<template>
  <!-- 数据加载完成且非空时显示图表 -->
  <div v-show="!isLoading" class="h-[100%] w-full">
    <div ref="rateIndicators" class="h-[27vh] w-[25vw]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick ,onBeforeUnmount,toRaw} from 'vue';
import * as echarts from 'echarts';
import { getProductPassRate } from '@/api/getInjection';
import { eventBus } from '@/utils/eventbus.ts';





const rateIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const handleData = ref({ dates: [], rates: [] }); // 初始化数据

let completedIndicatorsInstance = null;

const handleResize = () => {
  if (completedIndicatorsInstance) {
    completedIndicatorsInstance.resize();
  }
};

// 图表绘制函数
const drawcompletedIndicators = () => {
  if (!rateIndicators.value) return;

if (completedIndicatorsInstance) {
  completedIndicatorsInstance.dispose();
}

const rawData = toRaw(handleData.value);
const sortedEntries = Object.entries(rawData).sort(([a], [b]) => a.localeCompare(b));
const xData = sortedEntries.map(([key]) => key);
const yData = sortedEntries.map(([_, value]) => parseFloat(value.replace('%', '')) || 0);

completedIndicatorsInstance = echarts.init(rateIndicators.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: 'rgb(83, 234, 253)',  // 设置 tooltip 文字颜色
      },
          formatter: (params) => {
      const item = params[0]; // 因为 trigger: 'axis'，params 是一个数组
      return `日期: ${item.name}    合格率：${item.value}%`;
    }
    },
    legend: {
      data: ['生产数据'],
      textStyle: {
        color: 'rgb(83, 234, 253)',
        fontSize: 10,
      },
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      formatter: (name) => `${name} (%)`,  // 在图例中添加百分号
    },
    grid: {
      top: '15%',
      left: '0%',
      right: '0%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xData,  // X 轴为日期
      axisLine: {
        lineStyle: {
          color: 'rgb(83, 234, 253)',  // 设置 X 轴线条颜色
        },
      },
      axisLabel: {
        textStyle: {
          color: 'rgb(83, 234, 253)',  // 设置 X 轴标签文字颜色
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgb(83, 234, 253)',  // 设置 Y 轴线条颜色
        },
      },
      axisLabel: {
        textStyle: {
          color: 'rgb(83, 234, 253)',  // 设置 Y 轴标签文字颜色
        },
        formatter: (value) => `${value}%`,  // 在 Y 轴上添加百分号
      },
    },
    series: [
      {
        name: '达成率',
        type: 'bar',  // 设置为柱状图
        data:  yData,  // 将百分比转为数字
        label: {
          show: true,
          position: 'top',
          color: 'rgb(83, 234, 253)',
          fontSize: 14,
          fontWeight: 'bold',
          formatter: (params) => `${params.value}%` // ✅ 顶部加百分号
        },
        itemStyle: {
          color: 'rgb(0, 186, 255)',
        },
      },
      {
        name: '达成率折线',
        type: 'line',  // 设置为折线图
        data: yData,
        lineStyle: {
          color: 'orange',  // 设置折线颜色
          width: 2,  // 设置折线宽度
        },
        symbol: 'circle',  // 折线图的点形状
        symbolSize: 6,  // 点的大小
      },
    ],
  };

  completedIndicatorsInstance = echarts.init(rateIndicators.value);
completedIndicatorsInstance.setOption(option); // ✅ 用对变量名


};




const fetchData = async () => {
  try {
    const res = await getProductPassRate();
    handleData.value = res.data; // 直接使用接口返回的数据
    console.log(handleData.value)
    isLoading.value = false;
    nextTick(drawcompletedIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
    }
  };


  onMounted(() => {
  fetchData();
  eventBus.on('refreshData', fetchData);
  window.addEventListener('resize', handleResize); // 添加窗口变化监听
});
  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
  window.removeEventListener('resize', handleResize); // 移除监听

  // 清理图表实例
  if (completedIndicatorsInstance) {
    completedIndicatorsInstance.dispose();
    completedIndicatorsInstance = null;
  }
});
</script>

<style scoped></style>
