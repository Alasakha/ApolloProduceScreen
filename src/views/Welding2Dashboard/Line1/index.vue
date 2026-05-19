<template>
  <div class="line1-container">
    <div class="line1-grid">
      <!-- 第一行：生产达成 + 人效 + 工单结单 + 直通率 -->

      <!-- 1. 生产达成 -->
      <div class="panel">
        <div class="panel-header"><span>生产达成</span></div>
        <div class="panel-content">
          <div class="sub-section">
            <div class="sub-title">月度</div>
            <div class="data-row">
              <div class="data-item"><span class="label">计划</span><span class="value">{{ productionData.monthPlan }}</span></div>
              <div class="data-item"><span class="label">完成</span><span class="value">{{ productionData.monthDone }}</span></div>
              <div class="data-item"><span class="label">达成</span><span class="value highlight">{{ productionData.monthRate }}%</span></div>
            </div>
          </div>
          <div class="sub-section">
            <div class="sub-title">今日</div>
            <div class="data-row">
              <div class="data-item"><span class="label">计划</span><span class="value">{{ productionData.todayPlan }}</span></div>
              <div class="data-item"><span class="label">完成</span><span class="value">{{ productionData.todayDone }}</span></div>
              <div class="data-item"><span class="label">达成</span><span class="value highlight">{{ productionData.todayRate }}%</span></div>
            </div>
          </div>

        </div>
      </div>

      <!-- 2. 人效 -->
      <div class="panel">
        <div class="panel-header"><span>人效</span></div>
        <div v-if="isLoading" class="panel-content center">
          <span style="color:#88ccff">加载中...</span>
        </div>
        <div v-else class="panel-content efficiency-charts">
          <div class="efficiency-row">
            <div class="gauge-wrap" ref="Indicators1"></div>
            <div class="gauge-wrap" ref="Indicators2" @click="openAttendanceDialog"></div>
          </div>
          <div class="efficiency-row">
            <div class="gauge-wrap" ref="Indicators3" @click="openTimeDialog(1)"></div>
            <div class="gauge-wrap" ref="Indicators4" @click="openTimeDialog(2)"></div>
          </div>
          <div class="efficiency-row">
            <div class="gauge-wrap" ref="Indicators5"></div>
            <div class="gauge-wrap" ref="Indicators6" @click="openReasonDialog">
              <span v-if="showWarning" class="warning-icon" title="实际人效低于标准人效" @click.stop="openReasonDialog">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFA000"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 工单结单 -->
      <div class="panel">
        <div class="panel-header"><span>工单结单</span></div>
        <div class="panel-content">
          <div class="sub-section">
            <div class="sub-title">月度</div>
            <div class="data-item center"><span class="label">结单率</span><span class="value highlight large">{{ workOrder.monthRate }}%</span></div>
          </div>
          <div class="sub-section">
            <div class="data-row">
              <div class="data-item"><span class="label">A排产</span><span class="value">{{ workOrder.aMonth.plan }}</span></div>
              <div class="data-item"><span class="label">A准交</span><span class="value">{{ workOrder.aMonth.onTime }}</span></div>
              <div class="data-item"><span class="label">A率</span><span class="value highlight">{{ workOrder.aMonth.rate }}%</span></div>
            </div>
          </div>
          <div class="sub-section">
            <div class="data-row">
              <div class="data-item"><span class="label">常排产</span><span class="value">{{ workOrder.normalMonth.plan }}</span></div>
              <div class="data-item"><span class="label">常准交</span><span class="value">{{ workOrder.normalMonth.onTime }}</span></div>
              <div class="data-item"><span class="label">常率</span><span class="value highlight">{{ workOrder.normalMonth.rate }}%</span></div>
            </div>
          </div>
          <div class="sub-section">
            <div class="data-row">
              <div class="data-item"><span class="label">今日A</span><span class="value">{{ workOrder.aToday.plan }}/{{ workOrder.aToday.onTime }}</span></div>
              <div class="data-item"><span class="label">今日常</span><span class="value">{{ workOrder.normalToday.plan }}/{{ workOrder.normalToday.onTime }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 直通率 -->
      <div class="panel">
        <div class="panel-header"><span>直通率</span></div>
        <div class="panel-content">
          <div class="sub-section">
            <div class="sub-title">A类</div>
            <div class="data-row">
              <div class="data-item"><span class="label">月检验</span><span class="value">{{ throughput.aMonth.inspect }}</span></div>
              <div class="data-item"><span class="label">月合格</span><span class="value">{{ throughput.aMonth.qualified }}</span></div>
              <div class="data-item"><span class="label">直通</span><span class="value highlight">{{ throughput.aMonth.rate }}%</span></div>
            </div>
          </div>
          <div class="sub-section">
            <div class="sub-title">A今日</div>
            <div class="data-row">
              <div class="data-item"><span class="label">检验</span><span class="value">{{ throughput.aToday.inspect }}</span></div>
              <div class="data-item"><span class="label">合格</span><span class="value">{{ throughput.aToday.qualified }}</span></div>
              <div class="data-item"><span class="label">直通</span><span class="value highlight">{{ throughput.aToday.rate }}%</span></div>
            </div>
          </div>
          <div class="sub-section">
            <div class="sub-title">常规</div>
            <div class="data-row">
              <div class="data-item"><span class="label">月检验</span><span class="value">{{ throughput.normalMonth.inspect }}</span></div>
              <div class="data-item"><span class="label">月合格</span><span class="value">{{ throughput.normalMonth.qualified }}</span></div>
              <div class="data-item"><span class="label">直通</span><span class="value highlight">{{ throughput.normalMonth.rate }}%</span></div>
            </div>
          </div>
          <div class="sub-section">
            <div class="sub-title">常规今日</div>
            <div class="data-row">
              <div class="data-item"><span class="label">检验</span><span class="value">{{ throughput.normalToday.inspect }}</span></div>
              <div class="data-item"><span class="label">合格</span><span class="value">{{ throughput.normalToday.qualified }}</span></div>
              <div class="data-item"><span class="label">直通</span><span class="value highlight">{{ throughput.normalToday.rate }}%</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行：设备稼动 + TOP质量问题（各占2列） -->

      <!-- 5. 设备稼动 -->
      <div class="panel span-2" @click="showEquipmentDetail = true">
        <div class="panel-header clickable"><span>设备稼动</span><span class="click-hint">点击查看详情</span></div>
        <div class="panel-content horizontal">
          <div class="equipment-grid">
            <div class="equipment-item"><span class="equipment-label">总数</span><span class="equipment-value">{{ equipment.total }}</span></div>
            <div class="equipment-item running"><span class="equipment-label">开机</span><span class="equipment-value">{{ equipment.running }}</span></div>
            <div class="equipment-item fault"><span class="equipment-label">故障</span><span class="equipment-value">{{ equipment.fault }}</span></div>
            <div class="equipment-item adjusting"><span class="equipment-label">调机</span><span class="equipment-value">{{ equipment.adjusting }}</span></div>
            <div class="equipment-item standby"><span class="equipment-label">待机</span><span class="equipment-value">{{ equipment.standby }}</span></div>
          </div>
          <div class="equipment-time">
            <div class="time-item"><span class="label">应开机</span><span class="value">{{ equipment.planHours }}h</span></div>
            <div class="time-item"><span class="label">实际开机</span><span class="value">{{ equipment.actualHours }}h</span></div>
            <div class="time-item"><span class="label">目标</span><span class="value highlight">{{ equipment.targetRate }}%</span></div>
            <div class="time-item"><span class="label">实际</span><span class="value highlight">{{ equipment.actualRate }}%</span></div>
          </div>
        </div>
      </div>

      <!-- 6. TOP质量问题 -->
      <div class="panel span-2">
        <div class="panel-header"><span>涂装TOP质量问题</span></div>
        <div class="panel-content quality-content">
          <div class="pie-chart-container">
            <div class="pie-chart" :style="{ background: pieGradient }"></div>
            <div v-if="qualityIssues.length === 0" class="no-data-tip">暂无数据</div>
            <div v-else class="pie-legend">
              <div class="legend-item" v-for="item in qualityIssues" :key="item.name">
                <span class="legend-color" :style="{ background: item.color }"></span>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设备详情弹窗 -->
    <div v-if="showEquipmentDetail" class="detail-modal" @click.self="showEquipmentDetail = false">
      <div class="detail-modal-content">
        <div class="detail-header">
          <h3>设备稼动明细</h3>
          <button class="close-btn" @click="showEquipmentDetail = false">×</button>
        </div>
        <div class="detail-body">
          <table class="detail-table">
            <thead><tr><th>设备编号</th><th>设备名称</th><th>状态</th><th>今日稼动时长</th></tr></thead>
            <tbody>
              <tr v-for="item in equipmentDetailList" :key="item.id">
                <td>{{ item.code }}</td><td>{{ item.name }}</td>
                <td :class="'status-' + item.status">{{ item.statusText }}</td>
                <td>{{ item.hours }}h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 实际人效原因弹窗 -->
    <el-dialog v-model="reasonDialogVisible" title="实际人效原因说明" width="400px" :close-on-click-modal="false">
      <div class="mb-2" style="color:#e03030;font-weight:bold;">
        当前原因：{{ EfficentData.reason || '暂无原因' }}
      </div>
      <el-input v-model="customReason" type="textarea" :rows="3" placeholder="请填写具体原因（可选）" />
      <template #footer>
        <el-button @click="reasonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReason">确定</el-button>
      </template>
    </el-dialog>

    <!-- 时间详情弹窗（换型/计划外） -->
    <TimeDetailDialog
      v-model="timeDialogVisible"
      :time-type="currentTimeType"
      :data="EfficentData"
      :prod-line="ProductionLine"
      @close="handleTimeDialogClose"
      @save="handleTimeDialogSave"
    />

    <!-- 出勤人员弹窗 -->
    <el-dialog v-model="attendanceDialogVisible" title="出勤人员信息" width="70%">
      <div v-if="attendanceLoading" class="text-center py-8" style="color:#88ccff">
        <dv-loading>加载中...</dv-loading>
      </div>
      <div v-else-if="attendanceData.length === 0" class="text-center py-8" style="color:#88ccff">
        暂无出勤人员数据
      </div>
      <div v-else class="attendance-list">
        <div class="attendance-header mb-4 p-3 rounded" style="background:rgba(0,50,100,0.3);color:#00d4ff;">
          <span style="font-weight:bold;">生产线：{{ ProductionLine }}</span>
          <span style="margin-left:20px;font-weight:bold;">出勤人数：{{ attendanceData.length }}人</span>
        </div>
        <div class="attendance-grid">
          <div v-for="(member, index) in attendanceData" :key="index" class="attendance-item p-3 border rounded text-center" style="border-color:rgba(0,150,255,0.3);background:rgba(0,30,60,0.6);">
            <div class="avatar">{{ member.name ? member.name.charAt(0) : '?' }}</div>
            <div style="color:#fff;margin-top:6px;">{{ member.name || '未知姓名' }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getMonthTotalInfo, getEfficiencyToday, getEfficiencyBelowAdd, getSignInMember } from '@/api/getProduceinfo'
import { getOrderSettlement, getPassRate } from '@/api/getMesInfo'
import { getTodayProduction, getTodayBadIssues } from '@/api/getStampWeldinfo'
import { getMachineOee } from '@/api/equipment'
import { createGaugeOption } from '@/views/Screen/views/Line2/views/gaugeChart'
import TimeDetailDialog from '@/views/Screen/components/TimeDetailDialog.vue'
import * as echarts from 'echarts'

const ProductionLine = ref('2007')
const showEquipmentDetail = ref(false)

// 生产达成
const productionData = ref({ monthPlan: 0, monthDone: 0, monthRate: 0, todayPlan: 0, todayDone: 0, todayRate: 0 })

// 工单结单
const workOrder = ref({
  monthRate: 0,
  aMonth: { plan: 0, onTime: 0, rate: 0 },
  normalMonth: { plan: 0, onTime: 0, rate: 0 },
  aToday: { plan: 0, onTime: 0 },
  normalToday: { plan: 0, onTime: 0 }
})

// 直通率
const throughput = ref({
  aMonth: { inspect: 0, qualified: 0, rate: 0 },
  aToday: { inspect: 0, qualified: 0, rate: 0 },
  normalMonth: { inspect: 0, qualified: 0, rate: 0 },
  normalToday: { inspect: 0, qualified: 0, rate: 0 }
})

// 设备
const equipment = ref({ total: 0, running: 0, fault: 0, adjusting: 0, standby: 0, planHours: 0, actualHours: 0, targetRate: 0, actualRate: 0 })
const equipmentDetailList = ref<any[]>([])
const qualityIssues = ref<{ name: string; value: number; color: string; total: number }[]>([])

const pieGradient = computed(() => {
  const items = qualityIssues.value
  if (!items.length) return 'conic-gradient(#333 0deg 360deg)'
  const total = items.reduce((s, i) => s + (i.value || 0), 0)
  if (total === 0) return 'conic-gradient(#333 0deg 360deg)'
  let deg = 0
  const parts = items.map(i => {
    const pct = (i.value / total) * 100
    const from = deg
    deg += pct
    const to = deg
    return `${i.color} ${from}deg ${to}deg`
  })
  return 'conic-gradient(' + parts.join(', ') + ')'
})

// 人效数据（与 efficiency.vue 一致）
const EfficentData = reactive({
  standardEfficiency: null as number | null,
  efficiency: null as number | null,
  total: null as number | null,
  clTotal: null as number | null,
  scanNum: null as number | null,
  stanardNum: null as number | null,
  warning: 0,
  reason: '',
  reduceMinute_hx: 0,
  reduceMinute_jhw: 0,
  reduceMinute_hx_reason: [] as any[],
  reduceMinute_jhw_reason: [] as any[],
})

const isLoading = ref(true)
const showWarning = computed(() => EfficentData.warning === 1)

// Chart refs
const Indicators1 = ref(null)
const Indicators2 = ref(null)
const Indicators3 = ref(null)
const Indicators4 = ref(null)
const Indicators5 = ref(null)
const Indicators6 = ref(null)

// Chart instances
let chartInstances: Record<string, echarts.ECharts | null> = {
  i1: null, i2: null, i3: null, i4: null, i5: null, i6: null
}

function initChart(refEl: any, key: string) {
  if (!refEl || chartInstances[key]) return
  const instance = echarts.init(refEl)
  chartInstances[key] = instance
  window.addEventListener('resize', () => instance.resize())
}

function drawCharts() {
  const stanardNum = EfficentData.stanardNum || 0
  const scanNum = EfficentData.scanNum || 0
  const hx = EfficentData.reduceMinute_hx || 0
  const jhw = EfficentData.reduceMinute_jhw || 0
  const standard = EfficentData.standardEfficiency || 0
  const actual = EfficentData.efficiency || 0

  const options: Record<string, any> = {
    i1: createGaugeOption({ text: '配置人数', data: stanardNum, max: stanardNum || 1 }),
    i2: createGaugeOption({ text: '出勤人数', data: scanNum, max: stanardNum || 1 }),
    i3: createGaugeOption({ text: '换型换线工时', data: hx, max: Math.max(hx * 1.5, 60) || 60 }),
    i4: createGaugeOption({ text: '计划外工时', data: jhw, max: Math.max(jhw * 1.5, 60) || 60 }),
    i5: createGaugeOption({ text: '标准人效', data: standard, max: Math.max(standard, actual) * 1.2 || 100 }),
    i6: createGaugeOption({ text: '实际人效', data: actual, max: Math.max(standard, actual) * 1.2 || 100 }),
  }

  const keys = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6']
  const refs = [Indicators1, Indicators2, Indicators3, Indicators4, Indicators5, Indicators6]
  keys.forEach((k, i) => {
    if (refs[i].value && options[k]) {
      if (!chartInstances[k]) initChart(refs[i].value, k)
      chartInstances[k]?.setOption(options[k])
    }
  })
}

// 弹窗相关
const timeDialogVisible = ref(false)
const currentTimeType = ref(1)
const reasonDialogVisible = ref(false)
const customReason = ref('')
const attendanceDialogVisible = ref(false)
const attendanceLoading = ref(false)
const attendanceData = ref<{ name: string }[]>([])

function openTimeDialog(type: number) {
  currentTimeType.value = type
  timeDialogVisible.value = true
}

function handleTimeDialogClose() {
  timeDialogVisible.value = false
}

function handleTimeDialogSave() {
  timeDialogVisible.value = false
  fetchData()
}

function openReasonDialog() {
  reasonDialogVisible.value = true
  customReason.value = ''
}

async function submitReason() {
  await getEfficiencyBelowAdd(ProductionLine.value, customReason.value)
  reasonDialogVisible.value = false
  fetchData()
}

async function openAttendanceDialog() {
  attendanceDialogVisible.value = true
  attendanceLoading.value = true
  try {
    const res = await getSignInMember(ProductionLine.value)
    attendanceData.value = (res.data || []).map((name: string) => ({ name }))
  } catch {
    attendanceData.value = []
  } finally {
    attendanceLoading.value = false
  }
}

const fetchWorkOrder = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const dateStop = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const dateStart = `${now.getFullYear()}${pad(now.getMonth() + 1)}01`
  getOrderSettlement('金工二部焊接', dateStart, dateStop).then(res => {
    const list: any[] = res.data?.orderSettlement || []
    const todayStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`

    const monthA = list.filter((i: any) => i.customer === 'A')
    const monthNormal = list.filter((i: any) => i.customer === '常规')
    const todayA = monthA.filter((i: any) => i.dateTime === todayStr)
    const todayNormal = monthNormal.filter((i: any) => i.dateTime === todayStr)

    const sum = (arr: any[], f: string) => arr.reduce((acc: number, i: any) => acc + (Number(i[f]) || 0), 0)
    const aPlan = sum(monthA, 'productionQuantity')
    const aOnTime = sum(monthA, 'inboundQuantity')
    const nPlan = sum(monthNormal, 'productionQuantity')
    const nOnTime = sum(monthNormal, 'inboundQuantity')

    workOrder.value.aMonth = {
      plan: aPlan,
      onTime: aOnTime,
      rate: aPlan > 0 ? Math.round((aOnTime / aPlan) * 100) : 0
    }
    workOrder.value.normalMonth = {
      plan: nPlan,
      onTime: nOnTime,
      rate: nPlan > 0 ? Math.round((nOnTime / nPlan) * 100) : 0
    }
    const totalPlan = aPlan + nPlan
    const totalOnTime = aOnTime + nOnTime
    workOrder.value.monthRate = totalPlan > 0 ? Math.round((totalOnTime / totalPlan) * 100) : 0
    workOrder.value.aToday = {
      plan: sum(todayA, 'productionQuantity'),
      onTime: sum(todayA, 'inboundQuantity')
    }
    workOrder.value.normalToday = {
      plan: sum(todayNormal, 'productionQuantity'),
      onTime: sum(todayNormal, 'inboundQuantity')
    }
  })
}

const fetchEquipment = () => {
  getMachineOee('JG2').then((res: any) => {
    if (res && res.code === 200 && Array.isArray(res.data)) {
      const list = res.data.flatMap((ws: any) => ws.machineOeeList || [])
      const running = list.filter((i: any) => typeof i.operation === 'number' && i.operation > 0).length
      const fault = list.filter((i: any) => i.output === 0 && i.operation === 0).length
      const total = list.length
      const vals = list.map((i: any) => typeof i.operation === 'number' ? (i.operation > 1 ? i.operation : i.operation * 100) : NaN).filter((v: any) => Number.isFinite(v))
      const avgOp = vals.length ? vals.reduce((s: number, v: number) => s + v, 0) / vals.length : 0
      equipment.value = {
        total,
        running,
        fault,
        adjusting: 0,
        standby: total - running - fault,
        planHours: 0,
        actualHours: 0,
        targetRate: 85,
        actualRate: Math.round(avgOp)
      }
      equipmentDetailList.value = list.map((i: any) => ({
        id: i.mac_no,
        code: i.mac_no,
        name: i.mac_name || i.mac_no,
        status: i.operation > 0 ? 'running' : 'standby',
        statusText: i.operation > 0 ? '运行中' : '待机',
        hours: typeof i.operation === 'number' ? i.operation.toFixed(1) : '0'
      }))
    }
  })
}

const fetchQualityIssues = () => {
  getTodayBadIssues(ProductionLine.value).then((res: any) => {
    const list: { ngName: string; total: number }[] = res.data || []
    if (list.length === 0) return
    const grandTotal = list.reduce((s, i) => s + (i.total || 0), 0)
    const defaultColors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9f43', '#ee5a24']
    qualityIssues.value = list.slice(0, 6).map((item, idx) => ({
      name: item.ngName || '未知',
      total: item.total || 0,
      value: grandTotal > 0 ? Math.round((item.total / grandTotal) * 100) : 0,
      color: defaultColors[idx] || '#888888'
    }))
  })
}

const fetchThroughput = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const dayEnd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const dayStart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`

  getPassRate("2003", dayStart, dayEnd).then(res => {
    const data = res.data
    const hjA = data?.hjPassRate_a || []
    const hjNormal = data?.hjPassRate_normal || []

    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

    // A类月合计
    const aInspect = hjA.reduce((s: number, i: any) => s + (i.cjTotal || 0), 0)
    const aQualified = hjA.reduce((s: number, i: any) => s + (i.cjHg || 0), 0)
    // A类今日
    const aTodayItem = hjA.find((i: any) => i.inspectionDate === todayStr) || {}
    const aTodayInspect = aTodayItem.cjTotal || 0
    const aTodayQualified = aTodayItem.cjHg || 0

    // 常规月合计
    const nInspect = hjNormal.reduce((s: number, i: any) => s + (i.cjTotal || 0), 0)
    const nQualified = hjNormal.reduce((s: number, i: any) => s + (i.cjHg || 0), 0)
    // 常规今日
    const nTodayItem = hjNormal.find((i: any) => i.inspectionDate === todayStr) || {}
    const nTodayInspect = nTodayItem.cjTotal || 0
    const nTodayQualified = nTodayItem.cjHg || 0

    const rate = (hg: number, total: number) => total > 0 ? Math.round((hg / total) * 100) : 0

    throughput.value = {
      aMonth: { inspect: aInspect, qualified: aQualified, rate: rate(aQualified, aInspect) },
      aToday: { inspect: aTodayInspect, qualified: aTodayQualified, rate: rate(aTodayQualified, aTodayInspect) },
      normalMonth: { inspect: nInspect, qualified: nQualified, rate: rate(nQualified, nInspect) },
      normalToday: { inspect: nTodayInspect, qualified: nTodayQualified, rate: rate(nTodayQualified, nTodayInspect) }
    }
  })
}

const fetchData = async () => {
  const res = await getEfficiencyToday(ProductionLine.value)
  const data = res.data
  EfficentData.standardEfficiency = Number(data.standardEfficiency) || 0
  EfficentData.efficiency = Number(data.efficiency) || 0
  EfficentData.total = data.total ?? 0
  EfficentData.clTotal = data.clTotal ?? 0
  EfficentData.scanNum = Number(data.scanNum) ?? 0
  EfficentData.stanardNum = Number(data.stanardNum) ?? 0
  EfficentData.warning = data.warning ?? 0
  EfficentData.reason = data.reason || ''
  EfficentData.reduceMinute_hx = Number(data.reduceMinute_hx) ?? 0
  EfficentData.reduceMinute_jhw = Number(data.reduceMinute_jhw) ?? 0
  EfficentData.reduceMinute_hx_reason = data.reduceMinute_hx_reason || []
  EfficentData.reduceMinute_jhw_reason = data.reduceMinute_jhw_reason || []
  isLoading.value = false

  nextTick(() => {
    const refs = [Indicators1, Indicators2, Indicators3, Indicators4, Indicators5, Indicators6]
    const keys = ['i1', 'i2', 'i3', 'i4', 'i5', 'i6']
    keys.forEach((k, i) => {
      if (!refs[i].value) return
      if (!chartInstances[k]) initChart(refs[i].value, k)
    })
    drawCharts()
  })
}

const getData = () => {
  getMonthTotalInfo(ProductionLine.value).then(res => {
    const data = res.data
    productionData.value.monthPlan = data.plan
    productionData.value.monthDone = data.done
    productionData.value.monthRate = productionData.value.monthPlan > 0 ? Math.round((productionData.value.monthDone / productionData.value.monthPlan) * 100) : 0
  })
  // 生产达成 今日
  getTodayProduction(ProductionLine.value).then(res => {
    const data = res.data
    productionData.value.todayPlan = data.pcTotal
    productionData.value.todayDone = data.done
    productionData.value.todayRate = productionData.value.todayPlan > 0 ? Math.round((productionData.value.todayDone / productionData.value.todayPlan) * 100) : 0
  })
  // 工单结单
  fetchWorkOrder()
  // 直通率
  fetchThroughput()
  // 设备稼动（金工二部焊接）
  fetchEquipment()
  // TOP质量问题
  fetchQualityIssues()
  fetchData()
}

onMounted(() => {
  getData()
  eventBus.on('refreshData', getData)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', getData)
  Object.values(chartInstances).forEach(instance => instance?.dispose())
})
</script>

<style scoped>
.line1-container { width: 100%; height: 100%; padding: 4px; box-sizing: border-box; }
.line1-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; height: 100%; }
.panel { background: rgba(0, 30, 60, 0.6); border: 1px solid rgba(0, 150, 255, 0.3); border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.panel.span-2 { grid-column: span 2; }
.panel-header { background: rgba(0, 150, 255, 0.2); padding: 4px 8px; border-bottom: 1px solid rgba(0, 150, 255, 0.3); display: flex; justify-content: space-between; align-items: center; }
.panel-header span:first-child { color: #00d4ff; font-size: 11px; font-weight: bold; }
.panel-header.clickable { cursor: pointer; }
.panel-header.clickable:hover { background: rgba(0, 150, 255, 0.3); }
.click-hint { font-size: 8px; color: #88ccff; }
.panel-content { flex: 1; padding: 4px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.panel-content.center { justify-content: center; align-items: center; }
.panel-content.horizontal { flex-direction: column; }
.panel-content.efficiency-charts { gap: 2px; }
.efficiency-row { display: flex; gap: 2px; flex: 1; }
.gauge-wrap {
  flex: 1;
  min-height: 0;
  cursor: pointer;
  position: relative;
}
.gauge-wrap:hover { background: rgba(0, 100, 200, 0.15); border-radius: 3px; }
.warning-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 10;
}
.sub-section { display: flex; flex-direction: column; gap: 2px; }
.sub-title { color: #88ccff; font-size: 9px; font-weight: bold; padding-left: 3px; border-left: 2px solid #00d4ff; }
.data-row { display: flex; gap: 2px; }
.data-row.wide { flex-wrap: wrap; }
.data-item { flex: 1; display: flex; flex-direction: column; align-items: center; background: rgba(0, 50, 100, 0.3); padding: 2px; border-radius: 3px; min-width: 0; }
.data-item.center { justify-content: center; }
.data-item .label { color: #88ccff; font-size: 8px; white-space: nowrap; }
.data-item .value { color: #ffffff; font-size: 11px; font-weight: bold; font-family: 'Courier New', monospace; }
.data-item .value.highlight { color: #00ff88; text-shadow: 0 0 5px rgba(0, 255, 136, 0.5); }
.data-item .value.large { font-size: 14px; }
.equipment-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; flex: 1; width: 100%; }
.equipment-item { background: rgba(0, 50, 100, 0.3); padding: 6px; border-radius: 3px; display: flex; flex-direction: column; align-items: center; }
.equipment-item.running { background: rgba(0, 150, 100, 0.3); border: 1px solid rgba(0, 200, 100, 0.5); }
.equipment-item.fault { background: rgba(200, 50, 50, 0.3); border: 1px solid rgba(200, 50, 50, 0.5); }
.equipment-item.adjusting { background: rgba(200, 150, 50, 0.3); border: 1px solid rgba(200, 150, 50, 0.5); }
.equipment-item.standby { background: rgba(100, 100, 100, 0.3); border: 1px solid rgba(100, 100, 100, 0.5); }
.equipment-label { color: #88ccff; font-size: 9px; }
.equipment-value { color: #ffffff; font-size: 14px; font-weight: bold; font-family: 'Courier New', monospace; }
.equipment-time { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; flex: 1; width: 100%; }
.time-item { display: flex; flex-direction: column; align-items: center; background: rgba(0, 50, 100, 0.3); padding: 6px; border-radius: 3px; }
.time-item .label { color: #88ccff; font-size: 9px; }
.time-item .value { color: #ffffff; font-size: 12px; font-weight: bold; }
.time-item .value.highlight { color: #00ff88; }
.quality-content { justify-content: center; align-items: center; }
.pie-chart-container { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.pie-chart { width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#ff6b6b 0deg 126deg, #ffd93d 126deg 227deg, #6bcb77 227deg 306deg, #4d96ff 306deg 360deg); }
.pie-legend { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 10px; }
.legend-color { width: 10px; height: 10px; border-radius: 2px; }
.legend-label { color: #88ccff; }
.legend-value { color: #ffffff; font-weight: bold; }
.no-data-tip { color: #88ccff; font-size: 12px; text-align: center; padding: 8px 0; }
.detail-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 9999; }
.detail-modal-content { background: linear-gradient(135deg, #0a1628 0%, #1a2f4e 100%); border: 2px solid rgba(0, 150, 255, 0.5); border-radius: 8px; width: 800px; max-height: 80vh; overflow: hidden; }
.detail-header { background: rgba(0, 150, 255, 0.3); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 150, 255, 0.3); }
.detail-header h3 { color: #00d4ff; margin: 0; font-size: 16px; }
.close-btn { background: none; border: none; color: #88ccff; font-size: 24px; cursor: pointer; }
.close-btn:hover { color: #ffffff; }
.detail-body { padding: 20px; max-height: calc(80vh - 60px); overflow-y: auto; }
.detail-table { width: 100%; border-collapse: collapse; }
.detail-table th, .detail-table td { padding: 10px; text-align: center; border: 1px solid rgba(0, 150, 255, 0.2); }
.detail-table th { background: rgba(0, 150, 255, 0.2); color: #00d4ff; font-size: 12px; }
.detail-table td { color: #ffffff; font-size: 12px; }
.status-running { color: #00ff88; }
.status-fault { color: #ff6b6b; }
.status-adjusting { color: #ffd700; }
.status-standby { color: #88ccff; }
.mb-2 { margin-bottom: 8px; }

/* 出勤人员弹窗 */
.attendance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
.attendance-item { border-radius: 4px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #38bdf8); color: #fff; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
</style>
