<template>
  <div class="quality-monitor">
    <div class="header-row">
      <div class="section-title">质量数据监控</div>
      <button class="detail-btn" @click="handleDetailClick">点击看明细</button>
    </div>
    <div class="quality-content">
      <div class="data-row">
        <div class="data-item">
          <span class="data-label">当月度总检验批次</span>
          <span class="data-value">{{ monthlyData.totalBatches }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">合格批次</span>
          <span class="data-value">{{ monthlyData.qualifiedBatches }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">合格率</span>
          <span class="data-value highlight">{{ monthlyData.qualifiedRate }}%</span>
        </div>
      </div>
      <div class="data-row">
        <div class="data-item">
          <span class="data-label">今日检验批次</span>
          <span class="data-value">{{ todayData.totalBatches }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">合格批次</span>
          <span class="data-value">{{ todayData.qualifiedBatches }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">合格率</span>
          <span class="data-value highlight">{{ todayData.qualifiedRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getCyQualityPici } from '@/api/getStampWeldinfo'

const monthlyData = ref({
  totalBatches: 0,
  qualifiedBatches: 0,
  qualifiedRate: 0
})

const todayData = ref({
  totalBatches: 0,
  qualifiedBatches: 0,
  qualifiedRate: 0
})

const fetchData = async () => {
  try {
    const res = await getCyQualityPici()
    if (res.code === 200) {
      // 处理月度数据
      const monthData = res.data.monthData
      const monthTotal = monthData.total || 0
      const monthHg = monthData.hg || 0
      // 如果 rate 存在且不为 null，使用 rate（假设是百分比 0-100）；否则根据 hg/total 计算
      const monthRate = monthData.rate !== null && monthData.rate !== undefined
        ? Math.round(monthData.rate * 100) / 100
        : (monthTotal > 0 ? Math.round((monthHg / monthTotal) * 100 * 100) / 100 : 0)

      monthlyData.value = {
        totalBatches: monthTotal,
        qualifiedBatches: monthHg,
        qualifiedRate: monthRate
      }

      // 处理今日数据（dayData是单个对象）
      const dayDataObj = res.data.dayData
      if (dayDataObj) {
        const todayTotal = dayDataObj.total || 0
        const todayHg = dayDataObj.hg || 0
        // 使用 dayData.rate（假设已是百分比0-100），否则手动计算
        const todayRate = dayDataObj.rate !== null && dayDataObj.rate !== undefined
          ? Math.round(dayDataObj.rate * 100) / 100
          : (todayTotal > 0 ? Math.round((todayHg / todayTotal) * 100 * 100) / 100 : 0)

        todayData.value = {
          totalBatches: todayTotal,
          qualifiedBatches: todayHg,
          qualifiedRate: todayRate
        }
      } else {
        todayData.value = {
          totalBatches: 0,
          qualifiedBatches: 0,
          qualifiedRate: 0
        }
      }
    }
  } catch (error) {
    console.error('获取质量数据失败:', error)
  }
}

const handleDetailClick = () => {
  // TODO: 打开详情弹窗
  console.log('查看质量明细')
}

onMounted(() => {
  fetchData()
  eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.quality-monitor {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 6px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.section-title {
  color: #00d4ff;
  font-size: 13px;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.quality-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
}

.data-item {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.data-label {
  color: #8cc8ff;
  font-size: 10px;
  white-space: nowrap;
}

.data-value {
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}

.data-value.highlight {
  color: #00d4ff;
  font-size: 12px;
}

.detail-btn {
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.5);
  color: #ffc107;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.detail-btn:hover {
  background: rgba(255, 193, 7, 0.3);
  border-color: rgba(255, 193, 7, 0.8);
  color: #ffd54f;
}
</style>

