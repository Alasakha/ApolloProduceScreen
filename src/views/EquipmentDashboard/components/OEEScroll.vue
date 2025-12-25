<template>
  <div class="oee-scroll">
    <div class="title">关键设备OEE状况滚动 (昨日)</div>
  <div class="toolbar">
    <el-select v-model="selectedWorkshop" placeholder="选择车间" size="small" @change="onWorkshopChange">
      <el-option label="冲压(CY)" value="CY"></el-option>
      <el-option label="焊接(HJ)" value="HJ"></el-option>
      <el-option label="金工二部(JG2)" value="JG2"></el-option>
      <el-option label="注塑(ZHS)" value="ZHS"></el-option>
    </el-select>
  </div>
  <div class="scroll-subtitle">单台</div>
    <div class="scroll-container">
      <div class="scroll-content" :style="{ transform: `translateY(-${scrollIndex * itemHeight}px)` }">
        <div
          v-for="(item, index) in scrollData"
          :key="index"
          class="scroll-item"
          :class="{ active: index === scrollIndex, 'low-rate': typeof item.oee !== 'number' || item.oee < 65 || item.oee > 120 }"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-value">
            <span v-if="typeof item.oee === 'number'">{{ item.oee }}%</span>
            <span v-else>NA</span>
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
const { oeeList } = storeToRefs(oeeStore)

const scrollData = computed(() => oeeList.value)

const startScroll = () => {
  if (!scrollData.value.length) return
  scrollTimer = window.setInterval(() => {
    scrollIndex.value = (scrollIndex.value + 1) % scrollData.value.length
  }, 2000) // 每2秒滚动一次
}

const selectedWorkshop = ref('CY')
const onWorkshopChange = async (val: string) => {
  await oeeStore.fetchOee(val)
  scrollIndex.value = 0
}

onMounted(async () => {
  await oeeStore.fetchOee(selectedWorkshop.value)
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

/* 低于阈值样式（小于85%） */
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


