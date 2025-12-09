<template>
  <div class="work-order-closing-rate h-full flex flex-col">
    <div v-if="loading" class="loading-text">加载中...</div>
    <div v-else-if="!workOrderData || !workOrderData.categoryData" class="empty-text">暂无数据</div>
    <el-table
      v-else
      :data="tableData"
      border
      style="width: 100%"
      :row-class-name="getRowClassName"
      :span-method="objectSpanMethod"
      @row-click="handleRowClick"
      class="work-order-table"
    >
      <el-table-column prop="project" label="项目" min-width="50" align="center" />
      <el-table-column prop="category" label="分类" min-width="50" align="center" />
      <el-table-column prop="shouldComplete" label="应完成数" min-width="70" align="center" />
      <el-table-column prop="onTimeComplete" label="及时完成数" min-width="80" align="center" />
      <el-table-column prop="completionRate" label="完结率" min-width="60" align="center">
        <template #default="scope">
          <span>{{ scope.row.completionRate }}%</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 今日详细数据Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :append-to-body="true"
      :destroy-on-close="true"
      class="detail-dialog"
    >
      <div class="detail-content">
        <el-table 
          :data="detailData" 
          border 
          style="width: 100%"
          :empty-text="detailData.length ? '' : '暂无数据'"
          max-height="600"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="workCenter" label="工作中心" width="120" />
          <el-table-column prop="workNo" label="工单号" width="150" />
          <el-table-column prop="number" label="客户单号" width="150" />
          <el-table-column prop="articleNumber" label="品号" width="150" />
          <el-table-column prop="articleName" label="品名" width="200" show-overflow-tooltip />
          <el-table-column prop="specifications" label="规格" width="250" show-overflow-tooltip />
          <el-table-column prop="completionJudgment" label="完成判断" width="100" align="center">
            <template #default="scope">
              <span>{{ scope.row.completionJudgment === '1' ? '已完成' : '未完成' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productionQuantity" label="工单数量" width="120" align="right" />
          <el-table-column prop="planQuantity" label="排产数量" width="120" align="right" />
          <el-table-column prop="dateTime" label="排产日期" width="120" />
          <el-table-column prop="pgTime" label="派工日期" width="160" />
          <el-table-column prop="bgTime" label="报工日期" width="160" />
          <el-table-column prop="kzTime" label="扣账完成日期" width="160" />
          <el-table-column prop="jyTime" label="检验完成日期" width="160" />
          <el-table-column prop="inboundQuantity" label="入库数量" width="120" align="right" />
          <el-table-column prop="finalInboundQuantity" label="最后入库数量" width="140" align="right" />
          <el-table-column prop="inboundTime" label="入库时间" width="180" />
          <el-table-column prop="finalInboundTime" label="最后入库时间" width="180" />
        </el-table>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getSghGdComplete, type OrderSettlementItem } from '@/api/getStampWeldinfo'

const DEFAULT_PROD_LINE = '金工二部焊接'
type CategoryKey = 'A类' | '常规'

interface CategorySummary {
  shouldComplete: number
  onTimeComplete: number
  completionRate: number
  canClick?: boolean
}

interface CategoryStats {
  categoryA: CategorySummary
  regular: CategorySummary
}

const props = defineProps<{
  workOrderDataProp?: any  // 工单结单率数据
  prodLine?: string
}>()

const createEmptyCategoryDetails = (): Record<CategoryKey, OrderSettlementItem[]> => ({
  'A类': [],
  '常规': []
})

// 工单结单率数据
const workOrderData = ref<any>(null)
const loading = ref(false)
const monthCategoryData = ref<CategoryStats | null>(null)
const todayCategoryDetails = ref<Record<CategoryKey, OrderSettlementItem[]>>(createEmptyCategoryDetails())

const currentProdLine = computed(() => props.prodLine || DEFAULT_PROD_LINE)

const normalizeCategory = (customer?: string | null): CategoryKey => {
  const value = customer?.trim().toUpperCase()
  return value === 'A' ? 'A类' : '常规'
}

const toNumber = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 0
  }
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

const splitByCategory = (items: OrderSettlementItem[]) => {
  const result = createEmptyCategoryDetails()
  items.forEach(item => {
    const key = normalizeCategory(item.customer)
    result[key].push(item)
  })
  return result
}

const buildSummary = (items: OrderSettlementItem[]): CategorySummary => {
  const shouldComplete = items.reduce((total, item) => total + toNumber(item.productionQuantity), 0)
  const onTimeComplete = items.reduce((total, item) => total + toNumber(item.inboundQuantity), 0)
  const completionRate = shouldComplete > 0
    ? Math.round((onTimeComplete / shouldComplete) * 1000) / 10
    : 0
  return { shouldComplete, onTimeComplete, completionRate }
}

const buildFallbackMonthStats = (): CategoryStats => {
  const monthTotalPlan = workOrderData.value?.monthPlanQuantity
    ?? workOrderData.value?.monthCompletedOrders
    ?? 0
  const monthTotalInbound = workOrderData.value?.monthInboundQuantity
    ?? workOrderData.value?.onTimeOrders
    ?? 0
  const categoryAShould = Math.floor(monthTotalPlan * 0.5) || 0
  const categoryAOnTime = Math.floor(monthTotalInbound * 0.5) || 0
  const regularShould = monthTotalPlan - categoryAShould
  const regularOnTime = monthTotalInbound - categoryAOnTime

  return {
    categoryA: {
      shouldComplete: categoryAShould,
      onTimeComplete: categoryAOnTime,
      completionRate: categoryAShould > 0
        ? Math.round((categoryAOnTime / categoryAShould) * 1000) / 10
        : 0
    },
    regular: {
      shouldComplete: regularShould,
      onTimeComplete: regularOnTime,
      completionRate: regularShould > 0
        ? Math.round((regularOnTime / regularShould) * 1000) / 10
        : 0
    }
  }
}

// 将 categoryData 转换为表格数据（包含月度和每日）
const tableData = computed(() => {
  if (!workOrderData.value || !workOrderData.value.categoryData) {
    return []
  }
  const { categoryA, regular } = workOrderData.value.categoryData
  const monthStats = monthCategoryData.value || buildFallbackMonthStats()
  
  return [
    // A类 - 月度
    {
      project: 'A类工单',
      category: '月度',
      shouldComplete: monthStats.categoryA.shouldComplete,
      onTimeComplete: monthStats.categoryA.onTimeComplete,
      completionRate: monthStats.categoryA.completionRate,
      canClick: false,
      categoryType: 'A类',
      periodType: 'month'
    },
    // A类 - 每日
    {
      project: 'A类工单',
      category: '今日',
      shouldComplete: categoryA?.shouldComplete || 0,
      onTimeComplete: categoryA?.onTimeComplete || 0,
      completionRate: categoryA?.completionRate || 0,
      canClick: categoryA?.canClick || false,
      categoryType: 'A类',
      periodType: 'day'
    },
    // 常规 - 月度
    {
      project: '常规工单',
      category: '月度',
      shouldComplete: monthStats.regular.shouldComplete,
      onTimeComplete: monthStats.regular.onTimeComplete,
      completionRate: monthStats.regular.completionRate,
      canClick: false,
      categoryType: '常规',
      periodType: 'month'
    },
    // 常规 - 每日
    {
      project: '常规工单',
      category: '今日',
      shouldComplete: regular?.shouldComplete || 0,
      onTimeComplete: regular?.onTimeComplete || 0,
      completionRate: regular?.completionRate || 0,
      canClick: regular?.canClick || false,
      categoryType: '常规',
      periodType: 'day'
    }
  ]
})

// 合并单元格方法
const objectSpanMethod = ({ rowIndex, columnIndex }: any) => {
  // 只对第一列（项目列）进行合并
  if (columnIndex === 0) {
    // A类：合并前两行（索引0和1）
    if (rowIndex === 0 || rowIndex === 1) {
      if (rowIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
    // 常规：合并后两行（索引2和3）
    if (rowIndex === 2 || rowIndex === 3) {
      if (rowIndex === 2) {
        return {
          rowspan: 2,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
  }
  // 其他列不合并
  return {
    rowspan: 1,
    colspan: 1
  }
}

// 行类名函数
const getRowClassName = ({ row }: { row: any }) => {
  return row.canClick ? 'clickable-row' : ''
}

// 行点击处理
const handleRowClick = (row: any) => {
  // 只有每日数据可以点击
  if (row.canClick && row.periodType === 'day') {
    openTodayDetailDialog(row.categoryType)
  }
}

// 处理传入的数据
const processPropData = () => {
  if (props.workOrderDataProp) {
    workOrderData.value = props.workOrderDataProp
    monthCategoryData.value = props.workOrderDataProp.monthCategoryData ?? null
    todayCategoryDetails.value = createEmptyCategoryDetails()
    loading.value = false
    return true
  }
  return false
}

// 获取数据
const fetchData = async () => {
  // 如果传入了数据，优先使用传入的数据
  if (processPropData()) {
    return
  }

  loading.value = true
  try {
    const res = await getSghGdComplete(currentProdLine.value)
    if (res && res.code === 200 && res.data) {
      const monthList = res.data.orderSettlement_month || []
      const todayList = res.data.orderSettlement_today || []

      const monthSplit = splitByCategory(monthList)
      const todaySplit = splitByCategory(todayList)

      const monthStats = {
        categoryA: buildSummary(monthSplit['A类']),
        regular: buildSummary(monthSplit['常规'])
      }

      const todayStats = {
        categoryA: { ...buildSummary(todaySplit['A类']), canClick: todaySplit['A类'].length > 0 },
        regular: { ...buildSummary(todaySplit['常规']), canClick: todaySplit['常规'].length > 0 }
      }

      const monthShould = monthStats.categoryA.shouldComplete + monthStats.regular.shouldComplete
      const monthOnTime = monthStats.categoryA.onTimeComplete + monthStats.regular.onTimeComplete
      const todayShould = todayStats.categoryA.shouldComplete + todayStats.regular.shouldComplete
      const todayOnTime = todayStats.categoryA.onTimeComplete + todayStats.regular.onTimeComplete

      monthCategoryData.value = monthStats
      todayCategoryDetails.value = todaySplit

      workOrderData.value = {
        categoryData: todayStats,
        monthCategoryData: monthStats,
        monthPlanQuantity: monthShould,
        monthInboundQuantity: monthOnTime,
        monthCompletedOrders: monthList.length,
        onTimeOrders: monthOnTime,
        closingRate: monthShould > 0
          ? Math.round((monthOnTime / monthShould) * 1000) / 10
          : 0,
        todayPlanQuantity: todayShould,
        todayInboundQuantity: todayOnTime,
        todayCompletedOnTime: todayList.length,
        todayOnTimeCompleted: todayOnTime,
        todayClosingRate: todayShould > 0
          ? Math.round((todayOnTime / todayShould) * 1000) / 10
          : 0
      }
    } else {
      workOrderData.value = null
      monthCategoryData.value = null
      todayCategoryDetails.value = createEmptyCategoryDetails()
    }
  } catch (error) {
    console.error('获取工单结单率数据失败:', error)
    workOrderData.value = null
    monthCategoryData.value = null
    todayCategoryDetails.value = createEmptyCategoryDetails()
  } finally {
    loading.value = false
  }
}

// 监听 props 变化
watch(() => props.workOrderDataProp, () => {
  processPropData()
}, { deep: true })

watch(() => props.prodLine, () => {
  fetchData()
})

onMounted(() => {
  // 先尝试处理传入的数据，如果没有则调用原来的接口
  if (!processPropData()) {
    fetchData()
  }
  eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
})

// Dialog控制
const dialogVisible = ref(false)
const detailData = ref<OrderSettlementItem[]>([])
const dialogTitle = ref('今日工单详细数据')

// 打开今日详细数据Dialog
const openTodayDetailDialog = (category?: string) => {
  dialogVisible.value = true
  detailData.value = []
  dialogTitle.value = category ? `${category} - 今日工单详细数据` : '今日工单详细数据'

  if (category === 'A类' || category === '常规') {
    detailData.value = todayCategoryDetails.value[category]
  } else {
    const combined = [
      ...todayCategoryDetails.value['A类'],
      ...todayCategoryDetails.value['常规']
    ]
    detailData.value = combined
  }
}
</script>

<style scoped>
.work-order-closing-rate {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  /* padding: 8px 12px; */
  flex-direction: column;
  /* gap: 10px; */
  justify-content: space-between;
  overflow: hidden;
}

.loading-text,
.empty-text {
  color: #72f0f5;
  /* font-size: 12px; */
  text-align: center;
  /* padding: 10px; */
  opacity: 0.7;
}

/* Element Plus 表格样式覆盖 */
.work-order-table {
  flex: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.work-order-table :deep(.el-table) {
  background: rgba(10, 119, 228, 0.3);
  color: #ececec;
  width: 100% !important;
  height: 100% !important;
  table-layout: fixed;
  font-size: 12px !important;
  display: flex;
  flex-direction: column;
}

.work-order-table :deep(.el-table__body) {
  width: 100% !important;
}

.work-order-table :deep(.el-table__header) {
  width: 100% !important;
}

.work-order-table :deep(.el-table__body colgroup col),
.work-order-table :deep(.el-table__header colgroup col) {
  width: auto !important;
}

.work-order-table :deep(.el-table__header-wrapper) {
  overflow: hidden;
  flex-shrink: 0;
}

.work-order-table :deep(.el-table__body-wrapper) {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.work-order-table :deep(.el-table__header) {
  background: rgba(0, 100, 200, 0.4);
}

.work-order-table :deep(.el-table__header th) {
  background: rgb(0, 128, 255);
  border-color: rgba(0, 247, 255, 0.4);
  color: #ffffff !important;
  font-weight: 600;
  font-size: 12px !important;
  padding: 6px 4px !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.2;
  height: auto !important;
  width: auto;
}

.work-order-table :deep(.el-table__body tr) {
  background: rgb(5, 69, 71);
  border-color: rgba(114, 240, 245, 0.2);
}

.work-order-table :deep(.el-table__body td) {
  border-color: rgba(36, 116, 207, 0.788);
  color: #ffffff;
  font-size: 12px !important;
  padding: 6px 4px !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.2;
  height: auto !important;
}

.work-order-table :deep(.el-table__body tr:hover > td) {
  background: rgb(114, 241, 245);
  color: #000000 !important;
}

.work-order-table :deep(.el-table--border) {
  border-color: rgba(114, 240, 245, 0.2);
}

.work-order-table :deep(.el-table--border::after),
.work-order-table :deep(.el-table--border::before) {
  background-color: rgba(114, 240, 245, 0.2);
}

.work-order-table :deep(.clickable-row) {
  cursor: pointer;
  transition: all 0.3s ease;
}

.work-order-table :deep(.clickable-row:hover) {
  background: rgba(114, 240, 245, 0.15) !important;
}

.work-order-table :deep(.clickable-row:hover td) {
  background: rgba(114, 240, 245, 0.3) !important;
  border-color: rgba(114, 240, 245, 0.5) !important;
  color: #ffffff !important;
}

/* Dialog样式 */
.detail-dialog {
  background: rgba(0, 0, 0, 0.8);
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
}

.loading-container .el-icon {
  font-size: 32px;
  margin-bottom: 16px;
}


</style>

