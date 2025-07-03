<template>
  <dv-border-box-1 class="box1 ">
    <div class="content  w-full h-full flex flex-col p-4 gap-8  ">
      <div class="row flex-1 flex gap-[3vw] justify-around">
        <DataCard  
          title="月计划" 
          :value="MonthlyData?.plan ??  '无数据'" 
          /> 
          <DataCard  
          title="本月已完成数" 
          :value="MonthlyData?.done ??  '无数据'"
          /> 
          <DataCard  title="本月达成率" 
          :value="MonthlyData?.done != null && MonthlyData?.plan
         !=null ? ((MonthlyData.done / MonthlyData.plan) * 100).toFixed(0) + '%'
          : '无数据'"  />
            <!-- :backgroundcolor1="'#9333ea'"
          :backgroundcolor2="'#a855f7'"
          :color="'#c084fc'" -->
        
      </div> 
      <div class="row flex-1 flex gap-[3vw] justify-around">
        <!-- <EffiectCard title="人时效率" 
          style="margin-left: 6vw;"
          :value1="KnowledgeEfficiencyData?.scanNum ??  '无数据'" 
          :unit1="''" 
          :value2="KnowledgeEfficiencyData?.avg ?? '无数据'" 
          :unit2="''" 
          :smalltitle1="'人数'" 
          :smalltitle2="'效率'" 
          />  -->
          <DataCard title="今日计划数" :value="TodayData?.pcTotal ?? '无数据'" /> 
        <DataCard title="今日已完成"  :value=" TodayData?.done ?? '无数据'"  />
        <DataCard title="今日达成率"    
              :value="TodayData?.pcTotal != null && TodayData?.done != null
        ? ((TodayData.done / TodayData.pcTotal) * 100).toFixed(0) + '%'
        : '无数据'"></DataCard>
      </div>
      <div class="row flex-1 flex gap-[3vw] justify-around">
        <DataCard title="今日检验数" :value="passedInfo?.checkTotal ?? '无数据'" /> 
        <DataCard title="今日合格数"  :value=" passedInfo?.firstTotal ?? '无数据'"  />
        <DataCard title="今日直通率" 
        :value="formatPercent(passedInfo?.passPercent)" />
      </div>
      <!-- <div class="production-data">
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
          <DataCard title="今日已完成"  :value=" TodayData?.done ?? '无数据'"  style="margin-left: 4vw;"/>
          <DataCard title="今日待生产" :value="TodayData?.unProduce ??  '无数据'" style="margin-left: 3vw;"/>
          <DataCard title="今日产量达成率" :value="TodayData?.rate ??  '无数据'" style="margin-left: 8vw;"/>
        </div>
      </div> -->
    </div>
  </dv-border-box-1>
</template>


<script setup>
import { ref, onMounted,onBeforeUnmount } from 'vue';
import DataCard from "@/components/DataCard.vue"; // 导入封装组件
import { getMonthTotalInfo ,getTodayProductionInfo,} from '@/api/getProduceinfo';
import { getPaassedInfo } from '@/api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { color } from 'echarts';
// 定义数据
const MonthlyData = ref()
const TodayData = ref()
const passedInfo = ref({})
const KnowledgeEfficiencyData = ref()
const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数

function formatPercent(percentStr) {
  const num = parseFloat(percentStr);      // 转为数字 0.00
  const rounded = Math.round(num);         // 四舍五入取整 0
  return `${rounded}%`;                    // 转为字符串 "0%"
}
const scale = window.devicePixelRatio;
console.log(scale)

const fetchData = () => {
  getMonthTotalInfo(prodLine).then(res => {
    MonthlyData.value = res.data
  }),
  getTodayProductionInfo(prodLine).then(res => {
    TodayData.value = res.data
  }),
  getPaassedInfo(prodLine).then(res => {
    passedInfo.value = res.data
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
  width: 25%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
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
.row{
  z-index: 1;
}


</style>