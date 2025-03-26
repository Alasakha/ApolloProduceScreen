<template>
  <dv-border-box-9 class="box1">
    <div class="wrapper">
      <h2>本月生产异常饼图</h2>
      
      <!-- 如果正在加载，显示 loading -->
      <div v-if="isLoading" class="loading-container">
        <dv-loading>Loading...</dv-loading>
      </div>
      
      <!-- 如果没有数据，显示暂无数据 -->
      <div v-if="!isLoading && isDataEmpty" class="empty-container">
        暂无数据
      </div>
      
      <!-- 数据加载完成且非空时显示图表 -->
        <div v-if="!isLoading && !isDataEmpty" ref="monthlyIndicators"  style="margin-top: 5vh;"></div>
    </div>
  </dv-border-box-9>
</template>

<script setup>
import { ref, onMounted ,nextTick,onBeforeUnmount} from 'vue';
import * as echarts from 'echarts';
import { getabnormalProductionMonthInfo } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { formatPieChartData } from '@/utils/map';
import { eventBus } from '@/utils/eventBus';
import { getColorByType } from '@/utils/color';

const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数
const monthlyIndicators = ref(null);

// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);

const drawMonthlyIndicators = (formattedData) => {
  const monthlyIndicatorsElement = echarts.init(monthlyIndicators.value);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      itemGap: 20,  // 设置图例项之间的间距
      left: 'center',
      textStyle: {
        color: '#fff', // 设置图例字体颜色为白色
        fontSize: 13,  // 设置图例文字大小
      },
      itemWidth: 15,   // 设置图例标记的宽度
      itemHeight: 10   // 设置图例标记的高度
        },
    series: [
      {
        name: '本月生产异常',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
        },
        label: {
        show: true,
        position: 'outside', // 标签显示在外侧
        formatter: params => `${params.name}: ${params.percent.toFixed(1)}%`, // 格式化标签内容，只显示一个小数
        fontSize: 12, // 设置标签字体大小
        color: '#fff' // 设置标签字体颜色
      },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
        top:10,
        show: true,      // 使线条显示
        length: 8,      // 设置线条的第一段长度
        length2: 8,     // 设置线条的第二段长度
        lineStyle: {
          color: '#fff', // 设置线条颜色
          width: 1,      // 设置线条宽度
          type: 'solid'  // 设置线条类型
        }
      },
        data: formattedData // 使用传递过来的数据
      }
    ]
  };

  monthlyIndicatorsElement.setOption(option);
};

const processData = (data) => {

  const formattedData = formatPieChartData(data, 'guZhangTypeName', 'guZhangTypeCount');

  if (formattedData.length === 0) {

    isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
  } else {

    isDataEmpty.value = false;

    // 为每个数据项设置颜色
    formattedData.forEach(item => {
      item.itemStyle = {
        color: getColorByType(item.name)  // 根据名称设置颜色
      };
    });
    // 确保 DOM 更新后再执行 ECharts 初始化
    nextTick(() => {

      drawMonthlyIndicators(formattedData);
    });
  }
};
const fetchData = () => {
    getabnormalProductionMonthInfo(prodLine)
    .then(res => {
      isLoading.value = false;   // 加载完成，关闭 loading 状态
      processData(res.data);  // 处理数据
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
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
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrapper div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 加载中的样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 2vw;
}

/* 数据为空的提示样式 */
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
