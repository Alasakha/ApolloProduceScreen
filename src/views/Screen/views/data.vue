<template>
  <dv-border-box-1 class="box1">
    <div class="content">
      <div class="production-data">
        <div class="row" >
          <EffiectCard title="人时效率" 
          style="margin-left: 6vw;"
          :value1="KnowledgeEfficiencyData?.scanNum ??  '无数据'" 
          :unit1="''" 
          :value2="KnowledgeEfficiencyData?.avg ?? '无数据'" 
          :unit2="''" 
          :smalltitle1="'人数'" 
          :smalltitle2="'效率'" 
          /> 
          <DataCard  
          title="本月已完成数" 
          :value="MonthlyData?.done ??  '无数据'" 
          style="margin-left: 8vw;"/> 
          <DataCard  title="本月待生产数" 
          :value="MonthlyData?.incomplete ??  '无数据'" 
          style="margin-left: 8vw;"/>
          
        </div>
        <div class="row">
          <DataCard title="今日总排产" :value="TodayData?.pcTotal ?? '无数据'" style="margin-left: 4vw;"/> 
          <DataCard title="今日已完成"  :value=" TodayData?.done?? '无数据'"  style="margin-left: 4vw;"/>
          <DataCard title="今日待生产" :value="TodayData?.unProduce ??  '无数据'" style="margin-left: 3vw;"/>
          <DataCard title="今日产量达成率" :value="TodayData?.rate ??  '无数据'" style="margin-left: 8vw;"/>
        </div>
      </div>
    </div>
  </dv-border-box-1>
</template>


<script setup>
import { ref, onMounted,onBeforeUnmount } from 'vue';
import DataCard from "../../../components/DataCard.vue"; // 导入封装组件
import EffiectCard from "../../../components/EffiectCard.vue"; // 导入封装组件
import { getMonthTotalInfo ,getTodayProductionInfo,getEfficiencyInfo} from '../../../api/getProduceinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
// 定义数据
const MonthlyData = ref()
const TodayData = ref()
const KnowledgeEfficiencyData = ref()
const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数

const fetchData = () => {
  getMonthTotalInfo(prodLine).then(res => {
    MonthlyData.value = res.data
  }),
  getTodayProductionInfo(prodLine).then(res => {
    TodayData.value = res.data
  }),
  getEfficiencyInfo(prodLine).then(res => {
    KnowledgeEfficiencyData.value = res.data
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
  width: 70vw;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
}

.content {
  display: flex;
  justify-content: space-between;
  height: 90%;
  margin-top: 2vh;
}

.production-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  font-size: 30px;
  padding: 10px 0; /* 上下增加一些 padding */
}

.row {
  display: flex;
  justify-content: start; /* 让内容分散一点 */
  height: 60%;
  /* gap: 30px; 增大间距 */
  /* margin-bottom: 2vh; 让两行之间间隔更大 */
}



</style>