<template>
  <div class="status-scroll-bar">
    <div class="panel-header">
      <h3 class="panel-title">设备状态实时滚动条:</h3>
      <div class="panel-description">含设备故障、维修、点检等项</div>
    </div>
    <div class="scroll-content">
      <div class="scroll-wrapper">
        <div
          class="scroll-list"
          :style="{ transform: `translateY(-${currentOffset}px)` }"
        >
          <div
            v-for="(item, index) in scrollList"
            :key="index"
            class="scroll-item"
          >
            <div class="item-time">{{ item.time }}</div>
            <div class="item-status" :class="getStatusClass(item.status)">
              {{ item.status }}
            </div>
            <div class="item-name">{{ item.equipmentName }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
          <!-- 复制列表以实现无缝滚动 -->
          <div
            v-for="(item, index) in scrollList"
            :key="`dup-${index}`"
            class="scroll-item"
          >
            <div class="item-time">{{ item.time }}</div>
            <div class="item-status" :class="getStatusClass(item.status)">
              {{ item.status }}
            </div>
            <div class="item-name">{{ item.equipmentName }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface StatusItem {
  time: string
  status: string
  equipmentName: string
  description: string
}

const scrollList = ref<StatusItem[]>([
  { time: '10:30:25', status: '故障', equipmentName: '设备A-001', description: '电机过热，需要更换' },
  { time: '10:28:15', status: '维修中', equipmentName: '设备B-002', description: '正在进行维修作业' },
  { time: '10:25:40', status: '点检', equipmentName: '设备C-003', description: '定期点检完成' },
  { time: '10:22:10', status: '故障', equipmentName: '设备D-004', description: '传送带异常' },
  { time: '10:20:05', status: '维修完成', equipmentName: '设备E-005', description: '维修作业已完成' },
  { time: '10:18:30', status: '点检', equipmentName: '设备F-006', description: '日常点检进行中' },
  { time: '10:15:20', status: '故障', equipmentName: '设备G-007', description: '传感器故障' },
  { time: '10:12:55', status: '维修中', equipmentName: '设备H-008', description: '更换零部件' }
])

const currentOffset = ref(0)
const scrollSpeed = 1 // 每次滚动的像素数
let scrollTimer: number | null = null

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '故障': 'status-fault',
    '维修中': 'status-repairing',
    '点检': 'status-inspection',
    '维修完成': 'status-completed'
  }
  return statusMap[status] || ''
}

const startScrolling = () => {
  scrollTimer = window.setInterval(() => {
    const itemHeight = 60 // 每个item的高度
    const maxOffset = scrollList.value.length * itemHeight
    
    currentOffset.value += scrollSpeed
    
    // 当滚动到列表末尾时，重置位置实现无缝循环
    if (currentOffset.value >= maxOffset) {
      currentOffset.value = 0
    }
  }, 50) // 每50ms更新一次
}

onMounted(() => {
  // TODO: 调用API获取真实数据
  startScrolling()
})

onBeforeUnmount(() => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
  }
})
</script>

<style scoped>
.status-scroll-bar {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 2px;
}

.panel-title {
  font-size: 13px;
  color: #00d4ff;
  margin: 0;
  font-weight: bold;
  text-align: center;
}

.panel-description {
  font-size: 10px;
  color: #8cc8ff;
  text-align: center;
  margin-top: 2px;
}

.scroll-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.scroll-wrapper {
  height: 100%;
  overflow: hidden;
}

.scroll-list {
  transition: transform 0.3s linear;
}

.scroll-item {
  display: flex;
  align-items: center;
  padding: 8px 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.1);
  min-height: 60px;
  height: 60px;
  gap: 8px;
}

.item-time {
  color: #8cc8ff;
  font-size: 11px;
  width: 70px;
  flex-shrink: 0;
}

.item-status {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}

.status-fault {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-repairing {
  background: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
  border: 1px solid #f59e0b;
}

.status-inspection {
  background: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.status-completed {
  background: rgba(16, 185, 129, 0.3);
  color: #10b981;
  border: 1px solid #10b981;
}

.item-name {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  width: 120px;
  flex-shrink: 0;
}

.item-desc {
  color: #8cc8ff;
  font-size: 11px;
  flex: 1;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .panel-title {
    font-size: 16px;
  }

  .panel-description {
    font-size: 12px;
  }

  .item-time,
  .item-status,
  .item-name {
    font-size: 13px;
  }

  .item-desc {
    font-size: 12px;
  }

  .scroll-item {
    min-height: 70px;
    padding: 10px 6px;
  }
}
</style>

