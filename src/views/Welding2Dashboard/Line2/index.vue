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
      <div v-if="machineLoading" class="loading-tip">加载中...</div>
      <div v-else-if="machineCards.length === 0" class="loading-tip">暂无设备数据</div>
      <TransitionGroup v-else name="card-fade" tag="div" class="cards-scroll" ref="scrollContainer">
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
import { getTemperature4 } from '@/api/getStampWeldinfo'
import { getMonthProductionCust } from '@/api/getMesInfo'

const ProductionLine = ref('2007')
const collapsed = ref(false)
const isDetailMode = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const machineLoading = ref(true)

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

const machineCards = ref<MachineCard[]>([])

async function loadData() {
  machineLoading.value = true
  try {
    const [tempRes, monthRes] = await Promise.all([
      getTemperature4(),
      getMonthProductionCust(ProductionLine.value)
    ])

    const lines: Array<{ name: string; standard: number; actual: number; status?: number }> = []
    if (tempRes.code === 200 && tempRes.data) {
      const d = tempRes.data
      if (d.ftxStandard || d.ftx) lines.push({ name: '粉体线', standard: d.ftxStandard || 0, actual: d.ftx || 0, status: d.ftxStatus })
      if (d.tbxStandard || d.tbx) lines.push({ name: '贴标线', standard: d.tbxStandard || 0, actual: d.tbx || 0, status: d.tbxStatus })
      if (d.ytxStandard || d.ytx) lines.push({ name: '液体线', standard: d.ytxStandard || 0, actual: d.ytx || 0, status: d.ytxStatus })
    }

    const { a_done = 0, b_done = 0 } = monthRes.data || {}
    const totalDone = a_done + b_done
    const share = totalDone > 0 ? Math.round(totalDone / Math.max(lines.length, 1)) : 0

    machineCards.value = lines.map((line, idx) => {
      let status: MachineCard['status'] = 'standby'
      if (line.status === 1) status = 'running'
      else if (line.status === 0) status = 'standby'

      let alarm = ''
      if (line.standard > 0 && Math.abs(line.actual - line.standard) > 5) {
        alarm = `温度超差：${line.actual}°C`
      }

      return {
        id: idx + 1,
        name: line.name,
        model: '',
        status,
        todayPlan: 0,
        planHours: 8,
        currentProduct: '--',
        planQty: 0,
        doneQty: share,
        standardTemp: line.standard,
        actualTemp: line.actual,
        completionRate: 0,
        processedHours: 0,
        activationRate: line.status === 1 ? 100 : 0,
        processName: line.status === 1 ? '运行中' : '待机',
        alarm
      }
    })
  } catch {
    machineCards.value = []
  } finally {
    machineLoading.value = false
  }
}

const toggleMode = () => {
  isDetailMode.value = !isDetailMode.value
}

let scrollInterval: NodeJS.Timeout | null = null

const startAutoScroll = () => {
  scrollInterval = setInterval(() => {
    if (scrollContainer.value && !collapsed.value) {
      const container = scrollContainer.value
      if (container.scrollTop >= container.scrollHeight - container.clientHeight - 1) {
        container.scrollTop = 0
      } else {
        container.scrollTop += 1
      }
    }
  }, 50)
}

onMounted(() => {
  startAutoScroll()
  loadData()
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

.loading-tip { color: #88ccff; font-size: 14px; text-align: center; padding: 30px; }

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
