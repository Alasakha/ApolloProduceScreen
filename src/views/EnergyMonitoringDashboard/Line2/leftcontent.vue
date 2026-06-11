<template>
  <div class="h-[25vh] w-full ">
    <dv-border-box-2>
      <div class="flex flex-col h-full">
        <!-- 标题 -->
        <!-- <div class="text-center py-2">
          <span class="text-[#00eeff] font-bold text-2xl 4xl:text-2xl 3xl:text-sm">82522504270042水表</span>

        </div> -->

        <!-- 内容区域 -->
        <div class="content-grid">
          <!-- 总用水量 -->
          <!-- <div class="data-card total-water">
            <div class="card-header">
              <div class="card-icon">💧</div>
              <div class="card-title">总用水量</div>
            </div>
            <div class="card-content">
              <div class="value-row">
                <div class="value-item">
                  <div class="value-label">标准值</div>
                  <div class="value-display">
                    <dv-digital-flop :config="standardTotalConfig" />
                  </div>
                </div>
                <div class="value-item">
                  <div class="value-label">实际值</div>
                  <div class="value-display">
                    <dv-digital-flop :config="actualTotalConfig" />
                  </div>
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-item">
                  <span class="comparison-label">同比：</span>
                  <span :class="{
                    'comparison-value increase': dayDiff > 0,
                    'comparison-value decrease': dayDiff < 0,
                    'comparison-value neutral': dayDiff === 0
                  }">
                    {{dayDiff > 0 ? '↑' : dayDiff < 0 ? '↓' : '→'}}{{Math.abs(dayDiff)}} 吨
                  </span>
                </div>
              </div>
            </div>
          </div> -->

          <!-- 月用水量 -->
          <div class="data-card monthly-water" @click="openMonthWaterDialog">
            <div class="card-header">
              <div class="card-icon">📅</div>
              <div class="card-title">月用水量</div>
            </div>
            <div class="card-content">
              <div class="value-row">
                <div class="value-item">
                  <div class="value-label">标准值</div>
                  <div class="value-display">
                    <dv-digital-flop :config="standardMonthConfig" />
                  </div>
                </div>
                <div class="value-item">
                  <div class="value-label">实际值</div>
                  <div class="value-display">
                    <dv-digital-flop :config="actualMonthConfig" />
                  </div>
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-item">
                  <span class="comparison-label">同比：</span>
                  <span :class="{
                    'comparison-value increase': monthDiff > 0,
                    'comparison-value decrease': monthDiff < 0,
                    'comparison-value neutral': monthDiff === 0
                  }">
                    {{monthDiff > 0 ? '↑' : monthDiff < 0 ? '↓' : '→'}}{{Math.abs(monthDiff)}}吨
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 日用水量 -->
          <div class="data-card daily-water" @click="openDailyWaterDialog">
            <div class="card-header">
              <div class="card-icon">📊</div>
              <div class="card-title">日用水量</div>
            </div>
            <div class="card-content">
              <div class="value-row">
                <div class="value-item">
                  <div class="value-label">标准值</div>
                  <div class="value-display">
                    <dv-digital-flop :config="standardDayConfig" />
                  </div>
                </div>
                <div class="value-item">
                  <div class="value-label">实际值</div>
                  <div class="value-display">
                    <dv-digital-flop :config="actualDayConfig" />
                  </div>
                </div>
              </div>
              <div class="comparison-row">
                <div class="comparison-item">
                  <span class="comparison-label">同比：</span>
                  <span :class="{
                    'comparison-value increase': dayDiff > 0,
                    'comparison-value decrease': dayDiff < 0,
                    'comparison-value neutral': dayDiff === 0
                  }">
                    {{dayDiff > 0 ? '↑' : dayDiff < 0 ? '↓' : '→'}}{{Math.abs(dayDiff)}}吨
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 添加填写原因按钮 -->
        <div class="reason-section" v-if="dayDiff > 0 || monthDiff > 0">
          <div class="reason-info">
            <span class="reason-label">超过原因：</span>
            <span class="reason-text">{{ waterReason || '暂无' }}</span>
          </div>
          <button class="reason-btn" @click="showReasonDialog = true">
            <span class="btn-icon">📝</span>
            填写原因
          </button>
        </div>
      </div>
    </dv-border-box-2>
    
    <!-- 原因填写弹窗 -->
    <el-dialog
      v-model="showReasonDialog"
      title="填写超支原因"
      width="500px"
      class="reason-dialog"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <div class="form-item">
          <label class="form-label">水表编号：</label>
          <span class="form-value">82522504270042</span>
        </div>
        <div class="form-item">
          <label class="form-label">超支数值：</label>
          <span class="form-value exceeded">{{ (dayDiff > 0 ? dayDiff : monthDiff) > 0 ? '+' : '' }}{{ dayDiff > 0 ? dayDiff : monthDiff }}吨</span>
        </div>
        <div class="form-item">
          <label class="form-label">超支原因：</label>
          <el-input
            v-model="reasonInput"
            type="textarea"
            :rows="4"
            placeholder="请输入超支原因..."
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showReasonDialog = false">取消</el-button>
          <el-button type="primary" @click="submitReason" :loading="submitting">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 车间卡片区域 -->
    <div class="workshop-section">
      <div class="workshop-header">
        <span class="workshop-header-title">⚡ 车间耗电</span>
        <span class="workshop-header-tip">点击卡片查看详情</span>
      </div>
      <div class="workshop-grid">
        <div
          v-for="dept in workshopList"
          :key="dept.code"
          class="workshop-card"
          @click="openWorkshopDetail(dept)"
        >
          <div class="workshop-card-name">{{ dept.name }}</div>
          <div class="workshop-card-stats">
            <div class="workshop-stat">
              <span class="ws-label">今日</span>
              <span class="ws-value">{{ dept.dayPower }} kWh</span>
            </div>
            <div class="workshop-stat">
              <span class="ws-label">本月</span>
              <span class="ws-value">{{ dept.monthPower }} kWh</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 车间耗电详情弹窗 -->
    <el-dialog
      v-model="showWorkshopDialog"
      :title="currentWorkshop ? currentWorkshop.name + ' 耗电详情' : ''"
      width="680px"
      class="workshop-dialog"
      :close-on-click-modal="true"
    >
      <div class="workshop-detail-content" v-if="workshopDetailList.length > 0">
        <div class="workshop-summary">
          <div class="ws-summary-item">
            <span class="ws-summary-label">今日总耗电</span>
            <span class="ws-summary-value day">{{ workshopDayTotal }} kWh</span>
          </div>
          <div class="ws-summary-item">
            <span class="ws-summary-label">本月总耗电</span>
            <span class="ws-summary-value month">{{ workshopMonthTotal }} kWh</span>
          </div>
        </div>
        <el-table :data="workshopDetailList" stripe class="workshop-table" header-cell-class-name="ws-table-header">
          <el-table-column prop="mach_name" label="机台名称" align="center" />
          <el-table-column prop="meter_code" label="电表编号" align="center" width="160" />
          <el-table-column prop="day_power" label="今日耗电(kWh)" align="center">
            <template #default="{ row }">
              <span :class="row.day_power < 0 ? 'val-neg' : 'val-pos'">{{ row.day_power.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="month_power" label="本月耗电(kWh)" align="center">
            <template #default="{ row }">
              <span :class="row.month_power < 0 ? 'val-neg' : 'val-pos'">{{ row.month_power.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="workshop-empty">暂无数据</div>
      <template #footer>
        <el-button @click="showWorkshopDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 日用水量详情弹窗 -->
    <el-dialog
      v-model="showDailyWaterDialog"
      title="💧 日用水量详情"
      width="600px"
      class="water-detail-dialog"
      :close-on-click-modal="true"
    >
      <div class="water-detail-content">
        <div class="water-summary">
          <div class="ws-summary-item">
            <span class="ws-summary-label">总日用水量</span>
            <span class="ws-summary-value day">{{ dailyWaterTotal }} 吨</span>
          </div>
        </div>
        <el-table :data="waterMeterList" stripe class="water-table">
          <el-table-column prop="mach_name" label="机台名称" align="center" />
          <el-table-column prop="meter_code" label="水表编号" align="center" width="160" />
          <el-table-column prop="day_power" label="今日用水量(吨)" align="center">
            <template #default="{ row }">
              <span class="water-val">{{ Number(row.day_power || 0).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showDailyWaterDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 月用水量详情弹窗 -->
    <el-dialog
      v-model="showMonthWaterDialog"
      title="💧 月用水量详情"
      width="600px"
      class="water-detail-dialog"
      :close-on-click-modal="true"
    >
      <div class="water-detail-content">
        <div class="water-summary">
          <div class="ws-summary-item">
            <span class="ws-summary-label">总月用水量</span>
            <span class="ws-summary-value month">{{ monthWaterTotal }} 吨</span>
          </div>
        </div>
        <el-table :data="waterMeterList" stripe class="water-table">
          <el-table-column prop="mach_name" label="机台名称" align="center" />
          <el-table-column prop="meter_code" label="水表编号" align="center" width="160" />
          <el-table-column prop="month_power" label="本月用水量(吨)" align="center">
            <template #default="{ row }">
              <span class="water-val">{{ Number(row.month_power || 0).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="showMonthWaterDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch, ref, onMounted, onUnmounted } from 'vue'
import { useEnergyStore } from '@/store/energy'
import { ElMessage } from 'element-plus'
import { getRawMaterialMonitoringAdd } from '@/api/getnewInjection'
import { getPowerByCode, type PowerByCodeItem } from '@/api/enery'

const energyStore = useEnergyStore()

// 原因填写相关变量
const showReasonDialog = ref(false)
const reasonInput = ref('')
const submitting = ref(false)
const waterReason = ref('')

// 响应式窗口宽度
const windowWidth = ref(window.innerWidth)

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// 计算数字翻牌器的字体大小
const getFontSize = () => {
  if (windowWidth.value >= 2500) { // 4xl
    return 25
  } else if (windowWidth.value >= 1850) { // 3xl
    return 13
  } else if (windowWidth.value >= 1536) { // 2xl
    return 26
  } else if (windowWidth.value >= 1280) { // xl
    return 24
  } else if (windowWidth.value >= 1024) { // lg
    return 22
  } else if (windowWidth.value >= 768) { // md
    return 20
  } else if (windowWidth.value >= 640) { // sm
    return 18
  } else {
    return 16
  }
}
// 水表数据计算
const dailyWaterData = computed(() => {
  const waterData = energyStore.dailyWaterData
  return waterData.length > 0 ? waterData[0] : null
})

const monthlyWaterData = computed(() => {
  const waterData = energyStore.monthlyWaterData
  return waterData.length > 0 ? waterData[0] : null
})

// 计算用水量数据
const actualDay = computed(() => dailyWaterData.value?.numberPower || 0)
const actualMonth = computed(() => monthlyWaterData.value?.numberPower || 0)
const actualTotal = computed(() => actualMonth.value) // 目前以月用水量作为总用水量

// 标准值设为实际值的120%
const standardDay = computed(() => Math.round(actualDay.value * 1.2)) // 日标准用水量 = 实际值 * 120%
const standardMonth = computed(() => Math.round(actualMonth.value * 1.2)) // 月标准用水量 = 实际值 * 120%  
const standardTotal = computed(() => Math.round(actualTotal.value * 1.2)) // 总标准用水量 = 实际值 * 120%

// 差值计算
const dayDiff = computed(() => actualDay.value - standardDay.value)
const monthDiff = computed(() => actualMonth.value - standardMonth.value)



// 配置对象
const standardTotalConfig = reactive({
  number: [0],
  content: '{nt}吨',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualTotalConfig = reactive({
  number: [0],
  content: '{nt}吨',
  style: { fontSize: 24, fill: '#00eeff' }
})

const standardMonthConfig = reactive({
  number: [0],
  content: '{nt}吨',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualMonthConfig = reactive({
  number: [0],
  content: '{nt}吨',
  style: { fontSize: 24, fill: '#00eeff' }
})

const standardDayConfig = reactive({
  number: [0],
  content: '{nt}吨',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualDayConfig = reactive({
  number: [0],
  content: '{nt}吨',
  style: { fontSize: 24, fill: '#00eeff' }
})

// 水位图配置
const waterConfig1 = reactive({
  data: [0],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

const waterConfig2 = reactive({
  data: [0],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

const waterConfig3 = reactive({
  data: [0],
  shape: 'round',
  waveHeight: 0.3,
  waveNum: 2,
  colors: ['#00eeff', '#0066ff'],
  borderWidth: 2,
  borderColor: '#0066ff',
  borderRadius: 5
})

// 监听数据变化并更新配置
watch([actualTotal, actualMonth, actualDay, standardTotal, standardMonth, standardDay, windowWidth], () => {
  // 更新总用水量配置
  standardTotalConfig.number = [standardTotal.value]
  standardTotalConfig.style.fontSize = getFontSize()
  actualTotalConfig.number = [actualTotal.value]
  actualTotalConfig.style.fontSize = getFontSize()
  // 水位图显示：实际值/标准值(120%) = 实际值/(实际值*1.2) ≈ 83.33%，表示用水效率（保留2位小数避免精度问题）
  const totalRatio = standardTotal.value > 0 ? Math.min(actualTotal.value / standardTotal.value * 100, 100) : 0
  waterConfig1.data = [Math.round(totalRatio * 100) / 100]

  // 更新月用水量配置
  standardMonthConfig.number = [standardMonth.value]
  standardMonthConfig.style.fontSize = getFontSize()
  actualMonthConfig.number = [actualMonth.value]
  actualMonthConfig.style.fontSize = getFontSize()
  // 月用水效率：实际值相对于120%标准值的比例（保留2位小数避免精度问题）
  const monthRatio = standardMonth.value > 0 ? Math.min(actualMonth.value / standardMonth.value * 100, 100) : 0
  waterConfig2.data = [Math.round(monthRatio * 100) / 100]

  // 更新日用水量配置
  standardDayConfig.number = [standardDay.value]
  standardDayConfig.style.fontSize = getFontSize()
  actualDayConfig.number = [actualDay.value]
  actualDayConfig.style.fontSize = getFontSize()
  // 日用水效率：实际值相对于120%标准值的比例（保留2位小数避免精度问题）
  const dayRatio = standardDay.value > 0 ? Math.min(actualDay.value / standardDay.value * 100, 100) : 0
  waterConfig3.data = [Math.round(dayRatio * 100) / 100]
}, { immediate: true })

// 添加调试信息
watch([actualTotal, actualMonth, actualDay, standardTotal, standardMonth, standardDay], () => {
  const dayRatioRaw = actualDay.value / standardDay.value
  const monthRatioRaw = actualMonth.value / standardMonth.value
  const totalRatioRaw = actualTotal.value / standardTotal.value
  
  console.log('🔍 水表数据调试：', {
    actualDay: actualDay.value,
    standardDay: standardDay.value,
    dayRatio: dayRatioRaw,
    dayRatioFixed: Math.round(dayRatioRaw * 100 * 100) / 100,
    actualMonth: actualMonth.value,
    standardMonth: standardMonth.value,
    monthRatio: monthRatioRaw,
    monthRatioFixed: Math.round(monthRatioRaw * 100 * 100) / 100,
    actualTotal: actualTotal.value,
    standardTotal: standardTotal.value,
    totalRatio: totalRatioRaw,
    totalRatioFixed: Math.round(totalRatioRaw * 100 * 100) / 100
  })
}, { immediate: true })

console.log('💧 Line2水表组件：使用store中的真实API数据')

// 提交原因方法
const submitReason = async () => {
  if (!reasonInput.value.trim()) {
    ElMessage.warning('请输入超支原因')
    return
  }

  submitting.value = true
  try {
    // 调用API接口提交原因
    const res = await getRawMaterialMonitoringAdd('82522504270042', reasonInput.value.trim())
    if (res.code === 200) {
      // 更新本地显示的原因
      waterReason.value = reasonInput.value.trim()
      
      ElMessage.success('原因提交成功')
      showReasonDialog.value = false
      reasonInput.value = ''
    } else {
      ElMessage.error('提交失败，请稍后再试')
    }
  } catch (error) {
    console.error('提交原因失败:', error)
    ElMessage.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

// ========== 车间耗电相关 ==========
const workshopList = ref([
  { code: '1001', name: '金工一部冲中压', dayPower: 0, monthPower: 0 },
  { code: '1002', name: '注塑部', dayPower: 0, monthPower: 0 },
  { code: '1003', name: '金工一部焊接', dayPower: 0, monthPower: 0 },
  { code: '2006', name: '金工二部焊接', dayPower: 0, monthPower: 0 },
  { code: '2007', name: '金工二部涂装', dayPower: 0, monthPower: 0 },
])

const showWorkshopDialog = ref(false)
const currentWorkshop = ref<{ code: string; name: string } | null>(null)
const workshopDetailList = ref<PowerByCodeItem[]>([])

// ========== 金工二部水表相关 ==========
interface WaterMeterItem {
  meter_code: string
  mach_name: string
  day_power: number
  month_power: number
}

const waterMeterList = ref<WaterMeterItem[]>([])
const showDailyWaterDialog = ref(false)
const showMonthWaterDialog = ref(false)

// 获取水表数据
const fetchWaterMeterData = async () => {
  try {
    const res = await getPowerByCode('waterMeter')
    if (res.code === 200 && res.data) {
      waterMeterList.value = res.data as WaterMeterItem[]
    }
  } catch (e) {
    console.error('获取金工二部水表数据失败', e)
  }
}

// 点击日用水量卡片
const openDailyWaterDialog = () => {
  showDailyWaterDialog.value = true
}

// 点击月用水量卡片
const openMonthWaterDialog = () => {
  showMonthWaterDialog.value = true
}

// 计算水表汇总
const dailyWaterTotal = computed(() =>
  waterMeterList.value.reduce((s, i) => s + (Number(i.day_power) || 0), 0).toFixed(2)
)
const monthWaterTotal = computed(() =>
  waterMeterList.value.reduce((s, i) => s + (Number(i.month_power) || 0), 0).toFixed(2)
)

// 计算汇总
const workshopDayTotal = computed(() =>
  workshopDetailList.value.reduce((s, i) => s + i.day_power, 0).toFixed(2)
)
const workshopMonthTotal = computed(() =>
  workshopDetailList.value.reduce((s, i) => s + i.month_power, 0).toFixed(2)
)

// 初始化时获取1002的车间数据作为示例展示
onMounted(async () => {
  try {
    const res = await getPowerByCode('1002')
    if (res.code === 200 && res.data) {
      const data = res.data as PowerByCodeItem[]
      const daySum = data.reduce((s, i) => s + i.day_power, 0)
      const monthSum = data.reduce((s, i) => s + i.month_power, 0)
      workshopList.value = workshopList.value.map(w => {
        if (w.code === '1002') return { ...w, dayPower: daySum, monthPower: monthSum }
        return w
      })
    }
  } catch (e) {
    console.error('获取车间耗电数据失败', e)
  }
  // 获取金工二部水表数据
  fetchWaterMeterData()
})

// 点击卡片打开详情
const openWorkshopDetail = async (dept: { code: string; name: string }) => {
  currentWorkshop.value = dept
  showWorkshopDialog.value = true
  workshopDetailList.value = []
  try {
    const res = await getPowerByCode(dept.code)
    if (res.code === 200) {
      workshopDetailList.value = res.data || []
    }
  } catch (e) {
    console.error('获取详情失败', e)
  }
}
</script>

<style scoped>
/* 内容网格布局 - 默认样式 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
  flex: 1;
  align-items: stretch; /* 确保所有卡片高度一致 */
}

/* 2K分辨率 (2560x1440) 样式 */
@media (min-width: 1921px) and (max-width: 2560px) {
  .content-grid {
    gap: 20px;
    padding: 20px;
  }
  
  .data-card {
    padding: 20px;
    min-height: 180px; /* 增加最小高度 */
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .value-label {
    font-size: 20px;
  }
  
  .comparison-label,
  .comparison-value {
    font-size: 14px;
  }
  
  :deep(.dv-digital-flop) {
    width: 120px;
    height: 32px;
  }
}

/* 1080p分辨率 (1920x1080) 样式 */
@media (min-width: 1600px) and (max-width: 1920px) {
  .content-grid {
    gap: 16px;
    padding: 16px;
    /* padding-top: 0%; */
  }
  
  .data-card {
    padding: 16px;
    min-height: 160px; /* 增加最小高度 */
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .value-label {
    font-size: 20px;
    flex-direction: row;
  }
  
  .comparison-label,
  .comparison-value {
    font-size: 12px;
  }
  
  :deep(.dv-digital-flop) {
    width: 100px;
    height: 28px;
  }
}

/* 小屏1080p (1366x768) 样式 */
@media (min-width: 1200px) and (max-width: 1599px) {
  .content-grid {
    gap: 12px;
    padding: 12px;
  }
  
  .data-card {
    padding: 12px;
    min-height: 150px; /* 增加最小高度 */
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .value-label {
    font-size: 15px;
  }
  
  .comparison-label,
  .comparison-value {
    font-size: 11px;
  }
  
  :deep(.dv-digital-flop) {
    width: 90px;
    height: 26px;
  }
}

/* 平板/小屏 (768px-1199px) */
@media (min-width: 768px) and (max-width: 1199px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;
  }
  
  .data-card {
    padding: 14px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .value-label {
    font-size: 12px;
  }
  
  .comparison-label,
  .comparison-value {
    font-size: 12px;
  }
  
  :deep(.dv-digital-flop) {
    width: 100px;
    height: 28px;
  }
}

/* 移动端 (<768px) */
@media (max-width: 767px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
  
  .data-card {
    padding: 14px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .value-label {
    font-size: 12px;
  }
  
  .comparison-label,
  .comparison-value {
    font-size: 12px;
  }
  
  :deep(.dv-digital-flop) {
    width: 100px;
    height: 28px;
  }
}

/* 数据卡片样式 */
.data-card {
  background: linear-gradient(135deg, rgba(0, 238, 255, 0.08), rgba(0, 102, 255, 0.08));
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 140px;
  height: 100%; /* 让卡片填满网格单元格的高度 */
  display: flex;
  flex-direction: column;
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00eeff, #0066ff);
}

.data-card:hover {
  border-color: rgba(0, 238, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 238, 255, 0.1);
  transform: translateY(-2px);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 6px;
}

.card-icon {
  font-size: 20px;
  opacity: 0.8;
}

.card-title {
  color: #00eeff;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

/* 卡片内容 */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1; /* 让内容区域填充剩余空间 */
  justify-content: space-between; /* 在内容之间分配空间 */
}

/* 数值行 */
.value-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 4px;
}

.value-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(0, 238, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.15);
  border-radius: 6px;
  padding: 8px 4px;
}

.value-label {
  color: #ffffff;
  font-size: 20px;
  opacity: 0.9;
  text-align: center;
  font-weight: 500;
}

.value-display {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 28px;
  background: rgba(0, 238, 255, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
}

/* 比较行 */
.comparison-row {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0, 238, 255, 0.12);
  border-radius: 16px;
  border: 1px solid rgba(0, 238, 255, 0.25);
  box-shadow: 0 2px 4px rgba(0, 238, 255, 0.1);
}

.comparison-label {
  color: #ffffff;
  font-size: 20px;
  opacity: 0.9;
  font-weight: 500;
}

.comparison-value {
  font-weight: 600;
  font-size: 11px;
}

.comparison-value.increase {
  color: #ff6b6b;
  text-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
}

.comparison-value.decrease {
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.comparison-value.neutral {
  color: #94a3b8;
}

/* 数字翻牌器样式 */
:deep(.dv-digital-flop) {
  width: 100px;
  height: 28px;
}

/* 原因填写相关样式 */
.reason-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 238, 255, 0.2);
}

.reason-info {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.reason-label {
  color: #fff;
  font-size: 9px;
  margin-right: 4px;
}

.reason-text {
  color: #ffaa00;
  font-size: 9px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reason-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 4px;
  padding: 3px 6px;
  color: white;
  font-size: 9px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.reason-btn:hover {
  background: linear-gradient(135deg, #ff5252, #ff7676);
  transform: translateY(-1px);
}

.btn-icon {
  margin-right: 3px;
}

/* 弹窗样式 */
.reason-dialog :deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
}

.reason-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #2a2a2a, #333);
  border-bottom: 1px solid #444;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.reason-dialog :deep(.el-dialog__title) {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.reason-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: #1a1a1a;
}

.reason-dialog :deep(.el-dialog__footer) {
  background: #1a1a1a;
  border-top: 1px solid #333;
  padding: 16px 24px;
  border-radius: 0 0 12px 12px;
}

.dialog-content {
  color: #fff;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-label {
  width: 80px;
  color: #ccc;
  font-size: 14px;
}

.form-value {
  flex: 1;
  color: #fff;
  font-size: 14px;
}

.form-value.exceeded {
  color: #ff6b6b;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-textarea__inner) {
  background: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
}

:deep(.el-textarea__inner:focus) {
  border-color: #00eeff;
}

:deep(.el-button) {
  background: #333;
  border: 1px solid #555;
  color: #fff;
}

:deep(.el-button--primary) {
  background: #00eeff;
  border-color: #00eeff;
  color: #000;
}

:deep(.el-button--primary:hover) {
  background: #00ccdd;
  border-color: #00ccdd;
}

/* 车间卡片区域 */
.workshop-section {
  border-top: 1px solid rgba(0, 238, 255, 0.15);
  padding: 6px 12px 8px;
}

.workshop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.workshop-header-title {
  color: #00eeff;
  font-size: 12px;
  font-weight: 600;
}

.workshop-header-tip {
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
}

.workshop-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.workshop-card {
  background: linear-gradient(135deg, rgba(0, 238, 255, 0.06), rgba(0, 102, 255, 0.06));
  border: 1px solid rgba(0, 238, 255, 0.25);
  border-radius: 6px;
  padding: 8px 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.workshop-card:hover {
  border-color: rgba(0, 238, 255, 0.55);
  box-shadow: 0 3px 12px rgba(0, 238, 255, 0.15);
  transform: translateY(-2px);
}

.workshop-card-name {
  color: #00eeff;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workshop-card-stats {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.workshop-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ws-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 9px;
}

.ws-value {
  color: #fff;
  font-size: 10px;
  font-weight: 600;
}

/* 弹窗样式 */
.workshop-dialog :deep(.el-dialog) {
  background: #0d1b2a;
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 12px;
}

.workshop-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #1a3a5c, #0d2a4a);
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
  padding: 16px 24px;
  border-radius: 12px 12px 0 0;
}

.workshop-dialog :deep(.el-dialog__title) {
  color: #00eeff;
  font-size: 16px;
  font-weight: 600;
}

.workshop-dialog :deep(.el-dialog__body) {
  padding: 20px 24px;
  background: #0d1b2a;
}

.workshop-dialog :deep(.el-dialog__footer) {
  background: #0d1b2a;
  border-top: 1px solid rgba(0, 238, 255, 0.1);
  padding: 12px 24px;
  border-radius: 0 0 12px 12px;
}

.workshop-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 14px;
}

.ws-summary-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 238, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.12);
  border-radius: 6px;
  padding: 8px 12px;
}

.ws-summary-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.ws-summary-value {
  font-size: 16px;
  font-weight: 700;
}

.ws-summary-value.day { color: #f59e0b; }
.ws-summary-value.month { color: #34d399; }

.workshop-table {
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
}

.workshop-table :deep(.el-table__header-wrapper th) {
  background: rgba(0, 238, 255, 0.08) !important;
  color: #00eeff;
  font-weight: 600;
  font-size: 12px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2) !important;
}

.workshop-table :deep(.el-table__body-wrapper td) {
  color: #fff;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.workshop-table :deep(.el-table__body-wrapper tr:nth-child(even) td) {
  background: rgba(0, 238, 255, 0.02) !important;
}

.workshop-table :deep(.el-table__body-wrapper tr:hover > td) {
  background: rgba(0, 238, 255, 0.04) !important;
}

.val-pos { color: #4ade80; font-weight: 600; }
.val-neg { color: #f87171; font-weight: 600; }

.workshop-empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 40px 0;
  font-size: 13px;
}

.workshop-dialog :deep(.el-button) {
  background: #1e3a5f;
  border: 1px solid rgba(0, 238, 255, 0.3);
  color: #00eeff;
}

.workshop-dialog :deep(.el-button:hover) {
  background: rgba(0, 238, 255, 0.1);
  border-color: #00eeff;
  color: #00eeff;
}

/* 水表详情弹窗 */
.water-detail-dialog :deep(.el-dialog) {
  background: #0d1b2a;
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 12px;
}

.water-detail-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #1a3a5c, #0d2a4a);
  border-bottom: 1px solid rgba(0, 180, 255, 0.2);
  padding: 16px 24px;
  border-radius: 12px 12px 0 0;
}

.water-detail-dialog :deep(.el-dialog__title) {
  color: #00b4ff;
  font-size: 16px;
  font-weight: 600;
}

.water-detail-dialog :deep(.el-dialog__body) {
  padding: 20px 24px;
  background: #0d1b2a;
}

.water-detail-dialog :deep(.el-dialog__footer) {
  background: #0d1b2a;
  border-top: 1px solid rgba(0, 180, 255, 0.1);
  padding: 12px 24px;
  border-radius: 0 0 12px 12px;
}

.water-detail-dialog :deep(.el-button) {
  background: #1e3a5f;
  border: 1px solid rgba(0, 180, 255, 0.3);
  color: #00b4ff;
}

.water-detail-dialog :deep(.el-button:hover) {
  background: rgba(0, 180, 255, 0.1);
  border-color: #00b4ff;
  color: #00b4ff;
}

.water-detail-content {
  color: #000000;
}

.water-summary {
  margin-bottom: 14px;
}

.water-table {
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
}

.water-table :deep(.el-table__header-wrapper th) {
  background: rgba(0, 180, 255, 0.08) !important;
  color: #00b4ff;
  font-weight: 600;
  font-size: 12px;
  border-bottom: 1px solid rgba(0, 180, 255, 0.2) !important;
}

.water-table :deep(.el-table__body-wrapper td) {
  color: #000000;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.water-table :deep(.el-table__body-wrapper tr:nth-child(even) td) {
  background: rgba(0, 180, 255, 0.02) !important;
}

.water-table :deep(.el-table__body-wrapper tr:hover > td) {
  background: rgba(0, 180, 255, 0.04) !important;
}

.water-val { color: #00b4ff; font-weight: 600; }

.water-meter-info {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(0, 180, 255, 0.05);
  border: 1px solid rgba(0, 180, 255, 0.15);
  border-radius: 8px;
}

.wm-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.wm-info-row:last-child {
  margin-bottom: 0;
}

.wm-info-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  width: 80px;
}

.wm-info-value {
  color: #000000;
  font-size: 13px;
  font-weight: 500;
}
</style>