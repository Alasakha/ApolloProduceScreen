<template>
  <div class="line2-container">
    <div class="grid grid-cols-4 gap-4">
      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日检验数</div>
          <div class="box-value">{{ inspectionData.checkTotal }}</div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日合格数</div>
          <div class="box-value">{{ inspectionData.firstHgTotal }}</div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日合格率</div>
          <div class="box-value">{{ inspectionData.passPercent }}</div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日产量达成率</div>
          <div class="box-value">{{ productionData.rate }}%</div>
        </div>
      </dv-border-box-12>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getTodayInspection, getTodayProduction, type TodayInspection, type TodayProduction } from '@/api/getStampinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'

const route = useRoute()
const prodLine = route.query.prodLine as string

const inspectionData = ref<TodayInspection>({
  checkTotal: 0,
  firstHgTotal: 0,
  passPercent: '0%'
})

const productionData = ref<TodayProduction>({
  rate: 0,
  pcTotal: 0,
  done: 0,
  undone: '0'
})

const fetchInspectionData = async () => {
  try {
    const res = await getTodayInspection(prodLine)
    if (res.code === 200) {
      inspectionData.value = {
        ...res.data,
        checkTotal: Math.round(res.data.checkTotal),
        firstHgTotal: Math.round(res.data.firstHgTotal),
        passPercent: res.data.passPercent.replace(/\..*%/, '%')
      }
    }
  } catch (error) {
    console.error('获取今日检验数据失败:', error)
  }
}

const fetchProductionData = async () => {
  try {
    const res = await getTodayProduction(prodLine)
    if (res.code === 200) {
      productionData.value = {
        ...res.data,
        pcTotal: Math.round(res.data.pcTotal),
        done: Math.round(res.data.done),
        undone: String(Math.round(Number(res.data.undone))),
        rate: res.data.pcTotal ? Math.round((res.data.done / res.data.pcTotal) * 100) : 0
      }
    }
  } catch (error) {
    console.error('获取今日生产数据失败:', error)
  }
}

// 刷新数据
const refreshData = () => {
  fetchInspectionData()
  fetchProductionData()
}

onMounted(() => {
  refreshData()
  
  // 订阅刷新事件
  eventBus.on('refreshData', refreshData)
  
  onUnmounted(() => {
    eventBus.off('refreshData', refreshData)
  })
})
</script>

<style scoped>
.line2-container {
  padding: 0.5rem;
}

.data-box {
  height: 15vh;
  padding: 1rem;
}

.box-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box-title {
  display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    text-align: center;
    font-size: 0.9vw;
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
</style> 