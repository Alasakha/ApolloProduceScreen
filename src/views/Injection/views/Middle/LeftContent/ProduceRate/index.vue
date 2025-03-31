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

// 图表绘制函数
const drawcompletedIndicators = () => {
  if (!rateIndicators.value) return;

  const rawData = toRaw(handleData.value); // 解包数据
  console.log('Raw Dates:', rawData.dates);
  console.log('Raw Values:', rawData.values);

  const completedIndicatorsElement = echarts.init(rateIndicators.value);
  const option = {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: 'rgb(83, 234, 253)',  // 设置 tooltip 文字颜色
      },
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
      top: '25%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: rawData.dates,  // X 轴为日期
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
        name: '合格率',
        type: 'bar',  // 设置为柱状图
        data: rawData.values.map(item => parseFloat(item.replace('%', ''))),  // 将百分比转为数字
        label: {
          show: true,
          position: 'top',
          color: 'rgb(83, 234, 253)',
          fontSize: 14,
          fontWeight: 'bold',
        },
        itemStyle: {
          color: 'rgb(83, 234, 253)',
        },
      },
    ],
  };

  completedIndicatorsElement.setOption(option);
};




const fetchData = async () => {
  try {
    const res = await getProductPassRate();
    handleData.value = formatProductionRateData(res.data); // 处理数据
    console.log(handleData.value)
    isLoading.value = false;
    nextTick(drawcompletedIndicators);
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
  }
};

// 格式化数据函数
const formatProductionRateData = (data) => {
  const dates = data.map(item => convertDateFormat(item.td003));  // 转换日期格式
  const values = data.map(item => item.rate);  // 提取所有值

  return {
    dates,  // X 轴数据
    values, // Y 轴数据
  };
};

  //日期转换
  function convertDateFormat(inputDate) {
  // 将输入日期转为字符串，确保是8位数（即 'YYYYMMDD' 格式）
  const dateStr = inputDate.toString();

  // 提取月份和日期
  const month = dateStr.slice(4, 6);  // 获取第5和第6个字符（即月份）
  const day = dateStr.slice(6, 8);    // 获取第7和第8个字符（即日期）

  return `${parseInt(month)}-${parseInt(day)}`;  // 去掉前导零并返回格式
}

onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});
  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });
</script>

<style scoped></style>
