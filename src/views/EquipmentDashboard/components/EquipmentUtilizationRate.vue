<template>
  <div class="equipment-utilization-rate">
    <div class="title">关键设备稼动率(昨日)</div>
  <div class="toolbar">
    <el-select v-model="selectedWorkshop" placeholder="选择车间" size="small" @change="onWorkshopChange">
      <el-option label="冲压(CY)" value="CY"></el-option>
      <el-option label="焊接(HJ)" value="HJ"></el-option>
      <el-option label="金工二部(JG2)" value="JG2"></el-option>
      <el-option label="注塑(ZHS)" value="ZHS"></el-option>
    </el-select>
    <el-button type="link" class="toggle-list" @click="showList = !showList">{{ showList ? '隐藏机台' : '展开机台' }}</el-button>
    <el-button type="primary" class="chart-btn" @click="$emit('open-charts-dialog')">查看车间稼动率图</el-button>
  </div>
  <div class="content-area">
    <div v-if="showList" class="grid-container">
      <div v-if="!scrollData.length" class="empty">暂无数据</div>
      <div v-else v-for="(equipment, idx) in scrollData" :key="idx" class="machine-card" :class="{ 'low-rate': typeof equipment.rate !== 'number' || equipment.rate < 65 || equipment.rate > 120 }">
        <div class="mc-name" :title="equipment.name">{{ equipment.name }}</div>
        <div class="mc-rate">
          <div class="mc-rate-num">
            <span v-if="typeof equipment.rate === 'number'">{{ equipment.rate }}%</span>
            <span v-else>NA</span>
          </div>
          <div class="mc-bar">
            <div class="mc-bar-progress" :style="{ width: typeof equipment.rate === 'number' ? equipment.rate + '%' : '0%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="workshop-summary-grid">
      <div v-if="!workshopSummaries.length" class="empty">暂无数据</div>
      <div v-else v-for="ws in workshopSummaries" :key="ws.code" class="workshop-summary-card clickable" @click="$emit('open-charts-dialog', ws.code)">
        <div class="ws-top">
          <div class="ws-title">{{ ws.label }}</div>
          <div class="ws-actions">
            <el-button type="text" @click.stop="openReasonDialog(ws)">原因</el-button>
          </div>
        </div>
        <div class="ws-metrics">
          <div class="metric"><div class="label">总数</div><div class="value">{{ ws.total ?? 0 }}</div></div>
          <div class="metric"><div class="label">达标数</div><div class="value">{{ ws.meet ?? 0 }}</div></div>
          <div class="metric"><div class="label">达成率</div><div class="value">{{ ws.avg !== null ? ws.avg + '%' : '0%' }}</div></div>
        </div>
        <div class="ws-rate">
          <div class="ws-rate-bar">
            <div
              class="ws-rate-progress"
              :style="{
                width: ws.avg !== null ? ws.avg + '%' : '0%',
                background: ws.avg !== null ? (ws.avg < 65 || ws.avg > 120 ? '#ff4d4f' : ws.avg >= 65 && ws.avg < 85 ? '#ffaa00' : '#00ff88') : 'rgba(0,0,0,0.2)'
              }"
            ></div>
          </div>
          <div class="ws-rate-value">
            <span v-if="ws.avg !== null">{{ ws.avg }}%</span>
            <span v-else>NA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- 原因分析对话框（复用 EquipmentData 的 ReasonDialog） -->
  <ReasonDialog
    :visible="showReasonDialog"
    :metricInfo="reasonMetric"
    :code="reasonMetric.code"
    :showMetrics="false"
    @close="showReasonDialog = false"
    @submit="handleReasonSubmit"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { getMachineOee } from '@/api/equipment'
import ReasonDialog from '@/components/ReasonDialog.vue'
import { ElMessage } from 'element-plus'

const scrollIndex = ref(0)
let scrollTimer: number | null = null

// 使用本地请求结果，避免修改全局 store 导致其它组件联动
const rawLocal = ref<any[]>([])
const scrollData = computed(() =>
  rawLocal.value.map(item => ({
    name: item.mac_name || item.mac_no,
    rate: item.operation > 0 ? Number((item.operation * 100).toFixed(1)) : 'NA'
  }))
)

// 每个车间汇总数据
const workshopSummaries = ref<{ code: string; label: string; avg: number | null; total?: number; meet?: number }[]>([])
// 每个车间对应的原因文本
const workshopReasons = ref<Record<string, string>>({})

const showReasonDialog = ref(false)
const reasonMetric = ref({
  name: '',
  period: '昨日',
  target: 100,
  actual: 0,
  achievement: 0,
  code: ''
})

const openReasonDialog = (ws: any) => {
  reasonMetric.value.name = `${ws.label} 设备稼动率`
  reasonMetric.value.actual = ws.avg !== null ? ws.avg : 0
  reasonMetric.value.code = `WORKSHOP_${ws.code}`
  reasonMetric.value.achievement = ws.avg !== null ? Math.round(ws.avg) : 0
  showReasonDialog.value = true
}

const handleReasonSubmit = (payload: any) => {
  // 保存本地展示，并可在此处调用后端接口
  const code = reasonMetric.value.code.replace('WORKSHOP_', '')
  workshopReasons.value[code] = payload.reason || ''
  ElMessage.success('原因已保存')
  showReasonDialog.value = false
}

const workshopLabelMap: Record<string, string> = {
  CY: '冲压(CY)',
  HJ: '焊接(HJ)',
  JG2: '金工二部(JG2)',
  ZHS: '注塑(ZHS)'
}

const workshopLabel = (code: string) => workshopLabelMap[code] || code

const startScroll = () => {
  if (!scrollData.value.length) return
  scrollTimer = window.setInterval(() => {
    scrollIndex.value = (scrollIndex.value + 1) % scrollData.value.length
  }, 2000) // 每2秒滚动一次
}

onMounted(async () => {
  // 请求所有车间数据，构建汇总卡片
  const res = await getMachineOee()
  if (res && res.code === 200) {
    let groups: Record<string, any[]> = {}
    if (Array.isArray(res.data)) {
      groups = { 全部: res.data }
    } else if (res.data && typeof res.data === 'object') {
      groups = res.data as Record<string, any[]>
    }
    // 计算每个车间平均稼动率及总数/达标数
    const summaries: { code: string; label: string; avg: number | null; total: number; meet: number }[] = []
    for (const [k, arr] of Object.entries(groups)) {
      const list = Array.isArray(arr) ? arr : []
      const vals = list.map(it => (typeof it.operation === 'number' ? (it.operation > 1 ? it.operation : it.operation * 100) : NaN))
      const valid = vals.filter(v => Number.isFinite(v))
      const avg = valid.length ? Math.round(valid.reduce((s, v) => s + v, 0) / valid.length) : null
      const total = list.length
      const meet = vals.filter(v => Number.isFinite(v) && v >= 85).length
      summaries.push({ code: k, label: workshopLabel(k), avg, total, meet })
    }
    workshopSummaries.value = summaries
  } else {
    workshopSummaries.value = []
  }
  startScroll()
})

// unused helper removed (replaced by ReasonDialog submit handler)

// 选择车间相关（本组件本地请求，不改全局 store）
const selectedWorkshop = ref('CY')
const showList = ref(false)
const onWorkshopChange = async (val: string) => {
  const res = await getMachineOee(val)
  if (res && res.code === 200) {
    if (Array.isArray(res.data)) {
      rawLocal.value = res.data
    } else if (res.data && typeof res.data === 'object') {
      rawLocal.value = Array.isArray(res.data[val]) ? res.data[val] : Object.values(res.data).flat()
    } else {
      rawLocal.value = []
    }
  } else {
    rawLocal.value = []
  }
  scrollIndex.value = 0
}

onBeforeUnmount(() => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
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
.toolbar .el-button.toggle-list {
  color: #8cc8ff;
  font-size: 16px;
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

.content-area {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
  padding: 8px 4px;
  align-content: start;
  overflow: auto;
  max-height: 100%;
}

/* 车间汇总卡片样式 */
.workshop-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  padding: 8px;
}
.workshop-summary-card {
  background: rgba(0, 150, 255, 0.04);
  border: 1px solid rgba(255, 50, 50, 0.15);
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ws-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.ws-rate {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ws-rate-bar {
  flex: 1;
  height: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 6px;
  overflow: hidden;
}
.ws-rate-progress {
  height: 100%;
  width: 0%;
  transition: width 0.6s ease;
}
.ws-rate-value {
  color: #ff4d4f;
  font-weight: 700;
}
.ws-metrics {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
}
.ws-metrics .metric {
  background: rgba(0,0,0,0.08);
  padding: 6px 8px;
  border-radius: 4px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ws-metrics .label {
  color: #8cc8ff;
  font-size: 12px;
}
.ws-metrics .value {
  color: #00d4ff;
  font-weight: 700;
  font-size: 16px;
}
.ws-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ws-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.ws-actions .el-button {
  color: #8cc8ff;
}

.machine-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: rgba(0, 150, 255, 0.06);
  border: 1px solid rgba(0, 150, 255, 0.12);
  border-radius: 4px;
  height: 64px;
  min-height: 64px;
  box-sizing: border-box;
}

.mc-name {
  color: #ffffff;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mc-rate {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mc-rate-num {
  color: #00d4ff;
  font-weight: bold;
  font-size: 13px;
  width: 48px;
  text-align: right;
}

.mc-bar {
  flex: 1;
  height: 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
  overflow: hidden;
}

.mc-bar-progress {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff 0%, #00ff88 50%, #ffaa00 100%);
  transition: width 0.4s ease;
}


/* 低于阈值样式（小于85%） */
.low-rate {
  border-color: rgba(255,77,79,0.6) !important;
  box-shadow: 0 0 8px rgba(255,77,79,0.15);
}
.low-rate .mc-rate-num {
  color: #ff4d4f;
}
.low-rate .mc-bar-progress {
  background: linear-gradient(90deg, #ff4d4f 0%, #ff8a80 50%);
}
.equipment-item.low-rate .rate-value,
.equipment-item.low-rate .rate-progress {
  color: #ff4d4f;
}

.equipment-item {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  margin-bottom: 8px;
  transition: all 0.3s;
}

.equipment-item.active {
  background: rgba(0, 212, 255, 0.2);
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
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

.empty {
  color: #8cc8ff;
  text-align: center;
  padding: 16px 0;
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

