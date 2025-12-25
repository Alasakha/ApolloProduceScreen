<template>
  <div class="plan-container">
    <!-- 生产计划进度 -->
    <div class="section">

      <div v-if="loading" class="loading-text">加载中...</div>
      <div v-else-if="monthlyData.length === 0" class="empty-text">暂无数据</div>
      <div v-else class="device-list">
        <div class="carousel-wrapper">
          <transition name="fade" mode="out-in">
            <div 
              v-if="currentMonthlyIndex < monthlyData.length"
              :key="currentMonthlyIndex"
              class="device-item"
            >
              <!-- <div class="device-name">{{ monthlyData[currentMonthlyIndex]?.machName }}</div> -->
              <div class="device-data">
                <div class="section-title">月度生产计划进度</div>
                <div class="data-item">
                  <span class="label">计划数</span>
                  <span class="value">{{ monthlyData[currentMonthlyIndex]?.pg }}</span>
                </div>
                <div class="data-item">
                  <span class="label">完成数</span>
                  <span class="value">{{ monthlyData[currentMonthlyIndex]?.done }}</span>
                </div>
                <div class="data-item">
                  <span class="label">完成率</span>
                  <span class="value">{{ formatRate(monthlyData[currentMonthlyIndex]?.rate) }}%</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- 指示器 -->
        <div v-if="monthlyData.length > 1" class="carousel-indicators">
          <span 
            v-for="(_, index) in monthlyData" 
            :key="index"
            :class="['indicator', { active: index === currentMonthlyIndex }]"
          ></span>
        </div>
      </div>
    </div>

    <!-- 日计划完成情况 -->
    <div class="section daily-section">

      <div v-if="loading" class="loading-text">加载中...</div>
      <div v-else-if="dailyData.length === 0" class="empty-text">暂无数据</div>
      <div v-else class="device-list">
        <!-- 表头 -->
        <div class="device-item device-header">
          <!-- <div class="device-name">号站</div> -->
          <div class="device-data">
            <div class="section-title mt-4">日计划完成情况</div>
            <div class="data-item ml-[2%]">
              <span class="value">PMC日机台排产数</span>
            </div>
            <div class="data-item">
              <span class="value">完成数</span>
            </div>
            <div class="data-item">
              <span class="value">完成率</span>
            </div>
          </div>
        </div>
        <!-- 数据行 -->
        <div 
          v-for="(item, index) in dailyData" 
          :key="index"
          class="device-item"
        >
          <div class="device-name">{{ item.machName }}</div>
          <div class="device-data">
            <div class="data-item">
              <span class="value">{{ item.pg }}</span>
            </div>
            <div class="data-item">
              <span class="value">{{ item.done > -1 ? item.done : '未开机' }}</span>
            </div>
            <div class="data-item">
              <span class="value">{{ Number(formatRate(item.rate)) >= 0? formatRate(item.rate)+'%' : '未开机' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { getProductionScheduleProgress, type ProductionScheduleProgressItem } from '@/api/getStampWeldinfo'
import { eventBus } from '@/utils/eventbus'

const props = defineProps<{
  prodLine?: string
  type?: string  // 1:安川, 2:松下
  dailyDataProp?: any  // 日数据
  monthlyDataProp?: any  // 月数据
}>()

// 格式化完成率：如果小数部分为0则省略小数点
const formatRate = (rate: number | undefined | null): string => {
  const value = rate ?? 0
  const formatted = value.toFixed(1)
  // 如果小数部分为0，去掉小数点
  return formatted.replace(/\.0$/, '')
}

const loading = ref(false)
const monthlyData = ref<Array<ProductionScheduleProgressItem & { rate: number }>>([])
const dailyData = ref<Array<ProductionScheduleProgressItem & { rate: number }>>([])

// 轮播相关
const currentMonthlyIndex = ref(0)
const monthlyTimer = ref<NodeJS.Timeout | null>(null)

// 轮播间隔时间（毫秒），默认3秒
const carouselInterval = 3000

// 处理传入的日数据和月数据
const processPropData = () => {
  if (props.dailyDataProp && props.monthlyDataProp) {
    // 处理日数据
    const dailyItem: ProductionScheduleProgressItem & { rate: number } = {
      type: 2,
      machName: '一部焊接',
      pg: props.dailyDataProp.data?.pcTotal || props.dailyDataProp.pcTotal || 0,
      done: props.dailyDataProp.data?.done || props.dailyDataProp.done || 0,
      pgDetailList: null,
      rate: 0
    }
dailyItem.rate = dailyItem.pg > 0 
  ? parseFloat(((dailyItem.done / dailyItem.pg) * 100).toFixed(1))
  : 0
    
    // 处理月数据
    const monthlyItem: ProductionScheduleProgressItem & { rate: number } = {
      type: 1,
      machName: '一部焊接',
      pg: props.monthlyDataProp.data?.pcTotal || props.monthlyDataProp.pcTotal || 0,
      done: props.monthlyDataProp.data?.done || props.monthlyDataProp.done || 0,
      pgDetailList: null,
      rate: 0
    }
    monthlyItem.rate = monthlyItem.pg > 0 ? parseFloat(((monthlyItem.done / monthlyItem.pg) * 100).toFixed(1)) : 0
    
    dailyData.value = [dailyItem]
    monthlyData.value = [monthlyItem]
    
    // 重置轮播索引
    currentMonthlyIndex.value = 0
    
    // 启动轮播
    startCarousel()
    loading.value = false
    return true
  }
  return false
}

// 获取数据
const fetchData = async () => {
  // 如果传入了日数据和月数据，优先使用传入的数据
  if (processPropData()) {
    return
  }

  if (!props.prodLine || !props.type) {
    console.warn('缺少必要参数: prodLine 或 type')
    return
  }

  loading.value = true
  try {
    const res = await getProductionScheduleProgress(props.prodLine, props.type)
    
    if (res.data && res.data.length > 0) {
      // 处理返回的数据
      const allItems: ProductionScheduleProgressItem[] = []
      
      res.data.forEach((item: any) => {
        // 如果 data 是数组，直接使用
        if (Array.isArray(item.data)) {
          allItems.push(...item.data)
        } else if (item.data && typeof item.data === 'object') {
          // 如果 data 是对象，尝试提取数组
          const dataArray = item.data.data || item.data.items || []
          if (Array.isArray(dataArray)) {
            allItems.push(...dataArray)
          } else if (Array.isArray(item.data)) {
            // 如果 data 本身是数组但被包装了
            allItems.push(...item.data)
          }
        }
      })

      // 如果没有找到数据，尝试直接使用 res.data 作为数组
      if (allItems.length === 0 && Array.isArray(res.data)) {
        // 检查 res.data 是否直接是 ProductionScheduleProgressItem 数组
        const firstItem = res.data[0]
        if (firstItem && 'machName' in firstItem && 'pg' in firstItem) {
          allItems.push(...(res.data as unknown as ProductionScheduleProgressItem[]))
        }
      }

      // 分离月度数据（type=1）和今日数据（type=2）
      const monthly = allItems
        .filter(item => item.type === 1)
        .map(item => ({
          ...item,
          rate: item.pg > 0 ? parseFloat(((item.done / item.pg) * 100).toFixed(1)) : 0
        }))
      
      const daily = allItems
        .filter(item => item.type === 2)
        .map(item => ({
          ...item,
          rate: item.pg > 0 ? parseFloat(((item.done / item.pg) * 100).toFixed(1)) : 0
        }))

      monthlyData.value = monthly
      dailyData.value = daily
      
      // 重置轮播索引
      currentMonthlyIndex.value = 0
      
      // 启动轮播
      startCarousel()
    } else {
      monthlyData.value = []
      dailyData.value = []
      stopCarousel()
    }
  } catch (error) {
    console.error('获取生产计划进度数据失败:', error)
    monthlyData.value = []
    dailyData.value = []
    stopCarousel()
  } finally {
    loading.value = false
  }
}

// 监听 props 变化
watch(() => [props.dailyDataProp, props.monthlyDataProp], () => {
  processPropData()
}, { deep: true })

// 启动轮播
const startCarousel = () => {
  stopCarousel() // 先清除之前的定时器
  
  // 月度数据轮播
  if (monthlyData.value.length > 1) {
    monthlyTimer.value = setInterval(() => {
      currentMonthlyIndex.value = (currentMonthlyIndex.value + 1) % monthlyData.value.length
    }, carouselInterval)
  }
}

// 停止轮播
const stopCarousel = () => {
  if (monthlyTimer.value) {
    clearInterval(monthlyTimer.value)
    monthlyTimer.value = null
  }
}

onMounted(() => {
  // 先尝试处理传入的数据，如果没有则调用原来的接口
  if (!processPropData()) {
    fetchData()
  }
  eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
  stopCarousel()
  eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.plan-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  /* display: flex; */
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  overflow: hidden;
}

.section {
  display: flex;
  /* flex-direction: column; */
  gap: 6px;
  flex: 1;
  min-height: 0;
  /* overflow-y: auto; */
  align-items: center;
}

.daily-section {
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.section-title {
  color: #72f0f5;
  font-size: 13px;
  font-weight: 600;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(114, 240, 245, 0.3);
  line-height: 1.2;
  flex-shrink: 0;
}

.daily-section .section-title {
  font-size: 12px;
  padding-bottom: 3px;
  margin-bottom: 2px;
}

.loading-text,
.empty-text {
  color: #72f0f5;
  font-size: 12px;
  text-align: center;
  padding: 10px;
  opacity: 0.7;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.carousel-wrapper {
  flex: 1;
  position: relative;
  /* min-height: 100px; */
}

.device-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(114, 240, 245, 0.05);
  border: 1px solid rgba(114, 240, 245, 0.2);
  border-radius: 4px;
  width: 100%;
}


.device-item:hover {
  background: rgba(114, 240, 245, 0.1);
  border-color: rgba(114, 240, 245, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(114, 240, 245, 0.15);
}

.device-header {
  background: rgba(114, 240, 245, 0.15);
  border-color: rgba(114, 240, 245, 0.4);
  font-weight: 600;
  cursor: default;
}

.device-header:hover {
  background: rgba(114, 240, 245, 0.15);
  border-color: rgba(114, 240, 245, 0.4);
  transform: none;
  box-shadow: none;
}

.device-name {
  color: #72f0f5;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  flex-shrink: 0;
  min-width: 80px;
  padding-right: 8px;
  border-right: 1px solid rgba(114, 240, 245, 0.2);
  text-align: left;
}


.device-data {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  flex: 1;
  justify-content: flex-start;
}


.data-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 5px 10px;
  background: rgba(114, 240, 245, 0.1);
  border: 1px solid rgba(114, 240, 245, 0.3);
  border-radius: 4px;
  min-width: 70px;
  flex: 1;
  transition: all 0.3s ease;
}


.data-item:hover {
  background: rgba(114, 240, 245, 0.2);
  border-color: rgba(114, 240, 245, 0.5);
}

.data-item .label {
  color: #72f0f5;
  font-size: 10px;
  font-weight: 400;
  opacity: 0.9;
  line-height: 1.2;
}

.data-item .value {
  color: #72f0f5;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(21, 101, 192, 0.3);
  line-height: 1.2;
}

.device-header .data-item .value {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.95;
}


/* 1080p (1920px) */
@media (min-width: 1920px) {
  .plan-container {
    padding: 10px 14px;
    gap: 12px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .daily-section .section-title {
    font-size: 14px;
  }
  
  .device-item {
    /* padding: 10px; */
    gap: 14px;
  }
  
  .device-name {
    font-size: 12px;
  }
  
  .device-data {
    gap: 8px;
  }
  
  .data-item {
    padding: 2px 6px;
    gap: 4px;
  }
  
  .data-item .label {
    font-size: 10px;
  }
  
  .data-item .value {
    font-size: 12px;
  }
  
  .device-header .data-item .value {
    font-size: 12px;
    padding: 0px;
  }
  
  .loading-text,
  .empty-text {
    font-size: 14px;
  }
}

/* 2K (2060px) */
@media (min-width: 2060px) {
  .plan-container {
    padding: 12px 16px;
    gap: 14px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .daily-section .section-title {
    font-size: 16px;
  }
  
  .device-item {
    /* padding: 12px; */
    gap: 16px;
  }
  
  .device-name {
    font-size: 15px;
  }
  
  .device-data {
    gap: 12px;
  }
  
  .data-item {
    padding: 4px 7px;
    gap: 6px;
  }
  
  .data-item .label {
    font-size: 14px;
  }
  
  .data-item .value {
    font-size: 18px;
  }
  
  .device-header .data-item .value {
    font-size: 18px;
  }
  
  .loading-text,
  .empty-text {
    font-size: 16px;
  }
}

/* 4K (3800px) */
@media (min-width: 3800px) {
  .plan-container {
    padding: 16px 20px;
    gap: 16px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .daily-section .section-title {
    font-size: 20px;
  }
  
  .device-item {
    padding: 16px;
    gap: 20px;
  }
  
  .device-name {
    font-size: 22px;
  }
  
  .device-data {
    gap: 12px;
  }
  
  .data-item {
    padding: 10px 16px;
    gap: 8px;
  }
  
  .data-item .label {
    font-size: 20px;
  }
  
  .data-item .value {
    font-size: 26px;
  }
  
  .device-header .data-item .value {
    font-size: 22px;
  }
  
  .loading-text,
  .empty-text {
    font-size: 20px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .plan-container {
    padding: 6px 10px;
    gap: 8px;
  }
  
  .section-title {
    font-size: 12px;
  }
  
  .device-item {
    padding: 6px;
  }
  
  .device-name {
    font-size: 11px;
    min-width: 70px;
  }
  
  .data-item {
    padding: 4px 8px;
    min-width: 60px;
  }
  
  .data-item .label {
    font-size: 9px;
  }
  
  .data-item .value {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .plan-container {
    padding: 5px 8px;
    gap: 6px;
  }
  
  .device-data {
    flex-direction: column;
    align-items: stretch;
  }
  
  .data-item {
    flex-direction: row;
    justify-content: space-between;
    padding: 6px 10px;
  }
}

/* 轮播动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* 轮播指示器 */
.carousel-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  flex-shrink: 0;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(114, 240, 245, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #72f0f5;
  width: 20px;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(114, 240, 245, 0.6);
}

.indicator:hover {
  background: rgba(114, 240, 245, 0.6);
}
</style>
