<template>
  <div class="workshop-summary">
    <div class="title">关键设备稼动率(昨日)</div>

    <div class="summary-grid">
      <div v-if="!summaries.length" class="empty">暂无数据</div>
      <div
        v-else
        v-for="ws in summaries"
        :key="ws.code"
        class="ws-card"
        @click="handleCardClick(ws)"
      >
        <div class="ws-header">
          <span class="ws-name">{{ ws.label }}</span>
          <span class="ws-target">目标 {{ ws.targetRate }}</span>
        </div>

        <div class="ws-rate-row">
          <div class="rate-bar-wrap">
            <div class="rate-bar">
              <div
                class="rate-fill"
                :style="{
                  width: ws.avg !== null ? Math.min(ws.avg, 100) + '%' : '0%',
                  background: getRateColor(ws.avg)
                }"
              ></div>
            </div>
          </div>
          <span class="rate-num" :style="{ color: getRateColor(ws.avg) }">
            {{ ws.avg !== null ? ws.avg + '%' : 'NA' }}
          </span>
        </div>

        <div class="ws-metrics">
          <div class="metric-item">
            <div class="metric-label">累计稼动率</div>
            <div class="metric-value" :style="{ color: getRateColor(ws.avg) }">
              {{ ws.avg !== null ? ws.avg + '%' : 'NA' }}
            </div>
          </div>
          <div class="metric-item">
            <div class="metric-label">达标台数</div>
            <div class="metric-value meet">{{ ws.meet }}台</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">台数达标率</div>
            <div class="metric-value" :style="{ color: getRateColor(ws.rate) }">
              {{ ws.rate }}%
            </div>
          </div>
        </div>

        <div class="ws-footer">
          <span class="equipment-count">设备数: {{ ws.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMachineOee } from '@/api/equipment'

const emit = defineEmits(['open-charts-dialog', 'open-equipment-detail'])

interface WorkshopSummary {
  code: string
  label: string
  avg: number | null
  rate: number
  total: number
  meet: number
  targetRate: string
}

const summaries = ref<WorkshopSummary[]>([])

const workshopLabelMap: Record<string, string> = {
  CY: '冲压(CY)',
  HJ: '焊接(HJ)',
  JG2: '金工二部(JG2)',
  ZHS: '注塑(ZHS)'
}

const labelToCode: Record<string, string> = {
  '金工一部冲压车间': 'CY',
  '金工一部焊接车间': 'HJ',
  '金工二部': 'JG2',
  '注塑车间': 'ZHS'
}

const getRateColor = (rate: number | null): string => {
  if (rate === null) return '#8cc8ff'
  if (rate >= 85) return '#00ff88'
  if (rate >= 70) return '#ffcc00'
  return '#ff4d4f'
}

const handleCardClick = (ws: WorkshopSummary) => {
  emit('open-charts-dialog', ws.code)
}

onMounted(async () => {
  const res = await getMachineOee()
  if (res && res.code === 200 && Array.isArray(res.data)) {
    summaries.value = res.data.map((wc: any) => {
      const code = labelToCode[wc.work_center] || wc.work_center
      // all_operation 已是小数形式（如 0.5260），转为百分比整数
      const avg = typeof wc.all_operation === 'number' && wc.all_operation > 0
        ? Math.round(wc.all_operation * 100)
        : null
      // operation_rate 已是达标率小数（如 0.6188），转为百分比整数
      const rate = typeof wc.operation_rate === 'number'
        ? Math.round(wc.operation_rate * 100)
        : 0
      return {
        code,
        label: workshopLabelMap[code] || wc.work_center,
        avg,           // 累计稼动率
        rate,          // 台数达标率
        total: wc.total_count,
        meet: wc.complete_count,
        targetRate: wc.target_operation
      }
    })
  }
})
</script>

<style scoped>
.workshop-summary {
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.summary-grid::-webkit-scrollbar {
  width: 4px;
}

.summary-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.summary-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
}

.ws-card {
  background: rgba(0, 150, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 6px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ws-card:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.15);
}

.ws-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ws-name {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.ws-target {
  color: #8cc8ff;
  font-size: 10px;
  background: rgba(0, 212, 255, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.ws-rate-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rate-bar-wrap {
  flex: 1;
}

.rate-bar {
  height: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.6s ease;
}

.rate-num {
  font-size: 16px;
  font-weight: bold;
  min-width: 52px;
  text-align: right;
}

.ws-metrics {
  display: flex;
  gap: 8px;
}

.metric-item {
  flex: 1;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.metric-label {
  color: #8cc8ff;
  font-size: 11px;
  text-align: center;
}

.metric-value {
  color: #00d4ff;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
}

.metric-value.meet {
  color: #00ff88;
}

.ws-footer {
  display: flex;
  justify-content: flex-end;
}

.equipment-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.empty {
  color: #8cc8ff;
  text-align: center;
  padding: 30px;
  grid-column: 1 / -1;
}

@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }

  .ws-name {
    font-size: 17px;
  }

  .metric-label {
    font-size: 12px;
  }

  .metric-value {
    font-size: 15px;
  }
}
</style>
