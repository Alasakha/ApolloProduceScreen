<template>
  <div class="line1-container flex flex-col mb-2 ">
    <!-- <div class="grid grid-cols-4 gap-2 h-full">
      <dv-border-box-12 class="data-box ">
        <Datacard title="今日排产工单单数" EnlishTitle="TodayPlanned" :value="productionData.pcGdTotal" />
      </dv-border-box-12> -->

      <!-- 已派工单数 -->
      <!-- <dv-border-box-12 class="data-box">
        <Datacard 
          title="已派工单数" 
          EnlishTitle="ProducedToday" 
          :value="productionData.gdPg"
          @click="() => handleClick('已派工单数', 'getStampingPgAbnormal')"
        />
      </dv-border-box-12> -->

      <!-- 已报工单数 -->
      <!-- <dv-border-box-12 class="data-box">
        <Datacard 
          title="已报工单数" 
          EnlishTitle="ProducedRate" 
          :value="productionData.gdDone"
          @click="() => handleClick('已报工单数', 'getStampingBgAbnormal')"
        />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">  
      <Datacard title="达成率" EnlishTitle="PassRateToday" :value="productionData.gdRate+'%'" />
      </dv-border-box-12>
    </div> -->

    <!-- <div class="grid grid-cols-7 gap-2 h-full">
      <dv-border-box-12 class="data-box ">
      <Datacard title="今日排产量" EnlishTitle="PassRateToday" :value="productionData.pcTotal" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box ">
        <Datacard title="已报工产量" EnlishTitle="InspectionsToday" :value="productionData.done" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box ">
        <Datacard title="达成率" EnlishTitle="InspectionsToday" :value="productionData.rate+'%'" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box ">
      <Datacard title="检验工单数" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.checkTotal" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="合格工单数" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.firstHgTotal" />
      </dv-border-box-12>
  
      <dv-border-box-12 class="data-box ">
      <Datacard title="已报工待检验工单数" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.toBeInspected" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box ">
      <Datacard title="合格数" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.passPercent" />
      </dv-border-box-12>


    </div> -->

    <!-- 计划进度管控 -->
    <div class="grid grid-cols-6 gap-2 h-full mt-2">
      <dv-border-box-12 class="data-box">
        <Datacard title="月总计划量" EnlishTitle="MonthTotalPlan" :value="planProgressData.monthTotalPlan" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="月已完成量" EnlishTitle="MonthCompleted" :value="planProgressData.monthCompleted" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="月完成率" EnlishTitle="MonthCompletionRate" :value="planProgressData.monthCompletionRate + '%'" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日计划量" EnlishTitle="TodayPlan" :value="planProgressData.todayPlan" />
      </dv-border-box-12> 
      <dv-border-box-12 class="data-box">
        <Datacard title="今日已完成量" EnlishTitle="TodayCompleted" :value="planProgressData.todayCompleted" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日完成率" EnlishTitle="TodayCompletionRate" :value="planProgressData.todayCompletionRate + '%'" />
      </dv-border-box-12>
    </div>

    <!-- 工单结单率 -->
    <div class="grid grid-cols-6 gap-2 h-full mt-2">
      <dv-border-box-12 class="data-box">
        <Datacard title="月入库工单" EnlishTitle="DailyInboundOrders" :value="workOrderData.dailyInboundOrders" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="准时工单" EnlishTitle="OnTimeOrders" :value="workOrderData.onTimeOrders" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="结单率" EnlishTitle="ClosingRate" :value="workOrderData.closingRate + '%'" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日计划工单数" EnlishTitle="TodayPlanOrders" :value="workOrderData.todayPlanOrders" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="已准时完结工单" EnlishTitle="TodayCompletedOnTime" :value="workOrderData.todayCompletedOnTime" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box">
        <Datacard title="今日结单率" EnlishTitle="TodayClosingRate" :value="workOrderData.todayClosingRate + '%'" />
      </dv-border-box-12>
    </div>

  </div>
 
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import Datacard from './components/Datacard.vue'
import { getMonthCompleteGd, getTodayPlanComplete } from '@/api/getInjection'

const route = useRoute()
const prodLine = route.query.prodLine as string

// 计划进度管控数据
const planProgressData = ref({
  monthTotalPlan: 0,
  monthCompleted: 0,
  monthCompletionRate: 0,
  todayPlan: 0,
  todayCompleted: 0,
  todayCompletionRate: 0
})

// 工单结单率数据
const workOrderData = ref({
  dailyInboundOrders: 0,
  onTimeOrders: 0,
  closingRate: 0,
  todayPlanOrders: 0,
  todayCompletedOnTime: 0,
  todayClosingRate: 0
})

const fetchData = async (_prodLine) => {
  try {
    const [todayRes, monthRes] = await Promise.all([
      getTodayPlanComplete(),
      getMonthCompleteGd('注塑车间')
    ])

    if (todayRes && todayRes.code === 200 && todayRes.data) {
      const todayPlan = todayRes.data.plan ?? 0
      const todayCompleted = todayRes.data.complete ?? 0
      const todayCompletionRate = todayPlan > 0 ? Math.round((todayCompleted / todayPlan) * 1000) / 10 : 0
      // 更新计划进度中的今日数据
      planProgressData.value.todayPlan = todayPlan
      planProgressData.value.todayCompleted = todayCompleted
      planProgressData.value.todayCompletionRate = todayCompletionRate
      // 更新结单率中的今日工单数据
      workOrderData.value.todayPlanOrders = todayPlan
      workOrderData.value.todayCompletedOnTime = todayCompleted
      workOrderData.value.todayClosingRate = todayCompletionRate
    }

    if (monthRes && monthRes.code === 200 && monthRes.data) {
      const monthTotalPlan = monthRes.data.totalGd ?? 0
      const monthCompleted = monthRes.data.jsGd ?? 0
      const monthCompletionRate = monthTotalPlan > 0 ? Math.round((monthCompleted / monthTotalPlan) * 1000) / 10 : 0
      // 填充月度计划
      planProgressData.value.monthTotalPlan = todayRes.data.monthPlan ?? 0
      planProgressData.value.monthCompleted = todayRes.data.monthDone ?? 0
      planProgressData.value.monthCompletionRate =Math.round((todayRes.data.monthDone/todayRes.data.monthPlan)*1000)/10
      // “工单结单率”区块：用月度值映射“日入库工单/准时工单/结单率”，能连的先连
      workOrderData.value.dailyInboundOrders = monthTotalPlan
      workOrderData.value.onTimeOrders = monthCompleted
      workOrderData.value.closingRate = monthCompletionRate
      // 今日工单若接口提供
      const todayPlanOrders = monthRes.data.todayTotalGd ?? workOrderData.value.todayPlanOrders
      const todayCompletedOnTime = monthRes.data.todayJsGd ?? workOrderData.value.todayCompletedOnTime
      const todayClosingRateCalc = todayPlanOrders > 0 ? Math.round((todayCompletedOnTime / todayPlanOrders) * 1000) / 10 : workOrderData.value.todayClosingRate
      workOrderData.value.todayPlanOrders = todayPlanOrders
      workOrderData.value.todayCompletedOnTime = todayCompletedOnTime
      workOrderData.value.todayClosingRate = todayClosingRateCalc
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchData(prodLine)
  // 订阅刷新事件
  eventBus.on('refreshData', () => fetchData(prodLine))
})
onBeforeUnmount(() => {
  eventBus.off('refreshData', () => fetchData(prodLine))
})

</script>

<style scoped>


.data-box {
  height: 100%;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.circle-content-box {
  position: relative;
  width: 100%;  /* 可根据内容调整 */
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
  filter: drop-shadow(0 0 16px #00eaff88);
  pointer-events: none;
}

.circle-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  /* 居中内容 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-bg {
  opacity: 0.2;
}
.ring-animate {
  stroke-linecap: round;
  filter: blur(1px);
  animation: ring-rotate 2.5s linear infinite;
  transform-origin: 60px 60px;
}
@keyframes ring-rotate {
  100% { stroke-dashoffset: 314; transform: rotate(360deg);}
}
.box-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  text-align: center;
  font-size: 1.5vw;
  font-weight: bold;
  margin: 1vh 0 0.5vh 0;
  color: #fff;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
  padding-bottom: 0.5vh;
}
.box-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.three-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}

.data-box {
  position: relative; 
  overflow: hidden;
}

.box-content {
  position: relative;
  z-index: 1;
}

.float-updown {
  animation: floatUpDown 2.5s cubic-bezier(0.4,0,0.2,1) infinite;
  display: inline-block;
}

@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
</style> 