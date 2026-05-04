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
          <div class="sub-section">
            <div class="data-row">
              <div class="data-item"><span class="label">配置</span><span class="value">{{ staffing.configured }}</span></div>
              <div class="data-item"><span class="label">出勤</span><span class="value">{{ staffing.attendance }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 人效 -->
      <!-- <div class="panel">
        <div class="panel-header"><span>人效</span></div>
        <div class="panel-content">
          <div class="data-row wide">
            <div class="data-item"><span class="label">计划外</span><span class="value">{{ efficiency.overtime }}</span></div>
            <div class="data-item"><span class="label">换型</span><span class="value">{{ efficiency.changeover }}</span></div>
            <div class="data-item"><span class="label">标准</span><span class="value">{{ efficiency.standard }}</span></div>
            <div class="data-item"><span class="label">实际</span><span class="value highlight">{{ efficiency.actual }}</span></div>
          </div>
          <div class="sub-section efficiency-rate">
            <div class="sub-title">达标率</div>
            <div class="data-row">
              <div class="data-item"><span class="label">排产天</span><span class="value">{{ efficiency.monthDays }}</span></div>
              <div class="data-item"><span class="label">达标天</span><span class="value">{{ efficiency.qualifiedDays }}</span></div>
              <div class="data-item"><span class="label">达标</span><span class="value highlight">{{ efficiency.qualifiedRate }}%</span></div>
            </div>
          </div>
        </div>
      </div> -->

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
            <div class="pie-chart"></div>
            <div class="pie-legend">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getMonthTotalInfo } from '@/api/getProduceinfo'



const showEquipmentDetail = ref(false)

const productionData = ref({ monthPlan: 0, monthDone: 0, monthRate: 0, todayPlan: 0, todayDone: 0, todayRate: 0 })
const staffing = ref({ configured: 0, attendance: 0 })
const efficiency = ref({ overtime: 0, changeover: 0, standard: 0, actual: 0, monthDays: 0, qualifiedDays: 0, qualifiedRate: 0 })
const workOrder = ref({
  monthRate: 0,
  aMonth: { plan: 0, onTime: 0, rate: 0 },
  normalMonth: { plan: 0, onTime: 0, rate: 0 },
  aToday: { plan: 0, onTime: 0 },
  normalToday: { plan: 0, onTime: 0 }
})
const throughput = ref({
  aMonth: { inspect: 0, qualified: 0, rate: 0 },
  aToday: { inspect: 0, qualified: 0, rate: 0 },
  normalMonth: { inspect: 0, qualified: 0, rate: 0 },
  normalToday: { inspect: 0, qualified: 0, rate: 0 }
})
const equipment = ref({ total: 0, running: 0, fault: 0, adjusting: 0, standby: 0, planHours: 0, actualHours: 0, targetRate: 0, actualRate: 0 })
const equipmentDetailList = ref<any[]>([])
const qualityIssues = ref([
  { name: '流挂', value: 35, color: '#ff6b6b' },
  { name: '橘皮', value: 28, color: '#ffd93d' },
  { name: '缩孔', value: 22, color: '#6bcb77' },
  { name: '其他', value: 15, color: '#4d96ff' }
])

const loadMockData = () => {
  productionData.value = { monthPlan: 7800, monthDone: 6100, monthRate: Math.round(6100 / 7800 * 100), todayPlan: 280, todayDone: 245, todayRate: Math.round(245 / 280 * 100) }
  staffing.value = { configured: 38, attendance: 35 }
  efficiency.value = { overtime: 95, changeover: 28, standard: 22, actual: 25, monthDays: 22, qualifiedDays: 16, qualifiedRate: Math.round(16 / 22 * 100) }
  workOrder.value = {
    monthRate: 90,
    aMonth: { plan: 125, onTime: 118, rate: 94 },
    normalMonth: { plan: 198, onTime: 175, rate: 88 },
    aToday: { plan: 10, onTime: 9 },
    normalToday: { plan: 15, onTime: 12 }
  }
  throughput.value = {
    aMonth: { inspect: 6100, qualified: 5800, rate: 95 },
    aToday: { inspect: 245, qualified: 238, rate: 97 },
    normalMonth: { inspect: 4500, qualified: 4200, rate: 93 },
    normalToday: { inspect: 195, qualified: 182, rate: 93 }
  }
  equipment.value = { total: 15, running: 12, fault: 1, adjusting: 1, standby: 1, planHours: 120, actualHours: 108, targetRate: 95, actualRate: 90 }
  equipmentDetailList.value = [
    { id: 1, code: 'PT001', name: '喷涂机器人1号', status: 'running', statusText: '运行中', hours: 7.5 },
    { id: 2, code: 'PT002', name: '喷涂机器人2号', status: 'running', statusText: '运行中', hours: 7.8 },
    { id: 3, code: 'PT003', name: '喷涂机器人3号', status: 'fault', statusText: '故障', hours: 1.5 },
    { id: 4, code: 'PT004', name: '烘干炉1号', status: 'running', statusText: '运行中', hours: 8.0 }
  ]
}


const getData = () =>{
  getMonthTotalInfo(2007).then(res => {
    const data = res.data
    productionData.value.monthPlan = data.plan
    productionData.value.monthDone = data.done
    productionData.value.monthRate = data.monthPlan > 0 ? Math.round((data.monthDone / data.monthPlan) * 100) : 0
  })
}




onMounted(() => {getData(); loadMockData(); eventBus.on('refreshData', loadMockData) })
onBeforeUnmount(() => { eventBus.off('refreshData', loadMockData) })



</script>

<style scoped>
.line1-container { width: 100%; height: 100%; padding: 4px; box-sizing: border-box; }
.line1-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; height: 100%; }
.panel { background: rgba(0, 30, 60, 0.6); border: 1px solid rgba(0, 150, 255, 0.3); border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.panel.span-2 { grid-column: span 2; }
.panel-header { background: rgba(0, 150, 255, 0.2); padding: 4px 8px; border-bottom: 1px solid rgba(0, 150, 255, 0.3); display: flex; justify-content: space-between; align-items: center; }
.panel-header span:first-child { color: #00d4ff; font-size: 11px; font-weight: bold; }
.panel-header.clickable { cursor: pointer; }
.panel-header.clickable:hover { background: rgba(0, 150, 255, 0.3); }
.click-hint { font-size: 8px; color: #88ccff; }
.panel-content { flex: 1; padding: 4px; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.panel-content.horizontal { flex-direction: row; align-items: center; }
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
.efficiency-rate { margin-top: auto; }
.equipment-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; flex: 1;  width: 100%;}
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
.panel-content.horizontal{
 flex-direction: column;
}
</style>
