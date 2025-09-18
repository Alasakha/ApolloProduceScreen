<template>
  <div class="equipment-management">
    <div class="component-header">
      <div class="header-icon">🏭</div>
      <div class="header-title">设备管理</div>
      <div class="header-status" :class="overallStatus">
        <span class="status-dot"></span>
        {{ overallStatusText }}
      </div>
    </div>
    
    <div class="content-area">
      <!-- <div class="main-stats">
        <div class="stat-card total-equipment">
          <div class="stat-value">{{ totalEquipment }}</div>
          <div class="stat-label">设备总数</div>
          <div class="stat-trend">
            <span class="trend-arrow">📊</span>
            <span class="trend-value">关键工序</span>
          </div>
        </div> -->
        
        <!-- <div class="stat-card cnc-rate">
          <div class="stat-value">{{ cncRate }}%</div>
          <div class="stat-label">数控化率</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: cncRate + '%' }"></div>
          </div>
        </div>
      </div> -->
      
      <div class="equipment-table">

        <div class="table-content">
          <div class="table-row header-row">
            <div class="col-no">NO</div>
            <div class="col-workcenter">部门/单位</div>
            <div class="col-equipment">关键工序设备数量</div>
            <div class="col-cnc">关键数控设备数量</div>
            <div class="col-ratio">占比</div>
          </div>
          <div 
            v-for="(item, index) in sortedEquipmentData" 
            :key="index"
            class="table-row data-row"
          >
            <div class="col-no">{{ index + 1 }}</div>
            <div class="col-workcenter">{{ item.workcenter }}</div>
            <div class="col-equipment">{{ item.equipment }}</div>
            <div class="col-cnc">{{ item.cnc }}</div>
            <div class="col-ratio">{{ calculateRatio(item.equipment, item.cnc) }}%</div>
          </div>
          <div class="table-row total-row">
            <div class="col-no">-</div>
            <div class="col-workcenter">合计</div>
            <div class="col-equipment">{{ totalEquipment }}</div>
            <div class="col-cnc">{{ totalCNC }}</div>
            <div class="col-ratio">{{ cncRate }}%</div>
          </div>
        </div>
      </div>
      
      <!-- <div class="equipment-summary">
        <div class="summary-item">
          <span class="summary-label">运行设备</span>
          <span class="summary-value running">{{ runningEquipment }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">维护设备</span>
          <span class="summary-value maintenance">{{ maintenanceEquipment }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">故障设备</span>
          <span class="summary-value fault">{{ faultEquipment }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">闲置设备</span>
          <span class="summary-value idle">{{ idleEquipment }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getElectricPower } from '@/api/control'

// 设备数据
const equipmentData = ref([])
const runningEquipment = ref(98)
const maintenanceEquipment = ref(23)
const faultEquipment = ref(8)
const idleEquipment = ref(27)

// 计算属性

// 排序后的设备数据（A开头的部门排到前面）
const sortedEquipmentData = computed(() => {
  return [...equipmentData.value].sort((a, b) => {
    const aIsA = a.workcenter && a.workcenter[0].toUpperCase() === 'A'
    const bIsA = b.workcenter && b.workcenter[0].toUpperCase() === 'A'
    if (aIsA && !bIsA) return -1
    if (!aIsA && bIsA) return 1
    return 0
  })
})

const totalCNC = computed(() => {
  // 使用排序后的数据计算总数
  return sortedEquipmentData.value.reduce((sum, item) => sum + item.cnc, 0)
})

const cncRate = computed(() => {
  if (totalEquipment.value === 0) return 0
  return ((totalCNC.value / totalEquipment.value) * 100).toFixed(2)
})

// 计算设备总数
const totalEquipment = computed(() => {
  return sortedEquipmentData.value.reduce((sum, item) => sum + item.equipment, 0)
})

// 计算占比
const calculateRatio = (equipment, cnc) => {
  if (equipment === 0) return '0.00'
  return ((cnc / equipment) * 100).toFixed(2)
}

// 计算整体状态
const overallStatus = computed(() => {
  const faultRatio = (faultEquipment.value / totalEquipment.value) * 100
  if (faultRatio > 10) return 'warning'
  if (faultRatio > 5) return 'attention'
  return 'normal'
})

const overallStatusText = computed(() => {
  const statusMap = {
    normal: '正常',
    attention: '注意',
    warning: '警告'
  }
  return statusMap[overallStatus.value]
})

// 获取设备数据
const fetchEquipmentData = async () => {
  try {
    const response = await getElectricPower()
    if (response.code === 200) {
      equipmentData.value = response.data
    }
  } catch (error) {
    console.error('获取设备数据失败:', error)
    // 使用模拟数据作为备用
    equipmentData.value = [
      { workcenter: '金工一部冲压', equipment: 12, cnc: 12 },
      { workcenter: '金工一部焊接', equipment: 42, cnc: 12 },
      { workcenter: '金工二部', equipment: 45, cnc: 21 },
      { workcenter: '注塑', equipment: 4, cnc: 4 }
    ]
  }
}

// 模拟数据更新
onMounted(() => {
  fetchEquipmentData()
  
  setInterval(() => {
    // 模拟设备状态变化
    runningEquipment.value = Math.max(90, Math.min(110, runningEquipment.value + Math.floor(Math.random() * 6) - 3))
    maintenanceEquipment.value = Math.max(15, Math.min(35, maintenanceEquipment.value + Math.floor(Math.random() * 6) - 3))
    faultEquipment.value = Math.max(5, Math.min(15, faultEquipment.value + Math.floor(Math.random() * 4) - 2))
    idleEquipment.value = totalEquipment.value - runningEquipment.value - maintenanceEquipment.value - faultEquipment.value
  }, 10000)
})
</script>

<style scoped>
.equipment-management {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  position: relative;
}

.component-header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.header-icon {
  font-size: 20px;
}

.header-title {
  color: var(--primary-blue);
  font-size: 14px;
  font-weight: 600;
  flex: 1;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.3);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.header-status.normal .status-dot {
  background: #00ff00;
}

.header-status.attention .status-dot {
  background: #ffaa00;
}

.header-status.warning .status-dot {
  background: #ff0000;
}

.content-area {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  min-height: 0;
}

.main-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-blue);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #3B82F6;
}

.trend-arrow {
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), #3B82F6);
  transition: width 0.3s ease;
}

.equipment-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 212, 255, 0.2);
  min-height: 200px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-header {
  background: rgba(0, 212, 255, 0.1);
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.table-title {
  color: var(--primary-blue);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.table-content {
  padding: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 200px;
}

.table-content::-webkit-scrollbar {
  width: 6px;
}

.table-content::-webkit-scrollbar-track {
  background: rgba(0, 212, 255, 0.1);
  border-radius: 3px;
}

.table-content::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.4);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.table-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.6);
}

/* Firefox 滚动条样式 */
.table-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.4) rgba(0, 212, 255, 0.1);
}

.table-row {
  display: grid;
  grid-template-columns: 0.3fr 1.5fr 1.2fr 1.2fr 0.8fr;
  gap: 6px;
  padding: 8px 12px;
  align-items: center;
  font-size: 11px;
  min-height: 32px;
}

.header-row {
  background: rgba(0, 212, 255, 0.05);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  font-weight: 600;
  color: var(--primary-blue);
  font-size: 11px;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-row {
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  color: var(--text-primary);
  transition: background-color 0.2s ease;
}

.data-row:hover {
  background: rgba(0, 212, 255, 0.05);
}

.total-row {
  background: rgba(0, 212, 255, 0.1);
  font-weight: 600;
  color: var(--primary-blue);
  border-top: 2px solid rgba(0, 212, 255, 0.3);
  font-size: 12px;
  position: sticky;
  bottom: 0;
  z-index: 1;
}

.col-no {
  text-align: center;
  font-weight: 600;
  min-width: 20px;
}

.col-workcenter {
  color: #E5E7EB;
  text-align: left;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 4px;
}

.col-equipment,
.col-cnc {
  text-align: center;
  color: #3B82F6;
  font-weight: 600;
  min-width: 40px;
}

.col-ratio {
  text-align: center;
  color: #10B981;
  font-weight: 600;
  min-width: 35px;
}

/* 响应式设计 */
@media (max-width: 2000px) {
  .component-header {
    padding: 4px;
  }
  
  .header-icon {
    font-size: 12px;
  }
  
  .header-title {
    font-size: 12px;
  }
  
  .header-status {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .content-area {
    padding: 12px;
    gap: 16px;
  }
  
  .table-row {
    grid-template-columns: 0.3fr 1.4fr 1.1fr 1.1fr 0.8fr;
    font-size: 10px;
    gap: 5px;
    padding: 7px 10px;
    min-height: 28px;
  }
  
  .header-row {
    font-size: 9px;
  }
  
  .total-row {
    font-size: 11px;
  }
  
  .col-workcenter {
    font-size: 10px;
  }
  
  .equipment-table {
    min-height: 180px;
  }
  
  .table-content {
    max-height: 280px;
  }
}@media (max-width: 1400px) {
  .table-row {
    grid-template-columns: 0.25fr 2.8fr 1.1fr 1.1fr 0.75fr;
    font-size: 10px;
    gap: 4px;
    padding: 6px 8px;
  }
  
  .table-title {
    font-size: 12px;
  }
  
  .col-workcenter {
    font-size: 10px;
  }
}

@media (max-width: 1200px) {
  .table-row {
    grid-template-columns: 0.2fr 3fr 1fr 1fr 0.8fr;
    font-size: 9px;
    gap: 3px;
    padding: 5px 6px;
  }
  
  .table-title {
    font-size: 11px;
  }
  
  .col-workcenter {
    font-size: 9px;
  }
}

.equipment-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

.summary-label {
  font-size: 12px;
  color: var(--text-muted);
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
}

.summary-value.running {
  color: #10B981;
}

.summary-value.maintenance {
  color: #F59E0B;
}

.summary-value.fault {
  color: #EF4444;
}

.summary-value.idle {
  color: var(--text-muted);
}
</style> 