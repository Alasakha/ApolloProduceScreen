<template>
    <div class="efficency w-[25%]">
      <dv-border-box12>
    <!-- 标题 -->
    <GlobalTitle title="当日人时效率"/>
        <!-- 如果正在加载，显示 loading -->
        <div v-if="isLoading" class="w-full h-[85%]">
        <dv-loading>Loading...</dv-loading>
      </div>
    <!-- 数量 -->
    <div v-if="!isLoading" class="w-full h-[95%] p-4 pt-5 flex flex-col  justify-start">
    <div class="line flex-2 flex">
      <!-- 配置人数 -->
      <div class="peizhi flex-1">
        <div ref="Indicators1" class="w-full h-[100%]"></div>
      </div>
      <!-- 出勤人数 -->
      <div class="chuchai flex-1">
        <div ref="Indicators2" class="w-full h-[100%]"></div>
      </div>
    </div>

    <div class="line flex-1 flex  gap-8 w-full h-full  justify-center items-center">
    <!-- 标准人效 -->
    <div class="eff-card  flex flex-col justify-center items-center rounded-xl p-2 shadow-lg">
      <div class="title  text-lg font-bold">标准人效</div>
      <div class="value">{{ EfficentData.standardEfficiency.value }}</div>
    </div>

    <!-- 实际人效 -->
    <div class="eff-card  flex flex-col justify-center items-center rounded-xl p-2 shadow-lg ">
      <div class="title  text-lg font-bold">实际人效</div>
      <div class="value">{{ EfficentData.efficiency.value }}</div>
    </div>
  </div>
  </div>

        </dv-border-box12>
    </div>
  </template>
  
  <script setup>
  
  import { ref, onMounted,onBeforeUnmount,reactive ,nextTick, } from 'vue';
import * as echarts from 'echarts';

import DataCard from "@/components/DataCard.vue"; // 导入封装组件
import EffiectCard from "@/components/EffiectCard.vue"; // 导入封装组件
import { getEfficiencyToday} from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import BigScreenTitle from '@/components/title.vue'
import { createGaugeOption } from './gaugeChart';
import { useEcharts } from '@/utils/useEcharts';
// 定义数据
const config = reactive({
  value: 66,
})
const diffrentLine = (prodLine) => {
  const prefix = prodLine.slice(0, 4); // 取前4位

  switch (prefix) {
    case '1004':
      return 52;
    case '2004':
      return 30;
    case '1005':
      return 18;
    case '2005':
      return 13;
    default:
      return null; // 未匹配时返回 null 或默认值
  }
};


const EfficentData = reactive({
  standardEfficiency: { value: 0 },
  efficiency: { value: 0 },
  total: null,
  clTotal: null,
  scanNum: null
});


const Indicators1 = ref(null);
const Indicators2 = ref(null);
const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数
const isLoading = ref(true);


const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);

const drawChart = () => {
  const option1 = createGaugeOption({
    text: "配置人数",
    data: diffrentLine(prodLine),
    max: diffrentLine(prodLine)
  });

  const option2 = createGaugeOption({
    text: "出勤人数",
    data: EfficentData.scanNum,
    max: diffrentLine(prodLine)
  });

  chart1.setOption(option1);
  chart2.setOption(option2);
};

const fetchData = async () => {
  const res = await getEfficiencyToday(prodLine);

  // 分别赋值，保持响应式
  EfficentData.standardEfficiency.value = Number(res.data.standardEfficiency)|| 0;
  EfficentData.efficiency.value = Number(res.data.efficiency)  || 0;
  EfficentData.total = res.data.total ?? 0;
  EfficentData.clTotal = res.data.clTotal ?? 0;
  EfficentData.scanNum = res.data.scanNum ?? 0;
  isLoading.value = false;
  nextTick(() => {
    chart1.initChart();
  chart2.initChart();
  drawChart();
        });
};


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
  width: 25%;
  height: 20vw;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
}
/* :deep(.dv-percent-pond text:has(tspan:contains("%"))) {
  display: none;
} */

.eff-card {
  /* @apply flex flex-col justify-center items-center rounded-xl p-4 shadow-lg; */
  background: linear-gradient(135deg, #520096 0%,#5c00f0 70%,#0417bd 100%);
  color: #fff;
  flex: 1;
}


.value {
  font-size: 1.8rem;
  font-weight: bold;
}
</style>