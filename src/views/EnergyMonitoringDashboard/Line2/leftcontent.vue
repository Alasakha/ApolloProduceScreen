<template>
  <div class="h-full w-full ">
    <dv-border-box-2>
      <div class="flex flex-col h-full">
        <!-- 标题 -->
        <!-- <div class="text-center py-2">
          <span class="text-[#00eeff] font-bold text-2xl 4xl:text-2xl 3xl:text-sm">82522504270042水表</span>

        </div> -->

        <!-- 内容区域 -->
        <div class="content-grid">
          <!-- 总用水量 -->
          <div class="data-card total-water">
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
                    {{dayDiff > 0 ? '↑' : dayDiff < 0 ? '↓' : '→'}}{{Math.abs(dayDiff)}}m³
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 月用水量 -->
          <div class="data-card monthly-water">
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
                    'comparison-value increase': dayDiff > 0,
                    'comparison-value decrease': dayDiff < 0,
                    'comparison-value neutral': dayDiff === 0
                  }">
                    {{dayDiff > 0 ? '↑' : dayDiff < 0 ? '↓' : '→'}}{{Math.abs(dayDiff)}}m³
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 日用水量 -->
          <div class="data-card daily-water">
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
                    {{dayDiff > 0 ? '↑' : dayDiff < 0 ? '↓' : '→'}}{{Math.abs(dayDiff)}}m³
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 添加填写原因按钮 -->
        <div class="reason-section" v-if="dayDiff > 0">
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
          <span class="form-value exceeded">{{ dayDiff > 0 ? '+' : '' }}{{ dayDiff }}m³</span>
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
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch, ref, onMounted, onUnmounted } from 'vue'
import { useEnergyStore } from '@/store/energy'
import { ElMessage } from 'element-plus'
import { getRawMaterialMonitoringAdd } from '@/api/getnewInjection'

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
// const monthDiff = computed(() => actualMonth.value - standardMonth.value)



// 配置对象
const standardTotalConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualTotalConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const standardMonthConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualMonthConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const standardDayConfig = reactive({
  number: [0],
  content: '{nt}m³',
  style: { fontSize: 24, fill: '#00eeff' }
})

const actualDayConfig = reactive({
  number: [0],
  content: '{nt}m³',
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
</script>

<style scoped>
/* 内容网格布局 - 默认样式 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
  flex: 1;
}

/* 2K分辨率 (2560x1440) 样式 */
@media (min-width: 1921px) and (max-width: 2560px) {
  .content-grid {
    gap: 20px;
    padding: 20px;
  }
  
  .data-card {
    padding: 20px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .value-label {
    font-size: 14px;
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
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .value-label {
    font-size: 12px;
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
  .value-item{

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
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .value-label {
    font-size: 11px;
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
  background: linear-gradient(135deg, rgba(0, 238, 255, 0.05), rgba(0, 102, 255, 0.05));
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  margin-bottom: 16px;
  gap: 8px;
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
  gap: 12px;
}

/* 数值行 */
.value-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.value-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.value-label {
  color: #ffffff;
  font-size: 12px;
  opacity: 0.8;
  text-align: center;
}

.value-display {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 32px;
}

/* 比较行 */
.comparison-row {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 238, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(0, 238, 255, 0.2);
}

.comparison-label {
  color: #ffffff;
  font-size: 12px;
  opacity: 0.8;
}

.comparison-value {
  font-weight: 600;
  font-size: 12px;
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
</style>