<!-- <template>
  <div class="material-shortage-carousel">
    <div class="section-title">焊接次日生产欠料</div>
    <div class="carousel-container">
      <transition name="fade" mode="out-in">
        <div
          v-if="currentIndex < shortageList.length"
          :key="currentIndex"
          class="shortage-item"
        >
          <table class="shortage-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>排产时间</th>
                <th>客户单号</th>
                <th>品号</th>
                <th>品名</th>
                <th>欠料数量</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ currentIndex + 1 }}</td>
                <td>{{ currentItem.scheduleTime }}</td>
                <td>{{ currentItem.customerOrder }}</td>
                <td>{{ currentItem.partNumber }}</td>
                <td>{{ currentItem.partName }}</td>
                <td class="shortage-amount">{{ currentItem.shortageAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
    <div class="carousel-footer">
      <div class="carousel-indicators">
        <span
          v-for="(_, index) in shortageList"
          :key="index"
          :class="['indicator', { active: index === currentIndex }]"
          @click="goToIndex(index)"
        ></span>
      </div>
      <button class="detail-btn" @click="handleDetailClick">点击看明细</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'

interface ShortageItem {
  scheduleTime: string
  customerOrder: string
  partNumber: string
  partName: string
  shortageAmount: number
}

// Mock数据
const shortageList = ref<ShortageItem[]>([
  {
    scheduleTime: '11.2',
    customerOrder: 'ORD001',
    partNumber: '6000012401',
    partName: '焊接件A',
    shortageAmount: 100
  },
  {
    scheduleTime: '11.2',
    customerOrder: 'ORD002',
    partNumber: '6000012402',
    partName: '焊接件B',
    shortageAmount: 200
  },
  {
    scheduleTime: '11.3',
    customerOrder: 'ORD003',
    partNumber: '6000012403',
    partName: '焊接件C',
    shortageAmount: 150
  }
])

const currentIndex = ref(0)
const carouselTimer = ref<NodeJS.Timeout | null>(null)
const carouselInterval = 3000 // 3秒切换一次

const currentItem = computed(() => {
  return shortageList.value[currentIndex.value] || shortageList.value[0]
})

const startCarousel = () => {
  stopCarousel()
  if (shortageList.value.length > 1) {
    carouselTimer.value = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % shortageList.value.length
    }, carouselInterval)
  }
}

const stopCarousel = () => {
  if (carouselTimer.value) {
    clearInterval(carouselTimer.value)
    carouselTimer.value = null
  }
}

const goToIndex = (index: number) => {
  currentIndex.value = index
  startCarousel() // 重新开始轮播
}

const fetchData = async () => {
  try {
    // TODO: 连接真实 API
    // const res = await getMaterialShortageData()
    // if (res.code === 200) {
    //   shortageList.value = res.data
    //   if (shortageList.value.length > 0) {
    //     currentIndex.value = 0
    //     startCarousel()
    //   }
    // }
  } catch (error) {
    console.error('获取欠料数据失败:', error)
  }
}

const handleDetailClick = () => {
  // TODO: 打开详情弹窗
  console.log('查看欠料明细')
}

onMounted(() => {
  fetchData()
  startCarousel()
  eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
  stopCarousel()
  eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.material-shortage-carousel {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.carousel-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.shortage-item {
  width: 100%;
}

.shortage-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.shortage-table thead {
  background: rgba(0, 150, 255, 0.2);
}

.shortage-table th {
  color: #00d4ff;
  padding: 6px 4px;
  text-align: center;
  border: 1px solid rgba(0, 150, 255, 0.3);
  font-weight: bold;
  font-size: 10px;
}

.shortage-table td {
  color: #fff;
  padding: 8px 4px;
  text-align: center;
  border: 1px solid rgba(0, 150, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.shortage-amount {
  color: #ff4444;
  font-weight: bold;
}

.carousel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 150, 255, 0.2);
}

.carousel-indicators {
  display: flex;
  gap: 6px;
  align-items: center;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 150, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #00d4ff;
  width: 20px;
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
}

.indicator:hover {
  background: rgba(0, 150, 255, 0.6);
}

.detail-btn {
  background: rgba(0, 150, 255, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.5);
  color: #00d4ff;
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.detail-btn:hover {
  background: rgba(0, 150, 255, 0.3);
  border-color: rgba(0, 150, 255, 0.8);
  color: #fff;
  transform: translateY(-1px);
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
</style>
 -->
<template>
  <div class="line3-container flex">
    <!-- <TechBorderBox width="800px" height="360px">
  <div style="color:#fff;font-size:20px;">这里是内容</div>
</TechBorderBox> -->
      <dv-border-box-12 class="chart-box">
          <div class="box-title">焊接次日生产欠料</div>
        <AbnormalList></AbnormalList>
      </dv-border-box-12>
      
      <!-- <dv-border-box-12 class="chart-box">
          <div class="box-title flex justify-between items-center">
            <span>工单异常</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="handleDetail"
              class="action-btn"
            >
              查看详情
            </el-button>
          </div>
          <AbnormalProduce ref="abnormalProduceRef" :prod-line="props.prodLine"/>
      </dv-border-box-12> -->
  </div>

</template>

<script setup lang="ts">
// import { ref } from 'vue'
import AbnormalList from '../ScrollTable/leftcontent.vue'
// 工单异常
// import AbnormalProduce from './ScrollTable/rightcontent.vue'

// 定义 props 接收产线信息
// const props = defineProps<{
//   prodLine?: string | string[]
// }>()

// const abnormalProduceRef = ref()

// 处理查看详情按钮点击
// const handleDetail = () => {
  
//   if (abnormalProduceRef.value) {
//     abnormalProduceRef.value.handleDetail()
//   }
// }
</script>

<style scoped>
.line3-container {
  padding: 0.5rem;
}

.chart-box {
  width: 100%;
  height: 25vh;
  padding: 1rem;
}

.box-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.box-title {
  display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    text-align: center;
    font-size: 0.8vw;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
}

.chart-container {
  flex: 1;
  width: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 300px;
  position: relative;
  background: #000;
}
.svg-frame{
  width: 100%;
  height: 100%;
  object-fit: fill; /* 或 contain/cover 看需求 */
}
</style> 