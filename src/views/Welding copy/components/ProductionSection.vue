<template>
  <div class="production-section">
    <div class="section-header">
      <h3>{{ title }}</h3>
      <div class="progress-info">
        <span>自动填进度数+百分比</span>
      </div>
    </div>
    
    <div class="stations-container">
      <div 
        v-for="station in 4" 
        :key="station"
        class="station-item"
      >
        <div class="station-header">
          {{ station }}号站节拍量
        </div>
        <div class="station-content">
          <div class="completion-rate">
            完成进度数（手工/小时录入）+百分比
          </div>
          <div class="stats">
            <div>合格率：{{ stationStats[station-1].qualifiedRate }}%</div>
            <div>TOP前三问题占比</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-footer">
      已补料：? 件（此处可以手工录入，每2小时录1次）
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const stationStats = ref([
  { qualifiedRate: 98 },
  { qualifiedRate: 97 },
  { qualifiedRate: 99 },
  { qualifiedRate: 96 }
])

// TODO: 添加获取数据的方法
</script>

<style scoped>
.production-section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  color: #fff;
  margin: 0;
}

.stations-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.station-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px;
}

.station-header {
  color: #fff;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
}

.station-content {
  color: #fff;
}

.completion-rate {
  margin-bottom: 10px;
  font-size: 12px;
}

.stats {
  font-size: 12px;
}

.section-footer {
  color: #fff;
  font-size: 14px;
}
</style> 