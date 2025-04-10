<template>
  <dv-border-box10 class="ranking-box">
    <div class="ranking-content">
      <div v-show="!isLoading" class="h-[100%] w-full">
    <div ref="completedIndicators" class="h-full w-full"></div>
  </div>
    </div>
  </dv-border-box10>
</template>

<script setup>
import { ref, onMounted, nextTick ,onBeforeUnmount,toRaw} from 'vue';
import * as echarts from 'echarts';
import { getProductPassRateRank } from '@/api/getQuiltyinfo';
import { eventBus } from '@/utils/eventbus';
import { useRoute } from 'vue-router';

const route = useRoute();
const prodLine = route.query.prodLine; // 获取路由参数
const completedIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const handleData = ref([]); // 初始化数据

// 图表绘制函数
const drawcompletedIndicators = () => {
  // 将对象转化为键值对数组，并排序
  const sortedEntries = Object.entries(handleData.value)  // 返回键值对数组
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));  // 按照键进行排序

  // 分别提取排序后的键和值
  const dataX = sortedEntries.map(([key]) => key);
  const dataY = sortedEntries.map(([_, value]) => parseFloat(value.replace('%', '')) || 0);


  if (!completedIndicators.value) return;
  const rawData = toRaw(handleData.value); // 解包数据
  const completedIndicatorsElement = echarts.init(completedIndicators.value);
  const option = {  
    title: {
      text: '合格率排行榜',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: { 
      
      trigger: 'axis',
      textStyle: {
        color: 'rgb(83, 234, 253)',  // 设置 tooltip 文字颜色
      },
    },

    grid: {
      top: '25%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dataX,
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
        data:dataY,
        label: {
          show: true,
          position: 'top',
          color: 'rgb(83, 234, 253)',
          fontSize: 14,
          fontWeight: 'bold',
          formatter: '{c}%' // 显示百分比
        },
        itemStyle: {
          color: '#1370fb',
        },
      },
      {
        name: '合格率折线',
        type: 'line',  // 设置为折线图
        data:dataY,
        lineStyle: {
          color: 'orange',  // 设置折线颜色
          width: 2,  // 设置折线宽度
        },
        symbol: 'circle',  // 折线图的点形状
        symbolSize: 6,  // 点的大小
      },  
    ],
    grid:{
      bottom: '10%',
    }
  };

  completedIndicatorsElement.setOption(option);
};

// 获取数据函数
const fetchData = async () => {
  try {
    const res = await getProductPassRateRank(prodLine);  // 调用接口获取数据
    handleData.value = res.data;  // 设置数据
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
    // 监听窗口大小变化，调整图表尺寸
    window.addEventListener('resize', handleResize);
});
  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    window.removeEventListener('resize', handleResize); // 清理事件监听器
  });

  // 调整图表大小
const handleResize = () => {
  const completedIndicatorsElement = echarts.getInstanceByDom(completedIndicators.value);
  if (completedIndicatorsElement) {
    completedIndicatorsElement.resize();
  }
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
</script>


<style scoped>  
.ranking-box {
  width: 96%;
  height: 100% ;
  display: flex;
}

.ranking-content{
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5%;
  flex-direction: column;
}
.ranking-title{
  color: aliceblue;
  margin-top: 10px;
  font-size: 25px;
  font-weight: bold;
}
:deep(.inside-column) {
  height: 2vh !important; /* 这里改成你想要的宽度 */
}
</style>