<template>
  <dv-border-box-9 class="box1">
    <div class="wrapper flex flex-col items-center justify-center h-full">
      <h2 class="h-[10%]">设备点检模块</h2>
      
      <!-- 如果正在加载，显示 loading -->
      <div v-if="isLoading" class="loading-container">
        <dv-loading>Loading...</dv-loading>
      </div>
      
      <!-- 如果没有数据，显示暂无数据 -->
      <div v-if="!isLoading && isDataEmpty" class="empty-container">
        暂无数据
      </div>
      
      <!-- 数据加载完成且非空时显示图表 -->
        <div v-if="!isLoading && !isDataEmpty" class="h-[90%] flex flex-col items-center justify-start w-full ">
          <div class="card w-full h-[50%]">
              <div class="card-content w-full h-full flex">
                <div ref="Indicators1" class="w-full h-[100%]"></div>
                <div ref="Indicators2" class="w-full h-[100%]"></div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center w-full h-[50%]">
            <div ref="Indicators3" class="w-full h-[100%]"></div>
            </div>
  <!-- <p class="text-[#29d6d9]">点检及时率</p>
  <dv-water-level-pond :config="config" style="width:200px;height:200px" /> -->
        </div>
    </div>
  </dv-border-box-9>
</template>

<script setup>
import { ref, onMounted ,nextTick,onBeforeUnmount,reactive} from 'vue';
import * as echarts from 'echarts';
import { getMaintenanceInfo } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { formatPieChartData } from '@/utils/map';
import { eventBus } from '@/utils/eventbus';
import { getColorByType } from '@/utils/color';
import { createGaugeOption } from './gaugeChart';

const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数
const Indicators1 = ref(null);
const Indicators2 = ref(null);
const Indicators3 = ref(null);
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);
const maintenanceInfo = reactive({
  done: null,  // 初始为空
  rate: null,  // 初始为空
  total: null  // 初始为空
});


const drawMonthlyIndicators = (formattedData) => {
  const Indicators1Element = echarts.init(Indicators1.value);
  const Indicators1Element2 = echarts.init(Indicators2.value);
  const Indicators1Element3 = echarts.init(Indicators3.value);
  const option = createGaugeOption({
  text: "应点检设备数",
  data:  maintenanceInfo.total,
  max: maintenanceInfo.total
});
  const option3 = createGaugeOption({
  text: "点检及时率",
  data: maintenanceInfo.rate * 100,
  max: maintenanceInfo.done/maintenanceInfo.total
});
  
const option2 = createGaugeOption({
  text: "实际点检数",
  data: maintenanceInfo.done,
  max: maintenanceInfo.total
});
  Indicators1Element.setOption(option);
  Indicators1Element2.setOption(option2);
  Indicators1Element3.setOption(option3);
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
  getMaintenanceInfo(prodLine)
  .then(res => {
  isLoading.value = false;
  const response = res.data;
  maintenanceInfo.done = response.done;
  maintenanceInfo.rate = response.rate;
  maintenanceInfo.total = response.total;

  config.data[0] = Number((maintenanceInfo.rate * 100).toFixed(0));

  nextTick(() => {
    drawMonthlyIndicators(); // 拉完数据后渲染图表
  });
})
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
  top: 0.5vh;
  left: 1vw;
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
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

.card {

}

.card-content {
  text-align: center;
}

.card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.card p {
  font-size: 16px;
  line-height: 1.5;
}

</style>
