<template>
  <div class="left-content ">
    <!-- <div class="left-content-title-text">
      <span>冲压线</span>
    </div> -->
    <div class="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 p-4">
      <DataCard2 
        v-for="(card, index) in mockCards" 
        :key="index"
        v-bind="card"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DataCard2 from '../components/DataCard2.vue';
import { ref } from 'vue';

const mockCards = ref([
  {
    orderName: "激光割管1",
    totalQty: 1000,
    doneQty: 750,
    spec: "前盖板组件",
    progress: 75,
    status: "加工中",
    temperature: 180,
    pressure: 150,
    maxspeed: 60,
    keeptime: 30,
    stdTemperature: 175,
    stdPressure: 155,
    stdMaxspeed: 65,
    stdKeeptime: 35,
    spen: "350x250x2.0mm",
    ta006: "CP001",
    gdNum: 5,
    device: {
      hourBetween: "8.5",
      power: "75kw"
    }
  },
  {
    orderName: "激光割管2",
    totalQty: 800,
    doneQty: 400,
    spec: "侧板组件",
    progress: 50,
    status: "加工中",
    temperature: 185,
    pressure: 160,
    maxspeed: 55,
    keeptime: 25,
    stdTemperature: 180,
    stdPressure: 165,
    stdMaxspeed: 60,
    stdKeeptime: 30,
    spen: "400x300x2.5mm",
    ta006: "CP002",
    gdNum: 3,
    device: {
      hourBetween: "6.5",
      power: "80kw"
    }
  },
  {
    orderName: "激光割管3",
    totalQty: 500,
    doneQty: 500,
    spec: "底板组件",
    progress: 100,
    status: "已完成",
    temperature: 170,
    pressure: 140,
    maxspeed: 50,
    keeptime: 35,
    stdTemperature: 170,
    stdPressure: 145,
    stdMaxspeed: 55,
    stdKeeptime: 40,
    spen: "450x350x3.0mm",
    ta006: "CP003",
    gdNum: 4,
    device: {
      hourBetween: "7.0",
      power: "70kw"
    }
  },
  {
    orderName: "激光割管4",
    totalQty: 1200,
    doneQty: 300,
    spec: "顶板组件",
    progress: 25,
    status: "加工中",
    temperature: 175,
    pressure: 145,
    maxspeed: 65,
    keeptime: 28,
    stdTemperature: 175,
    stdPressure: 150,
    stdMaxspeed: 70,
    stdKeeptime: 30,
    spen: "500x400x2.8mm",
    ta006: "CP004",
    gdNum: 6,
    device: {
      hourBetween: "9.0",
      power: "85kw"
    }
  }
]);
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