<template>
  <div class="equipment-utilization-rate">
    <div class="title">关键设备稼动率</div>
    <div class="equipment-list">
      <div
        v-for="(equipment, index) in displayList"
        :key="index"
        class="equipment-item"
      >
        <div class="equipment-name">{{ equipment.name }}</div>
        <div class="rate-container">
          <div class="rate-bar">
            <div
              class="rate-progress"
              :style="{ width: typeof equipment.rate === 'number' ? equipment.rate + '%' : '0%' }"
            ></div>
          </div>
          <div class="rate-value">
            <span v-if="typeof equipment.rate === 'number'">{{ equipment.rate }}%</span>
            <span v-else>NAN</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOeeStore } from '@/store/oee'

const oeeStore = useOeeStore()
const { operationList } = storeToRefs(oeeStore)

const displayList = computed(() =>
  operationList.value.map(item => ({
    name: item.name,
    rate: item.rate
  }))
)

onMounted(() => {
  oeeStore.fetchOee()
})
</script>

<style scoped>
.equipment-utilization-rate {
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
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.equipment-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
}

.equipment-list::-webkit-scrollbar {
  width: 4px;
}

.equipment-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.equipment-list::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.5);
  border-radius: 2px;
}

.equipment-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.7);
}

.equipment-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  transition: all 0.3s;
}

.equipment-item:hover {
  background: rgba(0, 150, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
}

.equipment-name {
  color: #ffffff;
  font-size: 14px;
}

.rate-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rate-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.rate-progress {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff 0%, #00ff88 50%, #ffaa00 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
}

.rate-value {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
  min-width: 45px;
  text-align: right;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }
  
  .equipment-name {
    font-size: 16px;
  }
  
  .rate-value {
    font-size: 18px;
  }
  
  .rate-bar {
    height: 10px;
  }
}
</style>

