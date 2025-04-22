<template>
<dv-border-box10>
  <div class="box1">
    <div class="cards-container">
      <DataCard title="今日下线数" :value="TodayData?.done ?? '无数据'" />
      <DataCard title="今日检验数" :value="passedInfo.checkTotal" />
      <DataCard title="今日合格数" :value="passedInfo.passTotal" />
      <DataCard title="今日直通率" :value="passedInfo.passPercent" />
    </div>
  </div>
</dv-border-box10>
</template>

<script setup>
import { BorderBox1 as DvBorderBox1 } from '@kjgl77/datav-vue3'
import DataCard from '@/components/DataCard.vue';
import { getPaassedInfo } from '@/api/getQuiltyinfo';
import {getTodayProductionInfo} from '@/api/getProduceinfo'
import { useRoute } from 'vue-router';
import { ref, onMounted,onBeforeUnmount } from 'vue';
import { eventBus } from '@/utils/eventbus';


const passedInfo = ref({})
const TodayData = ref()
const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数

const fetchData = () => {
  getPaassedInfo(prodLine).then(res => {
    passedInfo.value = res.data
  })
  getTodayProductionInfo(prodLine).then(res => {
    TodayData.value = res.data
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
  width: 100%;
  height: 100%;
  color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
  max-width: 90%;
}
</style>
