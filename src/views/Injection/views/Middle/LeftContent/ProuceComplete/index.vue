<template>
  <!-- 数据加载完成且非空时显示图表 -->
  <div v-show="!isLoading" class="h-[100%] w-full">
    <dv-decoration-10 style="width:90%;height:5px;" />
    <div ref="completedIndicators" class="h-[27vh] w-[25vw]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick ,onBeforeUnmount,toRaw} from 'vue';
import * as echarts from 'echarts';
import { getProductPlanCompleteRate } from '@/api/getInjection';
import { convertXXXXYYZZtoYYZZ } from './Date';
import { eventBus } from '@/utils/eventbus';

const completedIndicators = ref(null);
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
  if (!completedIndicators.value) return;
  if (completedIndicatorsInstance) {
  completedIndicatorsInstance.dispose();
}
  const rawData = toRaw(handleData.value); // 解包数据
  completedIndicatorsInstance = echarts.init(completedIndicators.value);
  const option = {  
    tooltip: { 
      trigger: 'axis',
      textStyle: {
        color: 'rgb(83, 234, 253)',  // 设置 tooltip 文字颜色
      },
    },
    grid: {
      top: '10%',
      left: '0%',
      right: '0%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: rawData.dates,
      axisLine: {
        lineStyle: {
          color: 'rgb(83, 234, 253)',  // X 轴线条颜色
        }
      },
      axisLabel: {
        textStyle: {
          color: 'rgb(83, 234, 253)',  // X 轴标签文字颜色
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgb(83, 234, 253)',  // Y 轴线条颜色
        }
      },
      axisLabel: {
        textStyle: {
          color: 'rgb(83, 234, 253)',  // Y 轴标签文字颜色
        },
         formatter: (value) => `${value}%`
      }
    },
    series: [
      {
        name: '生产数据',
        type: 'bar',  // 设置为柱状图
        data: rawData.values.map(item => parseFloat((item ?? '0').toString().replace('%', ''))),
        label: {
          show: true,
          position: 'top',
          color: 'rgb(83, 234, 253)',
          fontSize: 14,
          fontWeight: 'bold',
          formatter: '{c}%' // 显示百分比
        },
        itemStyle: {
          color: 'rgb(0, 186, 255)',
        },
      },
      {
        name: '合格率折线',
        type: 'line',  // 设置为折线图
        data: rawData.values.map(item => parseFloat((item ?? '0').toString().replace('%', ''))),
        lineStyle: {
          color: 'orange',  // 设置折线颜色
          width: 2,  // 设置折线宽度
        },
        symbol: 'circle',  // 折线图的点形状
        symbolSize: 6,  // 点的大小
      },
    ],
  };

  completedIndicatorsInstance.setOption(option);
};

// 获取数据函数
const fetchData = async () => {
  try {
    const res = await getProductPlanCompleteRate();  // 调用接口获取数据
    handleData.value = formatProductionRateData(res.data)
    isLoading.value = false;
    nextTick(drawcompletedIndicators);  // 绘制图表
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
  }
};

// 格式化数据函数
const formatProductionRateData = (data) => {
  const dates = data.map(item => convertDateFormat(item.ty003));  // 转换日期格式
  const values = data.map(item => item.rate);  // 提取所有值

  return {
    dates,  // X 轴数据
    values, // Y 轴数据
  };
};

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  window.addEventListener('resize', handleResize);
});
  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    window.removeEventListener('resize', handleResize);
  });


  //日期转换
  function convertDateFormat(inputDate) {
  // 将输入日期转为字符串，确保是8位数（即 'YYYYMMDD' 格式）
  const dateStr = inputDate.toString();

  // 提取月份和日期
  const month = dateStr.slice(4, 6);  // 获取第5和第6个字符（即月份）
  const day = dateStr.slice(6, 8);    // 获取第7和第8个字符（即日期）

  return `${parseInt(month)}-${parseInt(day)}`;  // 去掉前导零并返回格式
}
</script>

<style scoped></style>
