<template>
  <body>
    <Header></Header>

    <div class="dashboard-container">
      <div class="dashboard-content">
        <!-- 左侧AGV监控区域 -->
        <div class="agv-section">
          <div class="section-header">
            <h2>AGV运行监控</h2>
          </div>

          <!-- AGV1 -->
          <div class="agv-card">
            <div class="agv-title">AGV 1号车</div>
            <div class="agv-metrics">
              <div class="metric-item">
                <span class="metric-label">1号车需求工位数:</span>
                <span class="metric-value">{{ agv1.planQty }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">1号车完成工位数:</span>
                <span class="metric-value">{{ agv1.completedQty }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">1号车完成率:</span>
                <span class="metric-value highlight">{{ agv1.ratio }}</span>
              </div>
            </div>
          </div>

          <!-- AGV2 -->
          <div class="agv-card">
            <div class="agv-title">AGV 2号车</div>
            <div class="agv-metrics">
              <div class="metric-item">
                <span class="metric-label">2号车需求工位数:</span>
                <span class="metric-value">{{ agv2.planQty }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">2号车完成工位数:</span>
                <span class="metric-value">{{ agv2.completedQty }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">2号车完成率:</span>
                <span class="metric-value highlight">{{ agv2.ratio }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧物料配送明细表格 -->
        <div class="delivery-section">
          <div class="section-header">
            <h2>物料配送明细</h2>
          </div>

          <!-- 使用通用滚动表格组件 -->
          <CommonScrollTable
            :columns="columns"
            :data="deliveryData"
            height="calc(100% - 60px)"
            :max-display-rows="5"
            :scroll-interval="2000"
            highlight-first
            @row-click="handleRowClick"
          />

          <!-- 详情弹窗 -->
          <div v-if="detailVisible" class="detail-modal-overlay" @click.self="closeDetail">
            <div class="detail-modal">
              <div class="detail-header">
                <h3>物料配送详情</h3>
                <button class="close-btn" @click="closeDetail">×</button>
              </div>
              <div class="detail-content">
                <div class="detail-row">
                  <span class="detail-label">工单号:</span>
                  <span class="detail-value">{{ currentDetail.doc_no || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">客户单号:</span>
                  <span class="detail-value">{{ currentDetail.udf021 || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">仓库名称:</span>
                  <span class="detail-value">{{ currentDetail.warehouse_name || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">车型名称:</span>
                  <span class="detail-value">{{ currentDetail.cx || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">产线/工位:</span>
                  <span class="detail-value">{{ currentDetail.ty009 || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">需求数量:</span>
                  <span class="detail-value">{{ currentDetail.plan_qty || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">完成数量:</span>
                  <span class="detail-value">{{ currentDetail.completed_qty || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">需求日期:</span>
                  <span class="detail-value">{{ currentDetail.plan_complete_date || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">实际完成:</span>
                  <span class="detail-value">{{ currentDetail.actual_complete_date || '--' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">配送状态:</span>
                  <span class="detail-value" :class="getStatusClass(currentDetail.peisong_status)">
                    {{ currentDetail.peisong_status || '--' }}
                  </span>
                </div>
                <!-- 详细信息列表 -->
                <div v-if="detailList.length > 0" class="detail-list">
                  <h4>物料明细</h4>
                  <table class="detail-table">
                    <thead>
                      <tr>
                        <th>物料编码</th>
                        <th>物料名称</th>
                        <th>需求数量</th>
                        <th>已配送</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in detailList" :key="idx">
                        <td>{{ item.item_code || '--' }}</td>
                        <td>{{ item.item_name || '--' }}</td>
                        <td>{{ item.plan_qty || '--' }}</td>
                        <td>{{ item.delivery_qty || '--' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './Header/index.vue'
import CommonScrollTable from '@/components/CommonScrollTable/index.vue'
import { getMaterialDeliveryList, getAgvUseRate, getMaterialDeliveryDetail } from '@/api/getPmcinfo'

// 定义列配置 - 匹配API返回的字段
const columns = [
  { prop: 'warehouse_name', label: '仓库名称', width: '90px' },
  { prop: 'ty003', label: '日期', width: '100px' },
  { prop: 'udf021', label: '客户单号', width: '140px' },
  { prop: 'doc_no', label: '工单号', width: '140px' },
  { prop: 'cx', label: '车型名称', width: '90px' },
  { prop: 'ty009', label: '产线/工位', width: '90px' },
  { prop: 'plan_qty', label: '需求数量', width: '80px', type: 'text' as const },
  { prop: 'completed_qty', label: '完成数量', width: '80px', type: 'text' as const },
  { prop: 'plan_complete_date', label: '需求日期', width: '100px' },
  { prop: 'actual_complete_date', label: '实际完成', width: '100px' },
  {
    prop: 'peisong_status',
    label: '配送状态',
    width: '80px',
    type: 'status' as const,
    statusMap: {
      '已完成': 'status-completed',
      '配送中': 'status-delivering',
      '待配送': 'status-pending'
    }
  }
]

// 物料配送数据
const deliveryData = ref<any[]>([])

// 详情弹窗状态
const detailVisible = ref(false)
const currentDetail = ref<any>({})
const detailList = ref<any[]>([])

// 配送状态映射
const getDeliveryStatusText = (status: number): string => {
  if (status === 0 || status === 2) return '已完成'
  if (status === 1) return '待配送'
  return '配送中'
}

// 详情弹窗状态样式
const getStatusClass = (status: string): string => {
  if (status === '已完成') return 'status-completed'
  if (status === '待配送') return 'status-pending'
  return 'status-delivering'
}

// 点击行获取详情
const handleRowClick = async (row: any) => {
  try {
    detailVisible.value = true
    currentDetail.value = row
    const res: any = await getMaterialDeliveryDetail(row.doc_no)
    if (res.code === 200 && res.data) {
      detailList.value = Array.isArray(res.data) ? res.data : []
    } else {
      detailList.value = []
    }
  } catch (error) {
    console.error('获取物料配送详情失败:', error)
    detailList.value = []
  }
}

// 关闭详情弹窗
const closeDetail = () => {
  detailVisible.value = false
  currentDetail.value = {}
  detailList.value = []
}

// 格式化配送数据
const formatDeliveryData = (data: any[]): any[] => {
  return data.map(item => ({
    ...item,
    peisong_status: getDeliveryStatusText(item.peisong_status)
  }))
}

// AGV数据
const agvList = ref<any[]>([])
const agv1 = ref({
  station: '--',
  planQty: '--',
  completedQty: '--',
  ratio: '--'
})
const agv2 = ref({
  station: '--',
  planQty: '--',
  completedQty: '--',
  ratio: '--'
})

// 获取物料配送数据
const fetchDeliveryData = async () => {
  try {
    const res: any = await getMaterialDeliveryList()
    if (res.code === 200 && res.data) {
      deliveryData.value = formatDeliveryData(res.data)
    }
  } catch (error) {
    console.error('获取物料配送数据失败:', error)
  }
}

// 获取AGV使用率数据
const fetchAgvData = async () => {
  try {
    const res: any = await getAgvUseRate()
    if (res.code === 200 && res.data) {
      agvList.value = res.data
      // 更新AGV卡片数据
      if (res.data.length > 0) {
        agv1.value = {
          station: res.data[0].ty009?.trim() || '--',
          planQty: res.data[0].num || 0,
          completedQty: res.data[0].completeNum || 0,
          ratio: res.data[0].ratio + '%' || '0%'
        }
      }
      if (res.data.length > 1) {
        agv2.value = {
          station: res.data[1].ty009?.trim() || '--',
          planQty: res.data[1].num || 0,
          completedQty: res.data[1].completeNum || 0,
          ratio: res.data[1].ratio + '%' || '0%'
        }
      }
    }
  } catch (error) {
    console.error('获取AGV数据失败:', error)
  }
}

let refreshTimer: number | null = null

onMounted(() => {
  // 初始加载数据
  fetchDeliveryData()
  fetchAgvData()

  // 每30秒刷新一次数据
  refreshTimer = window.setInterval(() => {
    fetchDeliveryData()
    fetchAgvData()
  }, 30000)
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
}

.dashboard-content {
  display: flex;
  gap: 6px;
  height: 100%;
}

/* 左侧AGV监控区域 */
.agv-section {
  flex: 0 0 280px;
  background: rgba(0, 30, 60, 0.6);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-header {
  background: rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.section-header h2 {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.agv-card {
  flex: 1;
  background: rgba(0, 50, 100, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.agv-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.agv-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.metric-label {
  color: #88ccff;
  font-size: 13px;
}

.metric-value {
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.metric-value.highlight {
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
}

/* 右侧配送明细表格 */
.delivery-section {
  flex: 1;
  background: rgba(0, 30, 60, 0.6);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .agv-section {
    flex: 0 0 320px;
  }

  .agv-title {
    font-size: 16px;
  }
}

/* 详情弹窗样式 */
.detail-modal-overlay {
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

.detail-modal {
  background: linear-gradient(135deg, #0a1628 0%, #1a2f4e 100%);
  border: 2px solid rgba(0, 150, 255, 0.5);
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 150, 255, 0.3);
}

.detail-header {
  background: rgba(0, 150, 255, 0.3);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.detail-header h3 {
  color: #00d4ff;
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #00d4ff;
  font-size: 28px;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}

.close-btn:hover {
  color: #ff4444;
}

.detail-content {
  padding: 20px;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
}

.detail-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 150, 255, 0.2);
}

.detail-label {
  color: #88ccff;
  width: 120px;
  flex-shrink: 0;
}

.detail-value {
  color: #ffffff;
  flex: 1;
}

.detail-list {
  margin-top: 20px;
}

.detail-list h4 {
  color: #00d4ff;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.detail-table th {
  background: rgba(0, 150, 255, 0.3);
  color: #00d4ff;
  padding: 10px;
  text-align: left;
  border: 1px solid rgba(0, 150, 255, 0.3);
}

.detail-table td {
  color: #ffffff;
  padding: 10px;
  border: 1px solid rgba(0, 150, 255, 0.2);
}

.detail-table tbody tr:hover td {
  background: rgba(0, 150, 255, 0.1);
}
</style>
