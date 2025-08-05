<template>
  <div class="left-content max-h-1/4 pt-1">
    <div class="w-full h-full flex flex-col gap-4 ">
      <template v-if="stampingMachineData.length">
        <DataCard2 
          v-for="(card, index) in stampingMachineData" 
          :key="index"
          v-bind="formatCardData(card)"
        />
      </template>
      <template v-else>
        <DataCard2 
          v-bind="emptyCardData"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataCard2 from '../components/DataCard2.vue';
import { onMounted, ref } from 'vue';
import { getStampingMachineData } from '@/api/getStampWeldinfo';
import { eventBus } from '@/utils/eventbus';
 import { useRoute } from 'vue-router';

 const route = useRoute();
 const prodLine = route.query.prodLine;
const stampingMachineData = ref([]);

const emptyCardData = {
  orderName: "暂无",
  totalQty: "暂无",
  doneQty: "暂无",
  spec: "暂无",
  progress: 0,
  status: "暂无",
  temperature: "暂无",
  pressure: "暂无",
  maxspeed: "暂无",
  keeptime: "暂无",
  stdTemperature: "暂无",
  stdPressure: "暂无",
  stdMaxspeed: "暂无",
  stdKeeptime: "暂无",
  spen: "暂无",
  ta006: "暂无",
  gdNum: "暂无",
  device: {
    hourBetween: "暂无",
    power: "暂无"
  }
}

const formatCardData = (item) => {
  // 检查关键字段是否都为null
  // const isEmptyData = !item.workNo && !item.num && !item.processName && !item.isDoing;
  
  // if (isEmptyData) {
  //   return {
  //     orderName: item.machineName || "暂无",
  //     totalQty: "暂无",
  //     doneQty: "暂无",
  //     spec: "暂无",
  //     progress: 0,
  //     status: "暂无",
  //     temperature: "暂无",
  //     pressure: "暂无",
  //     maxspeed: "暂无",
  //     keeptime: "暂无",
  //     stdTemperature: "暂无",
  //     stdPressure: "暂无",
  //     stdMaxspeed: "暂无",
  //     stdKeeptime: "暂无",
  //     spen: "暂无",
  //     ta006: "暂无",
  //     gdNum: "暂无",
  //     device: {
  //       hourBetween: "暂无",
  //       power: "暂无"
  //     }
  //   }
  // }

  return {
    orderName: item.machineName || "暂无",
    totalQty: item.num ? Math.round(item.num) : "暂无",
    doneQty: item.workNo || "暂无",
    spec: item.processName || "暂无",
    progress: item.workNo && item.num ? Number(((item.workNo / item.num) * 100).toFixed(0)) : 0,
    status: item.deviceStateName || '暂无',
    temperature: toFixedNumber(item.laserPower) || '暂无',
    pressure: '暂无',
    maxspeed: toFixedNumber(item.workSpeed) || '暂无',
    keeptime: 30,
    stdTemperature: '暂无',
    stdPressure: item.laserPower || '暂无',
    stdMaxspeed: '暂无',
    stdKeeptime: 35,
    spen: item.item_specification || "暂无",
    ta006: item.productId || "暂无",
    gdNum: 5,
    device: {
      hourBetween: "8.5",
      power: "75kw"
    }
  }
}

// 省略小数点
function toFixedNumber(num) {
  if (num === null || num === undefined) return "暂无";
  return Number(num).toFixed(2);
}

const fetchStampingData = () => {
  getStampingMachineData(prodLine,1).then(res => {
    stampingMachineData.value = res.data || [];
  })
}

onMounted(() => {
  fetchStampingData();
  eventBus.on('refreshData', fetchStampingData);
})
</script>

<style scoped>
.left-content {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.left-content-title-text {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
}
</style>