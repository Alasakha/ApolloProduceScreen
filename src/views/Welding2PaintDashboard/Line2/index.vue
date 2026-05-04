<template>
  <div class="line2-container">
    <div class="section-header">
      <h3>关键设备生产进度</h3>
      <div class="header-actions">
        <button 
          class="mode-toggle-btn"
          :class="{ active: isDetailMode }"
          @click="toggleMode"
        >
          <span class="btn-icon">{{ isDetailMode ? '◉' : '○' }}</span>
          <span class="btn-text">{{ isDetailMode ? '详细' : '简洁' }}</span>
        </button>
        <button class="expand-btn" @click="collapsed = !collapsed">
          {{ collapsed ? '展开' : '收起' }}
        </button>
      </div>
    </div>
    
    <div class="cards-wrapper" v-if="!collapsed">
      <TransitionGroup name="card-fade" tag="div" class="cards-scroll" ref="scrollContainer">
        <MachineCard
          v-for="(card, index) in machineCards"
          :key="card.id"
          :card="card"
          :index="index"
          :isDetailMode="isDetailMode"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import MachineCard from '../components/MachineCard.vue'

const collapsed = ref(false)
const isDetailMode = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

interface MachineCard {
  id: number
  name: string
  model: string
  status: 'running' | 'fault' | 'standby' | 'adjusting'
  todayPlan: number
  planHours: number
  currentProduct: string
  planQty: number
  doneQty: number
  standardTemp: number
  actualTemp: number
  completionRate: number
  processedHours: number
  activationRate: number
  processName: string
  alarm: string
}

const machineCards = ref<MachineCard[]>([
  {
    id: 1,
    name: '涂装线1号',
    model: 'PT-2000',
    status: 'running',
    todayPlan: 450,
    planHours: 8,
    currentProduct: 'AEC-TDQ01-12L',
    planQty: 450,
    doneQty: 320,
    standardTemp: 180,
    actualTemp: 182,
    completionRate: 71,
    processedHours: 5.8,
    activationRate: 95,
    processName: '底漆喷涂',
    alarm: ''
  },
  {
    id: 2,
    name: '涂装线2号',
    model: 'PT-2000',
    status: 'running',
    todayPlan: 380,
    planHours: 8,
    currentProduct: 'AGA300AEO18EFI',
    planQty: 380,
    doneQty: 285,
    standardTemp: 175,
    actualTemp: 176,
    completionRate: 75,
    processedHours: 6.0,
    activationRate: 98,
    processName: '面漆喷涂',
    alarm: ''
  },
  {
    id: 3,
    name: '涂装线3号',
    model: 'PT-1500',
    status: 'adjusting',
    todayPlan: 300,
    planHours: 8,
    currentProduct: 'DNB-250CC',
    planQty: 300,
    doneQty: 150,
    standardTemp: 180,
    actualTemp: 178,
    completionRate: 50,
    processedHours: 4.0,
    activationRate: 72,
    processName: '烘干固化',
    alarm: ''
  },
  {
    id: 4,
    name: '涂装线4号',
    model: 'PT-2000',
    status: 'running',
    todayPlan: 420,
    planHours: 8,
    currentProduct: 'DNS200A-01',
    planQty: 420,
    doneQty: 420,
    standardTemp: 175,
    actualTemp: 190,
    completionRate: 100,
    processedHours: 8.0,
    activationRate: 100,
    processName: '面漆喷涂',
    alarm: '超差报警：温度偏高'
  },
  {
    id: 5,
    name: '涂装线5号',
    model: 'PT-1800',
    status: 'fault',
    todayPlan: 350,
    planHours: 8,
    currentProduct: 'DXF150-12L',
    planQty: 350,
    doneQty: 120,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 34,
    processedHours: 2.5,
    activationRate: 35,
    processName: '预处理',
    alarm: '设备故障停机'
  },
  {
    id: 6,
    name: '涂装线6号',
    model: 'PT-2000',
    status: 'standby',
    todayPlan: 280,
    planHours: 8,
    currentProduct: '--',
    planQty: 280,
    doneQty: 0,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 0,
    processedHours: 0,
    activationRate: 0,
    processName: '--',
    alarm: ''
  },
    {
    id: 5,
    name: '涂装线5号',
    model: 'PT-1800',
    status: 'fault',
    todayPlan: 350,
    planHours: 8,
    currentProduct: 'DXF150-12L',
    planQty: 350,
    doneQty: 120,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 34,
    processedHours: 2.5,
    activationRate: 35,
    processName: '预处理',
    alarm: '设备故障停机'
  },
  {
    id: 6,
    name: '涂装线6号',
    model: 'PT-2000',
    status: 'standby',
    todayPlan: 280,
    planHours: 8,
    currentProduct: '--',
    planQty: 280,
    doneQty: 0,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 0,
    processedHours: 0,
    activationRate: 0,
    processName: '--',
    alarm: ''
  },
    {
    id: 5,
    name: '涂装线5号',
    model: 'PT-1800',
    status: 'fault',
    todayPlan: 350,
    planHours: 8,
    currentProduct: 'DXF150-12L',
    planQty: 350,
    doneQty: 120,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 34,
    processedHours: 2.5,
    activationRate: 35,
    processName: '预处理',
    alarm: '设备故障停机'
  },
  {
    id: 6,
    name: '涂装线6号',
    model: 'PT-2000',
    status: 'standby',
    todayPlan: 280,
    planHours: 8,
    currentProduct: '--',
    planQty: 280,
    doneQty: 0,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 0,
    processedHours: 0,
    activationRate: 0,
    processName: '--',
    alarm: ''
  },
    {
    id: 5,
    name: '涂装线5号',
    model: 'PT-1800',
    status: 'fault',
    todayPlan: 350,
    planHours: 8,
    currentProduct: 'DXF150-12L',
    planQty: 350,
    doneQty: 120,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 34,
    processedHours: 2.5,
    activationRate: 35,
    processName: '预处理',
    alarm: '设备故障停机'
  },
  {
    id: 6,
    name: '涂装线6号',
    model: 'PT-2000',
    status: 'standby',
    todayPlan: 280,
    planHours: 8,
    currentProduct: '--',
    planQty: 280,
    doneQty: 0,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 0,
    processedHours: 0,
    activationRate: 0,
    processName: '--',
    alarm: ''
  },
    {
    id: 5,
    name: '涂装线5号',
    model: 'PT-1800',
    status: 'fault',
    todayPlan: 350,
    planHours: 8,
    currentProduct: 'DXF150-12L',
    planQty: 350,
    doneQty: 120,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 34,
    processedHours: 2.5,
    activationRate: 35,
    processName: '预处理',
    alarm: '设备故障停机'
  },
  {
    id: 6,
    name: '涂装线6号',
    model: 'PT-2000',
    status: 'standby',
    todayPlan: 280,
    planHours: 8,
    currentProduct: '--',
    planQty: 280,
    doneQty: 0,
    standardTemp: 180,
    actualTemp: 25,
    completionRate: 0,
    processedHours: 0,
    activationRate: 0,
    processName: '--',
    alarm: ''
  },
  
])

const toggleMode = () => {
  isDetailMode.value = !isDetailMode.value
}

let scrollInterval: NodeJS.Timeout | null = null

const startAutoScroll = () => {
  scrollInterval = setInterval(() => {
    if (scrollContainer.value && !collapsed.value) {
      const container = scrollContainer.value
      // 检查是否已经滚动到底部
      if (container.scrollTop >= container.scrollHeight - container.clientHeight - 1) {
        container.scrollTop = 0
      } else {
        container.scrollTop += 1 // 垂直向上滚动
      }
    }
  }, 50)
}

const loadData = () => {
  machineCards.value.forEach(card => {
    if (card.status === 'running') {
      card.doneQty = Math.min(card.doneQty + Math.floor(Math.random() * 3), card.planQty)
      card.completionRate = Math.round((card.doneQty / card.planQty) * 100)
    }
  })
}

onMounted(() => {
  startAutoScroll()
  eventBus.on('refreshData', loadData)
})

onBeforeUnmount(() => {
  if (scrollInterval) clearInterval(scrollInterval)
  eventBus.off('refreshData', loadData)
})
</script>

<style scoped>
.line2-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 30, 60, 0.6);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  background: rgba(0, 150, 255, 0.2);
  padding: 8px 15px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.mode-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 150, 255, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  color: #88ccff;
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.mode-toggle-btn:hover {
  background: rgba(0, 150, 255, 0.4);
}

.mode-toggle-btn.active {
  background: rgba(0, 200, 100, 0.3);
  border-color: rgba(0, 200, 100, 0.5);
  color: #00ff88;
}

.btn-icon {
  font-size: 10px;
}

.expand-btn {
  background: rgba(0, 150, 255, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.4);
  color: #00d4ff;
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.expand-btn:hover {
  background: rgba(0, 150, 255, 0.4);
}

.cards-wrapper {
  flex: 1;
  overflow: hidden;
  padding: 10px;
}

.cards-scroll {
  display: flex;
  flex-wrap: wrap;       /* 核心改动：允许换行 */
  gap: 12px;             /* 卡片之间的间距 */
  height: 100%;          /* 撑满高度 */
  overflow-y: auto;      /* 开启 Y 轴滚动 */
  overflow-x: hidden;    /* 禁用 X 轴滚动 */
  align-content: flex-start; /* 换行后靠顶部对齐 */
}

/* 自定义 Y 轴滚动条样式，使其更美观 */
.cards-scroll::-webkit-scrollbar {
  width: 5px;            /* 纵向滚动条看的是宽度 */
}

.cards-scroll::-webkit-scrollbar-track {
  background: rgba(0, 50, 100, 0.1);
}

.cards-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 150, 255, 0.3);
  border-radius: 10px;
}

/* 针对 MachineCard 的布局建议 */
:deep(.MachineCard) {
  /* 计算宽度公式：(100% - 间距总和) / 列数 
     例如想做 3 列：calc((100% - 24px) / 3) 
     建议使用 min-width 配合 flex-grow，实现自适应响应式
  */
  flex: 1 1 300px;      /* 最小 300px，自动充满剩余空间 */
  max-width: calc(50% - 6px); /* 在宽度足够时，一行最多显示两个（可选） */
}

@media (max-width: 1200px) {
  :deep(.MachineCard) {
    max-width: 100%;    /* 小屏幕单列显示 */
  }
}
/* 过渡动画 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.3s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.card-fade-move {
  transition: transform 0.3s ease;
}
</style>
