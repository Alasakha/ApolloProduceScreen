<template>
  <div class="line1-container flex flex-col ">
    <div class="grid grid-cols-3 gap-4 h-full">
      <dv-border-box-12 class="data-box ">
        <Datacard title="今日计划总数" EnlishTitle="TodayPlanned" :value="productionData.pcTotal" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="今日已完成" EnlishTitle="ProducedToday" :value="productionData.done" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="今日达成率" EnlishTitle="ProducedRate" :value="productionData.rate+'%'" />
      </dv-border-box-12>
    </div>

    <div class="grid grid-cols-3 gap-4 h-full">
      <dv-border-box-12 class="data-box ">
        <Datacard title="今日检验数" EnlishTitle="InspectionsToday" :value="apolloStampingWeldingData.checkTotal" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="今日合格数" EnlishTitle="QualifiedToday" :value="apolloStampingWeldingData.firstHgTotal" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="今日合格率" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.passPercent" />
      </dv-border-box-12>
    </div>
  </div>
 
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTodayProduction, type TodayProduction, getApolloStampingWelding, type ApolloStampingWelding } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import Datacard from '../components/Datacard.vue'

const route = useRoute()
const prodLine = route.query.prodLine as string

const productionData = ref<TodayProduction>({
  rate: 0,
  pcTotal: 0,
  done: 0,
  undone: '0'
})

const apolloStampingWeldingData = ref<ApolloStampingWelding>({
  checkTotal: 0,
  firstHgTotal: 0,
  passPercent: '0%'
})

const fetchData = async (prodLine) => {
  try {
    const getLine = () => {
      if (prodLine === 'CY') {
        return '1001'
      } else if (prodLine === 'HJ') {
        return '1003'
      }
      return prodLine
    }
    
    const lineValue = getLine()

    const res = await getTodayProduction(lineValue)
    const apolloRes = await getApolloStampingWelding(lineValue)
    
    if (res.code === 200) {

      // 格式化数据,去除小数点
      productionData.value = {
        ...res.data,
        pcTotal: Math.round(res.data.pcTotal),
        done: Math.round(res.data.done),
        undone: String(Math.round(Number(res.data.undone))),
        // 达成率 = (已完成/计划) * 100,取整
        rate: res.data.rate 
      }
      if (apolloRes.code === 200) {
        apolloStampingWeldingData.value = apolloRes.data
      }
    }
  } catch (error) {
    console.error('获取今日生产数据失败:', error)
  }
}

onMounted(() => {
  fetchData(prodLine)
  // 订阅刷新事件
  eventBus.on('refreshData', () => fetchData(prodLine))

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