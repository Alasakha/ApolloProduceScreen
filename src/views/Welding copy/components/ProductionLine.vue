<template>
  <div class="production-line">
    <!-- 循环渲染各个部分（车架/后叉/尾架/脚撑） -->
    <div 
      v-for="section in sections" 
      :key="section"
      class="section-container"
    >
      <div class="section-header">
        <span class="section-title">{{ section }}：</span>
        <div class="order-info">
          <span>客户单号、车型/规格、计划数</span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-title">
          {{ type === 'matsushita' ? '自动填进度数' : '完成进度数' }}（手工2小时录1次）+百分比
        </div>
        <el-progress :percentage="50" :show-text="true" />
      </div>

      <!-- 工位信息（仅松下自动焊显示） -->
      <template v-if="showStations">
        <div class="stations-container">
          <div 
            v-for="station in 4" 
            :key="station"
            class="station-item"
          >
            <div class="station-title">{{ station }}号站节拍量</div>
            <div class="station-progress">
              <span>进度：{{ stationProgress[station-1] }}%</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 合格率信息（仅手工焊显示） -->
      <template v-if="showQualityRate">
        <div class="quality-info">
          <div class="rate-item">
            <span>合格率：{{ qualityRate }}%</span>
          </div>
          <div class="rate-item">
            <span>TOP前三问题占比</span>
          </div>
        </div>
      </template>

      <!-- 补料信息 -->
      <div class="supply-info">
        已补料：? 件（此处可以手工录入，每2小时录1次）
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['matsushita', 'old', 'manual'].includes(value)
  },
  sections: {
    type: Array,
    required: true
  },
  showStations: {
    type: Boolean,
    default: false
  },
  showQualityRate: {
    type: Boolean,
    default: false
  }
})

const stationProgress = ref([75, 80, 85, 90])
const qualityRate = ref(98)

// TODO: 添加数据获取和更新方法
</script>

<style scoped>
.production-line {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.section-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #fff;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
}

.order-info {
  font-size: 14px;
  opacity: 0.8;
}

.progress-bar {
  margin-bottom: 15px;
}

.progress-title {
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
}

.stations-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.station-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  color: #fff;
}

.station-title {
  font-size: 12px;
  margin-bottom: 5px;
  text-align: center;
}

.station-progress {
  font-size: 14px;
  text-align: center;
  color: #00ff00;
}

.quality-info {
  margin-bottom: 15px;
  color: #fff;
}

.rate-item {
  font-size: 14px;
  margin-bottom: 5px;
}

.supply-info {
  color: #fff;
  font-size: 14px;
  opacity: 0.8;
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-progress-bar__inner) {
  background-color: #00ff00 !important;
}

:deep(.el-progress__text) {
  color: #fff !important;
}
</style> 