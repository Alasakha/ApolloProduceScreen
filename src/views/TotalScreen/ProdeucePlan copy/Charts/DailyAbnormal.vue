<template>
  <dv-border-box-9 class="box1">
    <div class="wrapper">
      <h2>当日生产异常统计</h2>
      
      <!-- 如果正在加载，显示 loading -->
      <div v-if="isLoading" class="loading-container">
        <dv-loading>Loading...</dv-loading>
      </div>
      
      <!-- 数据加载完成且非空时显示图表 -->
      <div v-show="!isLoading" ref="dailyIndicators" class="charts" style="margin-top: 5vh;"></div>
    </div>
  </dv-border-box-9>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getabnormalProductionDaliyInfo } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { formatPieChartData } from '@/utils/map';
import { eventBus } from '@/utils/eventbus';
import { getColorByType } from '@/utils/color';
const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数
const dailyIndicators = ref(null);  
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);

// 模拟数据
// const mockAbnormalData = [
//   {
//     guZhangTypeName: '缺料异常',
//     guZhangTypeCount: 9,
//     guZhangTypeDuration: 120, // 持续时间：分钟
//     percent: '40.9%',
//   },
//   {
//     guZhangTypeName: '质量异常',
//     guZhangTypeCount: 13,
//     guZhangTypeDuration: 180,
//     percent: '59.1%',
//   },
//   {
//     guZhangTypeName: '设备故障',
//     guZhangTypeCount: 5,
//     guZhangTypeDuration: 95,
//     percent: '30.0%',
//   },
//   {
//     guZhangTypeName: '人员操作',
//     guZhangTypeCount: 4,
//     guZhangTypeDuration: 80,
//     percent: '20.0%',
//   },
// ];





const drawDailyIndicators = (formattedData) => {
  const dailyIndicatorsElement = echarts.init(dailyIndicators.value);
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const { name, value, percent, data } = params;
        return `${name}<br/>数量：${value} 次<br/>占比：${percent}%<br/>时长：${data.duration || 0} 分钟`;
      }
    },
    legend: {
      top: '0%',
      left: 'center',
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 13,
      },
      itemWidth: 15,
      itemHeight: 10
    },
    series: [
      {
        name: '本日生产异常数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params) => {
            const duration = params.data.duration || 0;
            return `${params.name}: ${params.value}次\n(${duration}分钟)`;
          },
          fontSize: 12,
          color: '#fff'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 8,
          length2: 4,
          lineStyle: {
            color: '#fff',
            width: 1,
            type: 'solid'
          }
        },
        data: formattedData
      }
    ]
  };

  dailyIndicatorsElement.setOption(option);
};

const processData = (data) => {
  let formattedData = formatPieChartData(data, 'guZhangTypeName', 'guZhangTypeCount');
  if (formattedData.length === 0) {
    isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
    formattedData = [{ value: 0, name: '暂无异常', itemStyle: { color: '#009966' } }]; // 设置一个绿色的数据点
  } else {
    isDataEmpty.value = false;
  }

   // 为每个数据项设置颜色
   formattedData.forEach(item => {
  item.itemStyle = {
    color: getColorByType(item.name)
  };
  // 增加 duration 数据到 item 中，方便 label 使用
  const matched = data.find(d => d.guZhangTypeName === item.name);
  if (matched) {
    item.duration = matched.guZhangTypeDuration; // 添加 duration 字段
  }
});

  nextTick(() => {
    if (dailyIndicators.value) {
      drawDailyIndicators(formattedData);
    } else {
    }
  });
};

const fetchData = () => {
  getabnormalProductionDaliyInfo(prodLine)
    .then(res => {
      isLoading.value = false;   // 加载完成，关闭 loading 状态
      processData(res.data);  // 处理数据
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
      processData([]); // 处理空数据
    });
}

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 清理定时器，避免组件卸载后定时器继续执行
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
});
</script>

<style scoped>
.box1 {
  position: relative;
  width: 35%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: aliceblue;
  padding: 20px;
}

h2 {
  position: absolute;
  top: 0.5vh;
  left: 1vw;
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 10px;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 让 h2 和图表上下排列 */
  align-items: center;
  justify-content: center; /* 居中饼图 */
}

.wrapper div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; 
  font-size: 2vw; 
  letter-spacing: 0.2vw;
}
</style>