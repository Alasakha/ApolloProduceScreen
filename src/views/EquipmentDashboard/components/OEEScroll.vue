<template>
  <div class="oee-scroll">
    <div class="title">关键设备OEE状况滚动 (昨日)</div>
    <div class="toolbar">
      <el-select
        v-model="selectedWorkshop"
        placeholder="选择车间"
        size="small"
        @change="onWorkshopChange"
      >
        <el-option
          v-for="name in workshopOptions"
          :key="name"
          :label="name"
          :value="name"
        />
      </el-select>
    </div>
    <div class="scroll-subtitle">单台</div>
    <div class="scroll-container">
      <div
        class="scroll-content"
        :style="{ transform: `translateY(-${scrollIndex * itemHeight}px)` }"
      >
        <div
          v-for="(item, index) in scrollData"
          :key="index"
          class="scroll-item"
          :class="{
            active: index === scrollIndex,
            'low-rate': isLowRate(item)
          }"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-value">
            <span v-if="typeof item.oee === 'number'">{{ item.oee }}%</span>
            <span v-else class="na">NA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOeeStore } from '@/store/oee'

const scrollIndex = ref(0)
const itemHeight = 50
let scrollTimer: number | null = null

const oeeStore = useOeeStore()
const { workshopOptions } = storeToRefs(oeeStore)

// 默认选第一个车间
const selectedWorkshop = ref<string>('')

const scrollData = computed(() => {
  if (!selectedWorkshop.value) return []
  return oeeStore.oeeList(selectedWorkshop.value)
})

const isLowRate = (item: { name: string; oee: number | string }) => {
  if (typeof item.oee !== 'number') return true
  // 目标稼动率 85%~120%，超出此范围视为异常
  return item.oee < 65 || item.oee > 120
}

const startScroll = () => {
  if (!scrollData.value.length) return
  scrollTimer = window.setInterval(() => {
    scrollIndex.value = (scrollIndex.value + 1) % scrollData.value.length
  }, 2000)
}

const onWorkshopChange = () => {
  scrollIndex.value = 0
  startScroll()
}

onMounted(async () => {
  await oeeStore.fetchOee()
  // 初始化默认选第一个车间
  if (workshopOptions.value.length) {
    selectedWorkshop.value = workshopOptions.value[0]
  }
  startScroll()
})

onBeforeUnmount(() => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
})
</script>

<style scoped>
.oee-scroll {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
}

.toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  padding: 6px 8px;
}
.toolbar .el-select .el-input__inner {
  background: rgba(0,0,0,0.25);
  color: #8cc8ff;
  border-color: rgba(0,212,255,0.15);
  font-size: 18px;
  height: 40px;
  padding-left: 12px;
}
.scroll-subtitle {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
}

.scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.scroll-content {
  transition: transform 0.5s ease-in-out;
}

.scroll-item {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  transition: all 0.3s;
}

.scroll-item.active {
  background: rgba(0, 212, 255, 0.2);
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

/* 低于阈值样式 */
.scroll-item.low-rate {
  border-color: rgba(255,77,79,0.6);
  background: rgba(255,77,79,0.06);
  box-shadow: 0 0 8px rgba(255,77,79,0.08);
}
.scroll-item.low-rate .item-value {
  color: #ff4d4f;
}

.item-name {
  color: #ffffff;
  font-size: 14px;
}

.item-value {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
}

.item-value .na {
  color: #8cc8ff;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }

  .scroll-subtitle {
    font-size: 16px;
  }

  .item-name {
    font-size: 16px;
  }

  .item-value {
    font-size: 20px;
  }
}
</style>
