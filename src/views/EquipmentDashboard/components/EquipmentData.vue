<template>
  <div class="equipment-data">
    <div class="title">设备管理数据</div>
    <div class="data-container">
      <!-- 关键设备运行状态 -->
      <div class="data-section">
        <div class="section-title">
          <span>关键设备运行状态</span>
          <el-button class="reason-btn" link @click="openReasonDialog('running')">原因分析</el-button>
        </div>
        <div class="data-grid">
          <div class="data-item running clickable" @click="openRunningDialog">
            <div class="item-label">正在运行(台)</div>
            <div class="item-value">{{ data.running }}</div>
          </div>
          <div class="data-item standby">
            <div class="item-label">待机设备(台)</div>
            <div class="item-value">{{ data.standby }}</div>
          </div>
          <div class="data-item abnormal">
            <div class="item-label">异常设备(台)</div>
            <div class="item-value">{{ data.abnormal }}</div>
          </div>
          <div class="data-item total">
            <div class="item-label">总设备数(台)</div>
            <div class="item-value">{{ data.total }}</div>
          </div>
        </div>
      </div>

      <!-- 设备保养维修状态 -->
      <div class="data-section">
        <div class="section-title">
          <span>设备保养维修状态</span>
          <el-button class="reason-btn" link @click="openReasonDialog('inspection')">点检原因分析</el-button>
          <el-button class="small-reason-btn" link @click.stop="openReasonDialog('repair')">维修原因</el-button>
        </div>
        <div class="data-grid">
          <div class="data-item ">
            <div class="item-label">完成点检数(台)</div>
            <div class="item-value">{{ data.completedInspection }}</div>
          </div>
          <div class="data-item abnormal">
            <div class="item-label">未点检数(台)</div>
            <div class="item-value">{{ data.uninspected }}</div>
          </div>
          <div class="data-item">
            <div class="item-label">设备总量(台)</div>
            <div class="item-value">{{ runningTotal }}</div>
          </div>
          
          <div class="data-item standby clickable" @click="showRepairDialog = true">
            <div class="item-label">
              待维修数量(台)
   
            </div>
            <div class="item-value">{{ data.repairCount }}</div>
          </div>
          <div class="data-item ">
            <div class="item-label">{{Year}}年度维修完成数量(台)</div>
            <div class="item-value">{{ data.repairCompleteCount }}</div>
          </div>
          <div class="data-item ">
            <div class="item-label">{{Year}}报修数量(台)</div>
            <div class="item-value">{{ repairTotal }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 待维修详细列表弹窗 -->
    <el-dialog
      v-model="showRepairDialog"
      title="待维修设备详细列表"
      width="70%"
      class="repair-dialog"
    >
      <el-table
        :data="repairList"
        v-loading="loading"
        max-height="60vh"
        style="width: 100%"
        border
      >
        <el-table-column prop="deviceId" label="设备编号" width="150" />
        <el-table-column prop="deviceName" label="设备名称" min-width="200" />
        <el-table-column prop="moctyudf05" label="备注" min-width="150">
          <template #default="scope">
            {{ scope.row.moctyudf05 || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            {{ scope.row.status || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="lvTwoLastMaintenanceDay" label="二级保养日期" width="150">
          <template #default="scope">
            {{ scope.row.lvTwoLastMaintenanceDay || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="lvThreeLastMaintenanceDay" label="三级保养日期" width="150">
          <template #default="scope">
            {{ scope.row.lvThreeLastMaintenanceDay || '-' }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <span>共 {{ repairList.length }} 条记录</span>
          <el-button type="primary" @click="showRepairDialog = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 正在运行设备列表弹窗 -->
    <el-dialog
      v-model="showRunningDialog"
      title="正在运行设备列表"
      width="50%"
      class="running-dialog"
    >
      <el-table
        :data="runningList"
        v-loading="loading"
        max-height="60vh"
        style="width: 100%"
        border
      >
        <el-table-column prop="machCode" label="设备编号" width="150" />
        <el-table-column prop="machName" label="设备名称" min-width="200" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <span>共 {{ runningList.length }} 条记录</span>
          <el-button type="primary" @click="showRunningDialog = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 原因分析对话框（复用通用组件） -->
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
import { ref, onMounted, computed } from 'vue'
import ReasonDialog from '@/components/ReasonDialog.vue'
import { ElMessage } from 'element-plus'
import { fillInReason } from '@/api/produceperformance'
import {
  getMachineInspection,
  getKeyMachineStatus,
  type MachineInspectionData,
  type MachineRepairItem
} from '@/api/equipment'

interface EquipmentStats {
  running: number
  standby: number
  abnormal: number
  total: number
  completedInspection: number
  uninspected: number
  repairCount: number
  repairCompleteCount: number
}

const data = ref<EquipmentStats>({
  running: 0,
  standby: 0,
  abnormal: 0,
  total: 0,
  completedInspection: 0,
  uninspected: 0,
  repairCount: 0,
  repairCompleteCount: 0
})
const Year = computed(() => new Date().getFullYear())
const repairList = ref<MachineRepairItem[]>([])
const showRepairDialog = ref(false)
const loading = ref(false)
const runningList = ref<any[]>([])
const showRunningDialog = ref(false)

// 运行总数 = 正在运行 + 待机 + 异常（用于第一栏显示总设备数）
const runningTotal = computed(() => {
  const r = Number(data.value.completedInspection) || 0
  const s = Number(data.value.uninspected) || 0

  return r + s 
})



// 原因分析对话框（复用同一弹框，不同场景通过 code 区分）
const showReasonDialog = ref(false)
const reasonMetric = ref({
  name: '',
  period: '实时',
  target: 100,
  actual: 0,
  achievement: 0,
  code: ''
})

const openReasonDialog = (type = 'running') => {
  // 根据类型设置 metric 信息和实际值
  if (type === 'running') {
    reasonMetric.value.name = '关键设备运行状态'
    reasonMetric.value.actual = Number(data.value.running) || 0
    reasonMetric.value.code = 'EQUIP_RUNNING'
    reasonMetric.value.achievement = runningTotal.value ? Math.round((reasonMetric.value.actual / runningTotal.value) * 100) : 0
  } else if (type === 'inspection') {
    reasonMetric.value.name = '设备点检情况'
    reasonMetric.value.actual = Number(data.value.completedInspection) || 0
    reasonMetric.value.code = 'EQUIP_INSPECTION'
    reasonMetric.value.achievement = data.value.total ? Math.round((reasonMetric.value.actual / data.value.total) * 100) : 0
  } else if (type === 'repair') {
    reasonMetric.value.name = '设备维修情况'
    reasonMetric.value.actual = Number(data.value.repairCount) || 0
    reasonMetric.value.code = 'EQUIP_REPAIR'
    reasonMetric.value.achievement = data.value.total ? Math.round((reasonMetric.value.actual / data.value.total) * 100) : 0
  }
  showReasonDialog.value = true
}

const handleReasonSubmit = async (payload: any) => {
  console.log('原因提交:', payload)
  try {
    if (reasonMetric.value?.code) {
      await fillInReason(reasonMetric.value.code, payload.reason || '', payload.solution || '')
      ElMessage.success('原因分析已提交')
    } else {
      ElMessage.warning('缺少提交代码，已本地保存')
    }
  } catch (error) {
    console.error('提交原因失败', error)
    ElMessage.error('提交失败，请重试（已本地保存）')
  } finally {
    showReasonDialog.value = false
  }
}
const repairTotal = computed(() => {
  const r = Number(data.value.repairCompleteCount) || 0
  const s = Number(data.value.repairCount) || 0

  return r +s
})

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const resolveCount = (fallback: number, ...candidates: unknown[]) => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.length
    }
    const parsed = Number(candidate)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallback
}

const applyInspectionData = (payload: MachineInspectionData) => {
  data.value = {
    running: resolveCount(data.value.running, payload.runningCount, payload.running),
    standby: resolveCount(data.value.standby, payload.standbyCount, payload.standby),
    abnormal: resolveCount(data.value.abnormal, payload.repairCount, payload.repair, payload.abnormal),
    total: resolveCount(data.value.total, payload.total),
    completedInspection: toNumber(payload.checkCount, data.value.completedInspection),
    uninspected: toNumber(payload.uncheckCount, data.value.uninspected),
    repairCount: toNumber(payload.repairCount, data.value.repairCount),
    repairCompleteCount: toNumber(payload.repairCompleteCount, data.value.repairCompleteCount)
  }
  
  // 保存待维修设备列表
  if (Array.isArray(payload.repair) && payload.repair.length > 0) {
    repairList.value = payload.repair
  }
}

const fetchMachineInspectionData = async () => {
  try {
    const response = await getMachineInspection()
    if (response?.data) {
      applyInspectionData(response.data)
    }
  } catch (error) {
    console.error('获取设备点检数据失败', error)
  }
}

const fetchKeyMachineStatusData = async () => {
  try {
    const response = await getKeyMachineStatus()
    if (response?.data) {
      applyInspectionData(response.data)
      // 如果接口返回 doing 列表，保存正在运行列表用于弹窗显示
      if (Array.isArray(response.data.doing)) {
        runningList.value = response.data.doing.map((it: any) => ({
          machCode: it.machCode || it.mac_no || it.macCode || it.mac_no,
          machName: it.machName || it.mac_name || it.machName
        }))
      }
    }
  } catch (error) {
    console.error('获取关键设备状态失败', error)
  }
}

onMounted(() => {
  fetchMachineInspectionData()
  fetchKeyMachineStatusData()
})

const openRunningDialog = () => {
  // 确保列表已加载，然后打开对话框
  showRunningDialog.value = true
}
</script>

<style scoped>
.equipment-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  flex-shrink: 0;
}

.data-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  min-height: 0;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow: hidden;
}

.data-section:first-child {
  flex: 0 0 auto;
  min-height: 0;
}

.data-section:last-child {
  flex: 1 1 auto;
  min-height: 0;
}

.section-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  flex-shrink: 0;
}
.section-title .reason-btn {
  float: right;
  color: #8cc8ff;
  font-size: 12px;
  padding: 0 6px;
}
.section-title .reason-btn:hover {
  color: #00d4ff;
}
.small-reason-btn {
  margin-left: 8px;
  color: #8cc8ff;
  font-size: 12px;
  padding: 0 4px;
}
.small-reason-btn:hover {
  color: #00d4ff;
}

.data-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  min-height: 0;
  overflow: hidden;
}

.data-section:first-child .data-grid {
  grid-template-rows: 1fr;
  grid-template-columns: repeat(4, 1fr);
  height: 100%;
}

.data-section:last-child .data-grid {
  grid-template-rows: repeat(2, 1fr);
  height: 100%;
}

.data-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 6px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
  transition: all 0.3s;
  min-height: 0;
  overflow: hidden;
}

.data-item:hover {
  background: rgba(0, 150, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 212, 255, 0.2);
}

.data-item.highlight {
  background: rgba(255, 165, 0, 0.15);
  border-color: rgba(255, 165, 0, 0.3);
}

.data-item.clickable {
  cursor: pointer;
}

.data-item.clickable:hover {
  background: rgba(255, 165, 0, 0.25);
  border-color: rgba(255, 165, 0, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 165, 0, 0.3);
}

/* 分类颜色 */
.data-item.running {
  background: rgba(40, 167, 69, 0.08);
  border-color: rgba(40, 167, 69, 0.2);
}
.data-item.running .item-value {
  color: #28a745;
}

.data-item.standby {
  background: rgba(255, 165, 0, 0.08);
  border-color: rgba(255, 165, 0, 0.25);
}
.data-item.standby .item-value {
  color: #ff8c00;
}

.data-item.abnormal {
  background: rgba(255, 99, 71, 0.08);
  border-color: rgba(255, 99, 71, 0.25);
}
.data-item.abnormal .item-value {
  color: #ff4d4f;
}

.data-item.total {
  background: rgba(0, 212, 255, 0.06);
  border-color: rgba(0, 212, 255, 0.2);
}
.data-item.total .item-value {
  color: #00d4ff;
}

.item-label {
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  margin-bottom: 6px;
  line-height: 1.2;
  flex-shrink: 0;
}

.item-value {
  color: #00d4ff;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  flex-shrink: 0;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }
  
  .item-label {
    font-size: 14px;
  }
  
  .item-value {
    font-size: 26px;
  }
}

.repair-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer span {
  color: #ffffff;
  font-size: 14px;
}
</style>


