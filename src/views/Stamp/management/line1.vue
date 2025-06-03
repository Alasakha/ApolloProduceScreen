<template>
  <div class="line1-container">
    <div class="grid grid-cols-3 gap-4">
      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日总排产</div>
          <div class="box-value">{{ productionData.pcTotal }}</div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日已生产</div>
          <div class="box-value">{{ productionData.done }}</div>
        </div>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box">
        <div class="box-content">
          <div class="box-title">今日待生产</div>
          <div class="box-value">{{ productionData.undone }}</div>
        </div>
      </dv-border-box-12>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTodayProduction, type TodayProduction } from '@/api/getStampinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'

const route = useRoute()
const prodLine = route.query.prodLine as string

const productionData = ref<TodayProduction>({
  rate: 0,
  pcTotal: 0,
  done: 0,
  undone: '0'
})

const fetchData = async () => {
  try {
    const res = await getTodayProduction(prodLine)
    if (res.code === 200) {
      // 格式化数据,去除小数点
      productionData.value = {
        ...res.data,
        pcTotal: Math.round(res.data.pcTotal),
        done: Math.round(res.data.done),
        undone: String(Math.round(Number(res.data.undone))),
        // 达成率 = (已完成/计划) * 100,取整
        rate: res.data.pcTotal ? Math.round((res.data.done / res.data.pcTotal) * 100) : 0
      }
    }
  } catch (error) {
    console.error('获取今日生产数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
  // 订阅刷新事件
  eventBus.on('refreshData', fetchData)
})
</script>

<style scoped>
.line1-container {
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
    font-size: 1vw;
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