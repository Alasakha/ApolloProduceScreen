<template>
  <div class="scroll-table-wrapper" :style="{ height: height }">
    <table class="scroll-table">
      <thead>
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="index"
            :style="{ width: column.width || 'auto', textAlign: column.align || 'center' }"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
    </table>

    <div class="scroll-container" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
      <div
        class="scroll-content"
        :style="{
          transform: `translateY(-${scrollIndex * itemHeight}px)`,
          transition: `transform ${scrollDuration}ms ease-in-out`
        }"
      >
        <table class="scroll-table scroll-table-body">
          <tbody>
            <tr
              v-for="(row, rowIndex) in loopData"
              :key="`${rowIndex}-${row.scrollIndex}`"
              :class="{ 'highlight-row': highlightRowIndex === rowIndex }"
              @click="handleRowClick(row, rowIndex)"
            >
              <td
                v-for="(column, colIndex) in columns"
                :key="colIndex"
                :style="{ width: column.width || 'auto', textAlign: column.align || 'center' }"
              >
                <slot :name="column.prop" :row="row.data" :value="row.data[column.prop]" :index="rowIndex">
                  <span v-if="column.type === 'status'">
                    <span :class="['status-badge', getStatusClass(row.data[column.prop], column.statusMap)]">
                      {{ row.data[column.prop] }}
                    </span>
                  </span>
                  <span v-else-if="column.type === 'progress'">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: row.data[column.prop] + '%' }"></div>
                      <span class="progress-text">{{ row.data[column.prop] }}%</span>
                    </div>
                  </span>
                  <span v-else-if="column.type === 'warning'">
                    <span :class="[row.data[column.prop] > column.warningValue ? 'warning-text' : '']">
                      {{ row.data[column.prop] }}
                      <span v-if="row.data[column.prop] > column.warningValue" class="warning-icon">⚠️</span>
                    </span>
                  </span>
                  <span v-else>{{ row.data[column.prop] }}</span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

interface Column {
  prop: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  type?: 'text' | 'status' | 'progress' | 'warning'
  statusMap?: Record<string, string>
  warningValue?: number
}

interface Props {
  columns: Column[]
  data: any[]
  height?: string
  maxDisplayRows?: number
  scrollInterval?: number
  highlightFirst?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '200px',
  maxDisplayRows: 8,
  scrollInterval: 3000,
  highlightFirst: false
})

const itemHeight = 36  // 每行高度
const scrollDuration = 500  // 滚动动画时间(ms)
const scrollIndex = ref(0)
const isPaused = ref(false)
let scrollTimer: number | null = null

// 定义行点击事件
const emit = defineEmits<{
  (e: 'row-click', row: any, index: number): void
}>()

// 处理行点击
const handleRowClick = (row: any, rowIndex: number) => {
  emit('row-click', row.data, rowIndex)
}

// 是否需要滚动
const needScroll = computed(() => props.data.length > props.maxDisplayRows)

// 循环数据（复制一份用于无缝滚动）
const loopData = computed(() => {
  const data = [...props.data]

  // 数据量小于2倍时复制一份
  if (data.length < props.maxDisplayRows * 2) {
    data.push(...data)
  }

  return data.map((d, i) => ({ data: d, scrollIndex: i }))
})

// 高亮的行索引
const highlightRowIndex = computed(() => {
  if (!props.highlightFirst || !needScroll.value) return -1
  return scrollIndex.value === 0 ? 0 : -1
})

// 获取状态样式
const getStatusClass = (value: string, statusMap?: Record<string, string>) => {
  if (statusMap && statusMap[value]) {
    return statusMap[value]
  }

  const defaultMap: Record<string, string> = {
    '已完成': 'status-completed',
    '完成': 'status-completed',
    '已发货': 'status-completed',
    '配送中': 'status-delivering',
    '配送': 'status-delivering',
    '生产中': 'status-producing',
    '待配送': 'status-pending',
    '待发货': 'status-pending',
    '待投产': 'status-pending'
  }

  return defaultMap[value] || ''
}

// 滚动函数
const startScroll = () => {
  if (!needScroll.value) return

  // 先清除已有的定时器
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }

  scrollTimer = window.setInterval(() => {
    if (isPaused.value) return

    // 滚动到下一个
    scrollIndex.value++

    // 如果滚动到复制数据的开始，重置索引（实现无缝循环）
    if (scrollIndex.value >= props.data.length) {
      // 先等动画完成
      setTimeout(() => {
        scrollIndex.value = 0
      }, scrollDuration)
    }
  }, props.scrollInterval)
}

// 暂停滚动
const pauseScroll = () => {
  isPaused.value = true
}

// 恢复滚动
const resumeScroll = () => {
  isPaused.value = false
}

// 手动滚动到某一行
const scrollToRow = (index: number) => {
  if (index >= 0 && index < props.data.length) {
    scrollIndex.value = index
  }
}

// 刷新数据
const refreshData = () => {
  scrollIndex.value = 0
}

onMounted(() => {
  startScroll()
})

// 监听数据变化，数据更新后重新启动滚动
watch(() => props.data.length, (newLen) => {
  if (newLen > props.maxDisplayRows) {
    scrollIndex.value = 0
    startScroll()
  }
})

onBeforeUnmount(() => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
})

defineExpose({
  pauseScroll,
  resumeScroll,
  scrollToRow,
  refreshData
})
</script>

<style scoped>
.scroll-table-wrapper {
  width: 100%;
  height: v-bind(height);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}

.scroll-table thead {
  flex-shrink: 0;
}

.scroll-table th {
  background: rgba(0, 150, 255, 0.3);
  color: #00d4ff;
  padding: 8px 6px;
  font-weight: bold;
  border: 1px solid rgba(0, 150, 255, 0.3);
  white-space: nowrap;
}

.scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.scroll-content {
  will-change: transform;
}

.scroll-table-body {
  width: 100%;
}

.scroll-table-body td {
  padding: 6px 6px;
  color: #ffffff;
  border: 1px solid rgba(0, 150, 255, 0.2);
  background: rgba(0, 50, 100, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll-table tbody tr {
  height: 36px;
  cursor: pointer;
}

.scroll-table tbody tr:hover td {
  background: rgba(0, 150, 255, 0.15);
}

.highlight-row td {
  background: rgba(0, 150, 255, 0.25) !important;
}

/* 状态标签样式 */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}

.status-completed {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.5);
}

.status-delivering {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.status-producing {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  border: 1px solid rgba(255, 165, 0, 0.5);
}

.status-pending {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.5);
}

/* 进度条 */
.progress-bar {
  position: relative;
  height: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
  min-width: 80px;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 150, 255, 0.6), rgba(0, 212, 255, 0.8));
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  width: 100%;
  text-align: center;
  line-height: 16px;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
}

/* 警告文字 */
.warning-text {
  color: #ff4444;
  text-shadow: 0 0 5px rgba(255, 68, 68, 0.5);
}

.warning-icon {
  margin-left: 4px;
}
</style>
