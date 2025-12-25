<template>
  <div class="oee-monitor">
    <div class="title">关键设备OEE监控</div>
    <div class="monitor-list">
      <div v-if="!workshopStats.length" class="empty">暂无数据</div>
      <div v-for="(stat, idx) in workshopStats" :key="idx" class="workshop-row">
        <div class="workshop-name">
          {{
            {
              CY: '冲压车间',
              HJ: '焊接车间',
              JG2: '金工二部车间',
              ZHS: '注塑车间'
            }[stat.name] || stat.name
          }}
        </div>
        <div class="workshop-total">总数: <strong>{{ stat.total }}</strong></div>
        <div class="workshop-meet">达标数: <strong>{{ stat.meet }}</strong></div>
        <div class="workshop-rate" :class="{ low: stat.rate < threshold }">达成率:{{ stat.rate }}%</div>
        <el-button type="text" class="reason-btn" @click="openReason(stat)">原因</el-button>
      </div>
    </div>
    <ReasonDialog
      :visible="showReasonDialog"
      :metricInfo="reasonMetric"
      :code="reasonMetric.code"
      :showMetrics="false"
      @close="showReasonDialog = false"
      @submit="handleReasonSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMachineOee } from '@/api/equipment'
import ReasonDialog from '@/components/ReasonDialog.vue'
import { ElMessage } from 'element-plus'

const workshopStats = ref<{ name: string; total: number; meet: number; rate: number; data: any[] }[]>([])
const threshold = 85

const showReasonDialog = ref(false)
const reasonMetric = ref({ name: '', period: '昨日', target: 0, actual: 0, achievement: 0, code: '' })

const loadStats = async () => {
  const res = await getMachineOee()
  const groups: Record<string, any[]> = {}
  if (res && res.code === 200) {
    if (Array.isArray(res.data)) {
      groups['全部'] = res.data
    } else if (res.data && typeof res.data === 'object') {
      Object.assign(groups, res.data)
    }
  }
  const stats: any[] = []
  for (const [key, arr] of Object.entries(groups)) {
    const list = Array.isArray(arr) ? arr : []
    const total = list.length
    let meet = 0
    for (const it of list) {
      const raw = typeof it.oee === 'number' ? it.oee : NaN
      const v = Number.isFinite(raw) ? (raw > 1 ? raw : raw * 100) : NaN
      if (Number.isFinite(v) && v >= threshold) {
        meet++
      }
      // NA (非数字) 视为不达标
    }
    const rate = total ? Math.round((meet / total) * 100) : 0
    stats.push({ name: key, total, meet, rate, data: list })
  }
  workshopStats.value = stats
}

const openReason = (stat: any) => {
  reasonMetric.value.name = `${stat.name} OEE 达成情况`
  reasonMetric.value.actual = stat.rate
  reasonMetric.value.target = threshold
  reasonMetric.value.achievement = stat.rate
  reasonMetric.value.code = `OEE_${stat.name}`
  showReasonDialog.value = true
}

const handleReasonSubmit = (payload: any) => {
  console.log('OEE 原因提交:', payload)
  ElMessage.success('原因分析已提交')
  showReasonDialog.value = false
}

onMounted(async () => {
  await loadStats()
})
</script>

<style scoped>
.oee-monitor {
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

.monitor-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  overflow: auto;
}

.workshop-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(0, 150, 255, 0.06);
  border: 1px solid rgba(0, 150, 255, 0.12);
  border-radius: 4px;
}
.workshop-name {
  color: #ffffff;
  font-weight: 600;
  min-width: 120px;
}
.workshop-total, .workshop-meet {
  color: #8cc8ff;
}
.workshop-rate {
  color: #00d4ff;
  font-weight: bold;
}
.workshop-rate.low {
  color: #ff4d4f;
}
.reason-btn {
  margin-left: auto;
  color: #8cc8ff;
}
.empty {
  color: #8cc8ff;
  text-align: center;
  padding: 12px 0;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title { font-size: 20px; }
  .workshop-name { font-size: 16px; }
  .workshop-rate { font-size: 16px; }
}
</style>


