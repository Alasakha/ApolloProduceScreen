<template>
  <div class='pl-5 pt-1'>
    <div class="flex justify-center items-center text-lg text-white font-bold relative">
      <p class="tracking-widest text-xl">原材料投入产出监控</p>
      <el-tooltip content="正常：±5% | 预警：±5%~±10% | 报警：超出±10%" placement="bottom">
        <el-icon class="ml-2 cursor-pointer" style="color: #409eff; font-size: 18px; vertical-align: middle;">
          <InfoFilled />
        </el-icon>
      </el-tooltip>
    </div>
    <div class="relative" style="width:47vw;height:19vh;">
      <materialScrollBoard 
        :config="config" 
        :rowClassName="getRowClassName"
        style="width:100%;height:100%;"
      />
      <div v-if="boardLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <el-icon class="is-loading" style="font-size: 24px; color: #409eff;">
          <Loading />
        </el-icon>
      </div>
    </div>
    <div class="huiliao-panel">
      <div class="huiliao-header">回料情况</div>
      <div class="huiliao-grid">
        <div
          v-for="item in huiliaoDisplay"
          :key="item.label"
          class="huiliao-item"
        >
          <div class="huiliao-label">{{ item.label }}</div>
          <div class="huiliao-value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="`原材料投入产出监控明细 - ${timeRangeText}`" width="70vw" >
      <el-table :data="tableData"  :loading="tableLoading" style="width: 100%" >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column v-for="(col, idx) in dialogHeaders" :key="col" :label="col" :prop="'col' + idx" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted,onBeforeUnmount, computed } from 'vue'
import { getInputOutput } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
import  {ElMessage} from 'element-plus'
import { Loading, InfoFilled } from '@element-plus/icons-vue'
import materialScrollBoard from '@/components/datav/MaterialScrollBoard.vue'

// 时间维度：month-本月, week-本周, day-本日
const timeRange = ref<'month' | 'week' | 'day'>('month')

// 格式化日期为 YYYY-MM-DD（使用本地时间，避免时区问题）
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取日期范围
// 修正：月的开始时间应为本月1号，不是上个月31号
const getDateRange = (range: 'month' | 'week' | 'day') => {
  const today = new Date()
  const endDay = formatLocalDate(today) // YYYY-MM-DD
  let startDay = ''
  if (range === 'day') {
    startDay = endDay
  } else if (range === 'week') {
    // 以周一为一周开始
    const dayOfWeek = today.getDay()
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // 周一为0
    const monday = new Date(today)
    monday.setDate(today.getDate() - diff)
    startDay = formatLocalDate(monday)
  } else { // month
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    startDay = formatLocalDate(firstDay)
  }
  return { startDay, endDay }
}

// 时间维度文本
const timeRangeText = computed(() => {
  const map = { month: '本月', week: '本周', day: '本日' }
  return map[timeRange.value]
})

// 本月表头
const monthHeaders = ['材料规格','月计划产出数', '月计划用量', '实际产出数','实际用量', '产出回料重量', '产出比', '损耗率']
// 本周表头
const weekHeaders = [ '材料规格',  '周计划产出数','周计划用量', '实际产出数','实际用量',  '产出回料重量', '产出比', '损耗率']
// 本日表头
const dayHeaders = ['材料规格',  '日计划产出数','日计划用量', '实际产出数','实际用量',  '产出回料重量', '产出比', '损耗率']

// 滚动表格配置
const config = reactive({
  header: monthHeaders,
  data: [],
  index: true,
  align: ['center','center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [50],
  headerHeight: 20
})

// 对话框表头
const dialogHeaders = computed(() => {
  if (timeRange.value === 'month') return monthHeaders
  if (timeRange.value === 'week') return weekHeaders
  return dayHeaders
})

// 对话框表格数据
const tableData = computed(() => {
  return config.data.map(row => {
    const obj: Record<string, any> = {};
    row.forEach((val, idx) => {
      obj['col' + idx] = val;
    });
    return obj;
  });
})

const dialogVisible = ref(false);
const tableLoading = ref(false);
const boardLoading = ref(false);
const huiliaoState = reactive({
  spec: '-',
  totalInventory: '-',
  todayInput: '-',
  todayRecycle: '-',
  accumulatedInventory: '-'
})

const huiliaoDisplay = computed(() => ([
  { label: '回料规格', value: huiliaoState.spec },
  { label: '回料总库存', value: huiliaoState.totalInventory },
  { label: '当天投入量', value: huiliaoState.todayInput },
  { label: '当天回收量', value: huiliaoState.todayRecycle },
  { label: '回料累计库存总量', value: huiliaoState.accumulatedInventory }
]))

/**
 * 计算产出比
 * 计算公式：(月计划用量/月计划产出)/((实际用量+产出回料重量)/实际产出)
 * @param planUsage 月计划用量
 * @param planOutput 月计划产出
 * @param actualUsage 实际用量
 * @param recycleWeight 产出回料重量
 * @param actualOutput 实际产出
 * @returns 产出比百分比字符串，以及数值（用于判断预警/报警）
 */
const calculateOutputRatio = (
  planUsage: number, 
  planOutput: number, 
  actualUsage: number, 
  recycleWeight: number, 
  actualOutput: number
) => {
  // 分母检查：月计划产出和实际产出都不能为0
  if (!planOutput || planOutput === 0 || !actualOutput || actualOutput === 0) {
    return { display: '0%', value: 0 }
  }
  
  // 计算公式：(月计划用量/月计划产出)/((实际用量+产出回料重量)/实际产出)
  const planRatio = planUsage / planOutput  // 月计划用量/月计划产出
  const actualRatio = (actualUsage + recycleWeight) / actualOutput  // (实际用量+产出回料重量)/实际产出
  
  if (!actualRatio || actualRatio === 0) {
    return { display: '0%', value: 0 }
  }
  
  const ratio = planRatio / actualRatio
  const ratioPercent = ratio * 100
  
  return {
    display: formatNumberWithoutTrailingZeros(ratioPercent, 2) + '%',
    value: ratioPercent
  }
}

/**
 * 计算损耗率
 * 计算公式：不可回收回料重量/(实际用量+产出回料重量)
 * @param irrecoverableLoss 不可回收回料重量
 * @param actualUsage 实际用量
 * @param recycleWeight 产出回料重量
 * @returns 损耗率百分比字符串
 */
const calculateLossRate = (irrecoverableLoss: number, actualUsage: number, recycleWeight: number) => {
  // 计算公式：不可回收回料重量/(实际用量+产出回料重量)
  const denominator = actualUsage + recycleWeight
  if (!denominator || denominator === 0) return '0%'
  const rate = formatNumberWithoutTrailingZeros((irrecoverableLoss / denominator) * 100, 2)
  return rate + '%'
}

/**
 * 根据产出比判断状态
 * 合理范围：±5%（95%-105%）
 * 预警：超出±5%但在±10%范围内（90%-95% 或 105%-110%）
 * 报警：超出±10%（<90% 或 >110%）
 * @param ratioPercent 产出比百分比数值
 * @returns 状态标识：'normal' | 'warning' | 'alarm'
 */
const getOutputRatioStatus = (ratioPercent: number): 'normal' | 'warning' | 'alarm' => {
  if (ratioPercent >= 95 && ratioPercent <= 105) {
    return 'normal'  // 合理范围：±5%
  } else if ((ratioPercent >= 90 && ratioPercent < 95) || (ratioPercent > 105 && ratioPercent <= 110)) {
    return 'warning'  // 预警：±5%到±10%
  } else {
    return 'alarm'  // 报警：超出±10%
  }
}

// 获取数据
const fetchData = async () => {
  boardLoading.value = true;
  tableLoading.value = true;
  try {
    const { startDay, endDay } = getDateRange(timeRange.value)
    const res = await getInputOutput(startDay, endDay);
    
    if (res && res.code === 200 && res.data) {
      const { monthData = [], weekData = [], todayData = [], huiliao = {} } = res.data
      const dataMap: Record<string, any[]> = {
        month: monthData,
        week: weekData,
        day: todayData
      }

      updateHeaders()
      config.data = formatBoardData(dataMap[timeRange.value] || [])
      updateHuiliaoInfo(huiliao)
    } else {
      config.data = []
      resetHuiliaoInfo()
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    ElMessage.error('数据获取失败');
    config.data = []
    resetHuiliaoInfo()
  } finally {
    boardLoading.value = false;
    tableLoading.value = false;
  }
}

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 清理定时器，避免组件卸载后定时器继续执行
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
});

const hasValue = (value: unknown) => value !== null && value !== undefined && value !== ''

const toNumber = (value: unknown) => {
  if (!hasValue(value)) return 0
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

// 格式化数字，去掉小数点后末尾的0
const formatNumberWithoutTrailingZeros = (num: number, digits = 2): string => {
  const fixed = num.toFixed(digits)
  // 去掉末尾的0和小数点（如果有）
  return fixed.replace(/\.?0+$/, '')
}

const formatNumberDisplay = (value: unknown, digits = 2, unit?: string) => {
  if (!hasValue(value)) return '-'
  const num = toNumber(value)
  const fixedDigits = digits !== undefined && digits !== null ? formatNumberWithoutTrailingZeros(num, digits) : `${num}`
  return unit ? `${fixedDigits}${unit}` : fixedDigits
}

// 存储每行的产出比状态，用于设置行样式
const rowStatusMap = ref<Map<number, 'normal' | 'warning' | 'alarm'>>(new Map())

const formatBoardData = (list: any[]) => {
  if (!Array.isArray(list)) return []
  
  // 清空之前的状态
  rowStatusMap.value.clear()

  return list.map((item, index) => {
    const materialSpec = item.xh_new || item.item_specification || item.item_description || '-'
    const planOutputValue = toNumber(item.ty004 ?? item.plan_output)
    const actualOutputValue = toNumber(item.qty ?? item.qty_total)
    const actualUsageValue = toNumber(item.qty_new ?? item.qty_old)
    const recycleWeightValue = toNumber(item.shuikou)
    const irrecoverableLossValue = toNumber(item.bukehuishou)
    
    // 月计划用量 = 实际用量 + 回料重量
    let planUsageValue: number
    let planUsageSource: unknown
    if (timeRange.value === 'month') {
      planUsageValue = actualUsageValue + recycleWeightValue
      planUsageSource = planUsageValue
    } else {
      planUsageSource = hasValue(item.plan_qty) ? item.plan_qty : item.qty_old
      planUsageValue = toNumber(planUsageSource)
    }

    // 使用新的产出比计算公式：(月计划用量/月计划产出)/((实际用量+产出回料重量)/实际产出)
    const outputRatioResult = calculateOutputRatio(
      planUsageValue, 
      planOutputValue, 
      actualUsageValue, 
      recycleWeightValue, 
      actualOutputValue
    )
    
    // 存储该行的产出比状态
    const status = getOutputRatioStatus(outputRatioResult.value)
    rowStatusMap.value.set(index, status)
    
    // 使用新的损耗率计算公式：不可回收回料重量/(实际用量+产出回料重量)
    const lossRate = calculateLossRate(irrecoverableLossValue, actualUsageValue, recycleWeightValue)

    return [
      materialSpec,
      formatNumberDisplay(planOutputValue, 2),
      hasValue(planUsageSource) ? `${formatNumberWithoutTrailingZeros(planUsageValue, 2)}kg` : '-',
      formatNumberDisplay(actualOutputValue, 2),
      `${formatNumberWithoutTrailingZeros(actualUsageValue, 2)}kg`,
      `${formatNumberWithoutTrailingZeros(recycleWeightValue, 2)}kg`,
      outputRatioResult.display,
      lossRate
    ]
  })
}

const updateHeaders = () => {
  if (timeRange.value === 'month') {
    config.header = monthHeaders
  } else if (timeRange.value === 'week') {
    config.header = weekHeaders
  } else {
    config.header = dayHeaders
  }
  config.align = ['center','center','center','center','center','center','center','center','center']
}

const resetHuiliaoInfo = () => {
  huiliaoState.spec = '-'
  huiliaoState.totalInventory = '-'
  huiliaoState.todayInput = '-'
  huiliaoState.todayRecycle = '-'
  huiliaoState.accumulatedInventory = '-'
}

const updateHuiliaoInfo = (payload: Record<string, any> = {}) => {
  resetHuiliaoInfo()
  huiliaoState.spec = payload.gg || payload.spec || '-'
  
  // 获取原始数值用于计算和显示
  const totalInventoryRaw = payload.zkc ?? payload.totalInventory
  const todayInputRaw = payload.todayTrl ?? payload.todayInput
  const todayRecycleRaw = payload.todayRecycle ?? payload.shuikou
  
  // 格式化显示值
  huiliaoState.totalInventory = formatNumberDisplay(totalInventoryRaw, 2, 'kg')
  huiliaoState.todayInput = formatNumberDisplay(todayInputRaw, 2, 'kg')
  huiliaoState.todayRecycle = formatNumberDisplay(todayRecycleRaw, 2, 'kg')
  
  // 获取数值用于计算
  const totalInventoryNum = toNumber(totalInventoryRaw)
  const todayInputNum = toNumber(todayInputRaw)
  const todayRecycleNum = toNumber(todayRecycleRaw)
  
  // 计算回料累计库存总量 = 总库存 - 当天投入 + 当天回收
  // 只要总库存有值，就进行计算（即使当天投入和回收为0或无效）
  if (hasValue(totalInventoryRaw)) {
    const accumulatedInventoryNum = totalInventoryNum - todayInputNum + todayRecycleNum
    // 确保计算结果正确显示，即使是0也显示
    if (Number.isFinite(accumulatedInventoryNum)) {
      huiliaoState.accumulatedInventory = formatNumberDisplay(accumulatedInventoryNum, 2, 'kg')
    } else {
      huiliaoState.accumulatedInventory = '-'
    }
  } else {
    huiliaoState.accumulatedInventory = '-'
  }
}

/**
 * 根据产出比状态设置行的CSS类名
 * @param row 行数据对象，包含 rowIndex（原始数据索引）
 * @param _rowIndex 视觉索引（滚动后位置会变化，不使用）
 * @returns CSS类名
 */
const getRowClassName = (row: any, _rowIndex: number): string => {
  const status = rowStatusMap.value.get(row.rowIndex)
  if (status === 'warning') {
    return 'output-ratio-warning'  // 预警：黄色
  } else if (status === 'alarm') {
    return 'output-ratio-alarm'  // 报警：红色
  }
  return ''  // 正常：无特殊样式
}
</script>

<style scoped>
:deep(.ScrollBoard .header) {
  display: flex;
  flex-direction: row;
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.5vw;
}

.huiliao-panel {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(9, 25, 47, 0.6);
  box-shadow: inset 0 0 12px rgba(0, 212, 255, 0.15);
}

.huiliao-header {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.huiliao-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.huiliao-item {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0, 150, 255, 0.3);
  background: rgba(0, 150, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.huiliao-label {
  color: #8bd7ff;
  font-size: 12px;
}

.huiliao-value {
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 1600px) {
  .huiliao-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 产出比预警样式（黄色） */
:deep(.output-ratio-warning) {
  background-color: rgba(255, 193, 7, 0.2) !important;
  border-left: 3px solid #ffc107;
}

:deep(.output-ratio-warning .ceil) {
  color: #ffc107 !important;
  font-weight: bold;
}

/* 产出比报警样式（红色） */
:deep(.output-ratio-alarm) {
  background-color: rgba(255, 68, 68, 0.2) !important;
  border-left: 3px solid #ff4444;
}

:deep(.output-ratio-alarm .ceil) {
  color: #ff4444 !important;
  font-weight: bold;
}

</style>