<template>
  <body>
    <Header></Header>

    <div class="dashboard-container">
      <!-- 上部：出库发货管理 -->
      <div class="section-outbound">
        <div class="section-header">
          <h2>出库发货管理</h2>
        </div>

        <!-- 数据概览卡片 -->
        <div class="metrics-row">
          <div class="metric-card cursor-pointer" @click="showEditModal('月度计划出库发货数')">
            <div class="metric-label">月度计划出库发货数</div>
            <div class="metric-value">{{ outboundMetrics.monthPlan }}</div>
          </div>

          <div class="metric-card cursor-pointer" @click="showEditModal('今日计划出库发货数')">
            <div class="metric-label">今日计划出库发货数</div>
            <div class="metric-value">{{ outboundMetrics.dayPlan }}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">月度累计已发货数</div>
            <div class="metric-value">{{ outboundMetrics.monthQty }}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">今日累计已发货数</div>
            <div class="metric-value">{{ outboundMetrics.dayQty }}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">月度完成率</div>
            <div class="metric-value highlight">{{ outboundMetrics.monthRate }}</div>
          </div>

          <div class="metric-card">
            <div class="metric-label">今日完成率</div>
            <div class="metric-value highlight">{{ outboundMetrics.dayRate }}</div>
          </div>
        </div>

        <!-- 编辑弹窗 -->
        <div v-if="editModalVisible" class="edit-modal-overlay" @click.self="closeEditModal">
          <div class="edit-modal">
            <div class="edit-modal-header">
              <h3>填写 {{ editFieldName }}</h3>
            </div>
            <div class="edit-modal-body">
              <input
                type="number"
                v-model.number="editValue"
                @keyup.enter="confirmEdit"
                placeholder="请输入数值"
                autofocus
              />
            </div>
            <div class="edit-modal-footer">
              <button class="cancel-btn" @click="closeEditModal">取消</button>
              <button class="confirm-btn" @click="confirmEdit">确认</button>
            </div>
          </div>
        </div>

        <!-- 今日出库发货信息表格 -->
        <div class="table-section">
          <div class="section-subheader">
            <h3>今日出库发货信息</h3>
          </div>
          <CommonScrollTable
            :columns="outboundColumns"
            :data="todayOutboundData"
            height="120px"
            :max-display-rows="4"
            :scroll-interval="4000"
          />
        </div>

        <!-- 近三天出货订单生产状况 -->
        <div class="table-section">
          <div class="section-subheader">
            <h3>近三天出货订单生产状况</h3>
          </div>
          <CommonScrollTable
            :columns="productionColumns"
            :data="upcomingOrders"
            height="150px"
            :max-display-rows="5"
            :scroll-interval="3000"
            :highlight-first="true"
          />
        </div>
      </div>

      <!-- 下部：库存信息管理 -->
      <div class="section-inventory">
        <div class="section-header">
          <h2>库存信息管理</h2>
        </div>

        <!-- 库存统计卡片 -->
        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-label">总装二课成品累计库存</div>
            <div class="metric-value">{{ inventoryMetrics.line2Total }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">总装一课成品累计库存</div>
            <div class="metric-value">{{ inventoryMetrics.line1Total }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">合计库存数</div>
            <div class="metric-value highlight">{{ totalInventory }}</div>
          </div>
        </div>

        <!-- 库存明细信息表格 -->
        <div class="table-section">
          <div class="section-subheader">
            <h3>库存明细信息</h3>
          </div>
          <CommonScrollTable
            :columns="inventoryColumns"
            :data="inventoryDetailData"
            height="calc(100% - 70px)"
            :max-display-rows="8"
            :scroll-interval="3000"
          />
        </div>
      </div>
    </div>
    
  </body>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from './Header/index.vue'
import CommonScrollTable from '@/components/CommonScrollTable/index.vue'
import { getOutboundShipping, getOutboundShippingDetail, getInventoryInformation, getInventoryInformationDetail, fillDataAnalysis } from '@/api/getPmcinfo'
// 出库发货表格列配置 - 匹配 outboundShippingDetail API
const outboundColumns = [
  { prop: 'doc_no', label: '工单号', width: '150px' },
  { prop: 'item_name', label: '产品名称', width: '200px' },
  { prop: 'cx', label: '车型', width: '100px' },
  { prop: 'business_qty', label: '应发数量', width: '80px', align: 'center' as const },
  { prop: 'sign_business_qty', label: '实发数量', width: '80px', align: 'center' as const },
  { prop: 'approvedate', label: '审批时间', width: '160px' }
]

// 生产状况表格列配置
const productionColumns = [
  { prop: 'customerOrderNo', label: '客户单号', width: '140px' },
  { prop: 'vehicleModel', label: '车型名称', width: '100px' },
  { prop: 'plannedOutboundTime', label: '计划出库时间', width: '130px' },
  {
    prop: 'productionStatus',
    label: '生产状态',
    width: '90px',
    type: 'status' as const,
    statusMap: {
      '已完工': 'status-completed',
      '生产中': 'status-producing',
      '待投产': 'status-pending'
    }
  },
  { prop: 'progress', label: '完成进度', width: '120px', type: 'progress' as const }
]

// 库存明细表格列配置 - 匹配 inventoryInformationDetail API
const inventoryColumns = [

    { prop: 'mo_doc_no', label: '工单号', width: '120px' },
  { prop: 'udf021', label: '客户单号', width: '120px' },
  { prop: 'user_name', label: '业务员', width: '100px' },
  { prop: 'item_specification', label: '规格', width: '300px' },
  { prop: 'cx', label: '车型', width: '100px' },
  // { prop: 'business_qty', label: '数量', width: '80px', align: 'center' as const },
  { prop: 'accepted_qty', label: '入库数量', width: '80px', align: 'center' as const },
  { prop: 'transaction_date', label: '入库日期', width: '120px' },
  { prop: 'doc_no', label: '生产入库单号', width: '120px' },
  { prop: 'plant_name', label: '工厂名称', width: '120px' },
  { prop: 'item_code', label: '品号', width: '120px' },
  { prop: 'diff_days', label: '库存天数', width: '120px' }
]

// 表格引用（可用于外部控制）
// const productionTableRef = ref<InstanceType<typeof CommonScrollTable> | null>(null)

// 出库发货指标
const outboundMetrics = ref({
  monthQty: '--',
  dayQty: '--',
  monthPlan: '--' as string | number,
  dayPlan: '--' as string | number,
  monthRate: '--',
  dayRate: '--'
})

// 计划数输入绑定 - 已移除，改用弹窗方式

// 编辑弹窗相关
const editModalVisible = ref(false)
const editFieldName = ref('')
const editValue = ref<number | null>(null)

// 显示编辑弹窗
const showEditModal = (fieldName: string) => {
  editFieldName.value = fieldName
  editValue.value = null
  editModalVisible.value = true
}

// 关闭编辑弹窗
const closeEditModal = () => {
  editModalVisible.value = false
  editFieldName.value = ''
  editValue.value = null
}

// 确认编辑
const confirmEdit = async () => {
  if (editValue.value === null || editValue.value === undefined) return
  try {
    const res: any = await fillDataAnalysis(editFieldName.value, editValue.value)
    if (res.code === 200) {
      if (editFieldName.value === '月度计划出库发货数') {
        outboundMetrics.value.monthPlan = editValue.value
      } else if (editFieldName.value === '今日计划出库发货数') {
        outboundMetrics.value.dayPlan = editValue.value
      }
      closeEditModal()
      loadOutboundMetrics()
    }
  } catch (error) {
    console.error('提交失败：', error)
  }
}

// 计算属性
// const monthlyCompletionRate = computed(() => {
//   return outboundMetrics.value.monthlyPlan > 0
//     ? ((outboundMetrics.value.totalShipped / outboundMetrics.value.monthlyPlan) * 100).toFixed(2) + '%'
//     : '0.00%'
// })

// const dailyCompletionRate = computed(() => {
//   return outboundMetrics.value.dailyPlan > 0
//     ? ((outboundMetrics.value.totalShipped / outboundMetrics.value.dailyPlan) * 100).toFixed(2) + '%'
//     : '0.00%'
// })

// 今日出库发货信息 - 使用API数据
const todayOutboundData = ref<any[]>([])

// 近三天出货订单
const upcomingOrders = ref([
  { customerOrderNo: 'CO20260418001', vehicleModel: 'Model-B', plannedOutboundTime: '2026-04-18 10:00', productionStatus: '生产中', progress: 75 },
  { customerOrderNo: 'CO20260418002', vehicleModel: 'Model-C', plannedOutboundTime: '2026-04-18 14:00', productionStatus: '已完工', progress: 100 },
  { customerOrderNo: 'CO20260419001', vehicleModel: 'Model-A', plannedOutboundTime: '2026-04-19 09:00', productionStatus: '生产中', progress: 45 },
  { customerOrderNo: 'CO20260419002', vehicleModel: 'Model-B', plannedOutboundTime: '2026-04-19 16:00', productionStatus: '待投产', progress: 0 },
  { customerOrderNo: 'CO20260420001', vehicleModel: 'Model-C', plannedOutboundTime: '2026-04-20 11:00', productionStatus: '生产中', progress: 20 },
  { customerOrderNo: 'CO20260420002', vehicleModel: 'Model-A', plannedOutboundTime: '2026-04-20 15:00', productionStatus: '待投产', progress: 0 }
])

// 库存指标 - 使用API数据
const inventoryMetrics = ref({
  line2Total: 0,
  line1Total: 0
})

const totalInventory = computed(() => {
  return inventoryMetrics.value.line1Total + inventoryMetrics.value.line2Total
})

// 库存明细 - 使用API数据
const inventoryDetailData = ref<any[]>([])

// 加载出库发货指标数据
const loadOutboundMetrics = async () => {
  try {
    const res: any = await getOutboundShipping()
    if (res.code === 200 && res.data) {
      outboundMetrics.value.monthQty = res.data.monthQty || 0
      outboundMetrics.value.dayQty = res.data.dayQty || 0
      outboundMetrics.value.monthPlan = res.data.monthPlan || 0
      outboundMetrics.value.dayPlan = res.data.dayPlan || 0
      outboundMetrics.value.monthRate = res.data.monthRate || '0%'
      outboundMetrics.value.dayRate = res.data.dayRate || '0%'
    }
  } catch (error) {
    console.error('获取出库发货指标数据失败：', error)
  }
}

// 加载出库发货明细数据
const loadOutboundDetail = async () => {
  try {
    const res: any = await getOutboundShippingDetail()
    if (res.code === 200 && res.data) {
      todayOutboundData.value = res.data.map((item: any) => ({
        ...item,
        approvedate: item.approvedate ? item.approvedate.split('.')[0] : '--'
      }))
    }
  } catch (error) {
    console.error('获取出库发货明细数据失败：', error)
  }
}

// 加载库存信息数据
const loadInventoryInfo = async () => {
  try {
    const res: any = await getInventoryInformation()
    if (res.code === 200 && res.data) {
      // 根据 plant_name 分配到不同产线
      res.data.forEach((item: any) => {
        if (item.plant_name && item.plant_name.includes('1')) {
          inventoryMetrics.value.line1Total = parseFloat(item.monthQty) || 0
        } else if (item.plant_name && item.plant_name.includes('2')) {
          inventoryMetrics.value.line2Total = parseFloat(item.monthQty) || 0
        }
      })
    }
  } catch (error) {
    console.error('获取库存信息数据失败：', error)
  }
}

// 加载库存明细数据
const loadInventoryDetail = async () => {
  try {
    const res: any = await getInventoryInformationDetail()
    if (res.code === 200 && res.data) {
      inventoryDetailData.value = res.data.map((item: any) => ({
        ...item,
        plan_settlement_date: item.plan_settlement_date ? item.plan_settlement_date.split(' ')[0] : '--'
      }))
    }
  } catch (error) {
    console.error('获取库存明细数据失败：', error)
  }
}

let refreshTimer: number | null = null

onMounted(() => {
  // 初始加载所有数据
  loadOutboundMetrics()
  loadOutboundDetail()
  loadInventoryInfo()
  loadInventoryDetail()

  // 每30秒刷新一次数据
  refreshTimer = window.setInterval(() => {
    loadOutboundMetrics()
    loadOutboundDetail()
    loadInventoryInfo()
    loadInventoryDetail()
  }, 30000)

  console.log('包装成品发货管理看板已加载')
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0a1628 0%, #1a2f4e 100%);
  overflow: hidden;
}

.dashboard-container {
  width: 100vw;
  height: 93vh;
  padding: 6px;
  box-sizing: border-box;
  background: radial-gradient(ellipse at center, rgba(0, 100, 200, 0.1) 0%, transparent 70%);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-outbound,
.section-inventory {
  flex: 1;
  background: rgba(0, 30, 60, 0.6);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  background: rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.section-header h2 {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.section-subheader {
  background: rgba(0, 150, 255, 0.15);
  border-radius: 3px;
  padding: 6px 10px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.section-subheader h3 {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.metrics-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.metric-card {
  flex: 1;
  min-width: 180px;
  background: rgba(0, 50, 100, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.metric-card.cursor-pointer {
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.metric-card.cursor-pointer:hover {
  border-color: rgba(0, 150, 255, 0.5);
  background: rgba(0, 80, 140, 0.5);
}

.metric-card .metric-label {
  color: #88ccff;
  font-size: 12px;
  margin-bottom: 6px;
  text-align: center;
}

.metric-card .metric-value {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.metric-card .metric-value.highlight {
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
}

.edit-input {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 60px;
  padding: 2px 4px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 2px;
  color: #00ff88;
  font-size: 12px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.metric-card:hover .edit-input {
  opacity: 1;
}

.edit-input:focus {
  outline: none;
  border-color: #00d4ff;
  opacity: 1;
}

.metric-value-input {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.metric-value-input input {
  flex: 1;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 3px;
  padding: 6px 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  min-width: 0;
}

.metric-value-input input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 8px rgba(0, 150, 255, 0.4);
}

.metric-value-input input::placeholder {
  color: rgba(136, 204, 255, 0.5);
  font-size: 12px;
  font-weight: normal;
}

.submit-btn {
  background: rgba(0, 150, 255, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 3px;
  color: #00d4ff;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.submit-btn:hover {
  background: rgba(0, 150, 255, 0.5);
  border-color: #00d4ff;
}

/* 编辑弹窗样式 */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.edit-modal {
  background: linear-gradient(135deg, #0a1628 0%, #1a2f4e 100%);
  border: 2px solid rgba(0, 150, 255, 0.5);
  border-radius: 8px;
  width: 360px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 150, 255, 0.3);
}

.edit-modal-header {
  background: rgba(0, 150, 255, 0.3);
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.edit-modal-header h3 {
  color: #00d4ff;
  margin: 0;
  font-size: 16px;
  text-align: center;
}

.edit-modal-body {
  padding: 20px;
}

.edit-modal-body input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 4px;
  color: #ffffff;
  font-size: 18px;
  text-align: center;
  box-sizing: border-box;
}

.edit-modal-body input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 150, 255, 0.4);
}

.edit-modal-footer {
  padding: 15px 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
  border-top: 1px solid rgba(0, 150, 255, 0.2);
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(100, 100, 100, 0.3);
  border: 1px solid rgba(150, 150, 150, 0.5);
  color: #cccccc;
}

.cancel-btn:hover {
  background: rgba(100, 100, 100, 0.5);
}

.confirm-btn {
  background: rgba(0, 150, 255, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.5);
  color: #00d4ff;
}

.confirm-btn:hover {
  background: rgba(0, 150, 255, 0.5);
  border-color: #00d4ff;
}

.table-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

@media (min-width: 1920px) {
  .section-header h2 {
    font-size: 18px;
  }

  .section-subheader h3 {
    font-size: 15px;
  }

  .metric-card .metric-label {
    font-size: 13px;
  }

  .metric-card .metric-value {
    font-size: 20px;
  }
}
</style>
