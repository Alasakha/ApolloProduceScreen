<template>
  <div class="work-order-closing-rate h-full flex flex-col">
    <div v-if="loading" class="loading-text">加载中...</div>
    <div v-else-if="!workOrderData || !workOrderData.categoryData" class="empty-text">暂无数据</div>
    <div v-else class="cards-container">
      <!-- A类工单 - 月度 -->
      <div class="data-card">
        <div class="card-header">
          <span class="card-title">A类工单</span>
          <span class="card-period">月度</span>
        </div>
        <div class="card-content">
          <div class="data-item">
            <div class="data-label">应完成数</div>
            <div class="data-value">{{ monthStats.categoryA.shouldComplete }}</div>
          </div>
          <div class="data-item">
            <div class="data-label">及时完成数</div>
            <div class="data-value highlight">{{ monthStats.categoryA.onTimeComplete }}</div>
          </div>
          <div class="data-item rate-item">
            <div class="data-label">完结率</div>
            <div class="rate-display">
              <div class="rate-value">{{ monthStats.categoryA.completionRate }}%</div>
              <div class="rate-progress">
                <div class="rate-progress-bar" :style="{ width: Math.min(monthStats.categoryA.completionRate, 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- A类工单 - 今日 -->
      <div 
        class="data-card clickable-card" 
        :class="{ 'has-data': todayStats.categoryA.canClick }"
        @click="handleCardClick('A类', 'day')"
      >
        <div class="card-header">
          <span class="card-title">A类工单</span>
          <span class="card-period today">今日</span>
        </div>
        <div class="card-content">
          <div class="data-item">
            <div class="data-label">应完成数</div>
            <div class="data-value">{{ todayStats.categoryA.shouldComplete }}</div>
          </div>
          <div class="data-item">
            <div class="data-label">及时完成数</div>
            <div class="data-value highlight">{{ todayStats.categoryA.onTimeComplete }}</div>
          </div>
          <div class="data-item rate-item">
            <div class="data-label">完结率</div>
            <div class="rate-display">
              <div class="rate-value">{{ todayStats.categoryA.completionRate }}%</div>
              <div class="rate-progress">
                <div class="rate-progress-bar" :style="{ width: Math.min(todayStats.categoryA.completionRate, 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 常规工单 - 月度 -->
      <div class="data-card">
        <div class="card-header">
          <span class="card-title">常规工单</span>
          <span class="card-period">月度</span>
        </div>
        <div class="card-content">
          <div class="data-item">
            <div class="data-label">应完成数</div>
            <div class="data-value">{{ monthStats.regular.shouldComplete }}</div>
          </div>
          <div class="data-item">
            <div class="data-label">及时完成数</div>
            <div class="data-value highlight">{{ monthStats.regular.onTimeComplete }}</div>
          </div>
          <div class="data-item rate-item">
            <div class="data-label">完结率</div>
            <div class="rate-display">
              <div class="rate-value">{{ monthStats.regular.completionRate }}%</div>
              <div class="rate-progress">
                <div class="rate-progress-bar" :style="{ width: Math.min(monthStats.regular.completionRate, 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 常规工单 - 今日 -->
      <div 
        class="data-card clickable-card" 
        :class="{ 'has-data': todayStats.regular.canClick }"
        @click="handleCardClick('常规', 'day')"
      >
        <div class="card-header">
          <span class="card-title">常规工单</span>
          <span class="card-period today">今日</span>
        </div>
        <div class="card-content">
          <div class="data-item">
            <div class="data-label">应完成数</div>
            <div class="data-value">{{ todayStats.regular.shouldComplete }}</div>
          </div>
          <div class="data-item">
            <div class="data-label">及时完成数</div>
            <div class="data-value highlight">{{ todayStats.regular.onTimeComplete }}</div>
          </div>
          <div class="data-item rate-item">
            <div class="data-label">完结率</div>
            <div class="rate-display">
              <div class="rate-value">{{ todayStats.regular.completionRate }}%</div>
              <div class="rate-progress">
                <div class="rate-progress-bar" :style="{ width: Math.min(todayStats.regular.completionRate, 100) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
        <div v-if="detailLoading" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <div>加载中...</div>
        </div>
        <div v-else-if="detailErrorMessage" class="error-message">
          {{ detailErrorMessage }}
        </div>
        <el-table 
          v-else
          :data="detailData" 
          border 
          style="width: 100%"
          :empty-text="'暂无数据'"
          max-height="600"
          stripe
        >
          <el-table-column type="index" label="序号" width="60" align="center" fixed="left" />
          <el-table-column prop="workCenter" label="工作中心" width="120" align="center" />
          <el-table-column prop="workNo" label="工单号" width="150" align="center" />
          <el-table-column prop="number" label="客户单号" width="150" align="center" />
          <el-table-column prop="articleNumber" label="品号" width="150" align="center" />
          <el-table-column prop="articleName" label="品名" width="200" show-overflow-tooltip align="left" />
          <el-table-column prop="specifications" label="规格" width="250" show-overflow-tooltip align="left" />
          <el-table-column prop="completionJudgment" label="完成判断" width="100" align="center">
            <template #default="scope">
              <span :style="{ color: scope.row.completionJudgment === '1' ? '#67c23a' : '#f56c6c' }">
                {{ scope.row.completionJudgment === '1' ? '已完成' : '未完成' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="productionQuantity" label="工单数量" width="120" align="right" />
          <el-table-column prop="planQuantity" label="排产数量" width="120" align="right" />
          <el-table-column prop="dateTime" label="排产日期" width="120" align="center">
            <template #default="scope">
              {{ scope.row.dateTime ? formatDate(scope.row.dateTime) : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="pgTime" label="派工日期" width="160" align="center">
            <template #default="scope">
              {{ scope.row.pgTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="bgTime" label="报工日期" width="160" align="center">
            <template #default="scope">
              {{ scope.row.bgTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="kzTime" label="扣账完成日期" width="160" align="center">
            <template #default="scope">
              {{ scope.row.kzTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="jyTime" label="检验完成日期" width="160" align="center">
            <template #default="scope">
              {{ scope.row.jyTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="inboundQuantity" label="入库数量" width="120" align="right" />
          <el-table-column prop="finalInboundQuantity" label="最后入库数量" width="140" align="right" />
          <el-table-column prop="inboundTime" label="入库时间" width="180" align="center">
            <template #default="scope">
              {{ scope.row.inboundTime || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="finalInboundTime" label="最后入库时间" width="180" align="center">
            <template #default="scope">
              {{ scope.row.finalInboundTime || '-' }}
            </template>
          </el-table-column>
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
import dayjs from 'dayjs'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const DEFAULT_PROD_LINE = '金工一部焊接'
const DEFAULT_WORK_CENTER = '焊接车间'
type CategoryKey = 'A类' | '常规'

// 创建用于 /api/report 接口的 axios 实例
const reportApi = axios.create({
  withCredentials: true,
  timeout: 130000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器，自动携带 token 和 cookie
reportApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 工单详细数据类型定义（根据接口返回）
interface WorkOrderDetailItem {
  workNo: string
  workCenter: string
  number: string
  articleNumber: string
  articleName: string
  specifications: string
  dateTime: string
  productionQuantity: string
  inboundQuantity: string
  inboundTime: string | null
  finalInboundQuantity: string
  finalInboundTime: string | null
  completionJudgment: string
  rksl: string
  planQuantity: string
  mo_id: string
  pgTime: string | null
  bgTime: string | null
  kzTime: string | null
  jyTime: string | null
}

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

// 计算月度和今日统计数据
const monthStats = computed(() => {
  if (!workOrderData.value) {
    return {
      categoryA: { shouldComplete: 0, onTimeComplete: 0, completionRate: 0 },
      regular: { shouldComplete: 0, onTimeComplete: 0, completionRate: 0 }
    }
  }
  return monthCategoryData.value || buildFallbackMonthStats()
})

const todayStats = computed(() => {
  if (!workOrderData.value || !workOrderData.value.categoryData) {
    return {
      categoryA: { shouldComplete: 0, onTimeComplete: 0, completionRate: 0, canClick: false },
      regular: { shouldComplete: 0, onTimeComplete: 0, completionRate: 0, canClick: false }
    }
  }
  const { categoryA, regular } = workOrderData.value.categoryData
  return {
    categoryA: {
      shouldComplete: categoryA?.shouldComplete || 0,
      onTimeComplete: categoryA?.onTimeComplete || 0,
      completionRate: categoryA?.completionRate || 0,
      canClick: categoryA?.canClick || false
    },
    regular: {
      shouldComplete: regular?.shouldComplete || 0,
      onTimeComplete: regular?.onTimeComplete || 0,
      completionRate: regular?.completionRate || 0,
      canClick: regular?.canClick || false
    }
  }
})

// 卡片点击处理
const handleCardClick = (category: string, periodType: string) => {
  if (periodType === 'day') {
    const stats = category === 'A类' ? todayStats.value.categoryA : todayStats.value.regular
    if (stats.canClick) {
      openTodayDetailDialog(category)
    }
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
const detailData = ref<WorkOrderDetailItem[]>([])
const dialogTitle = ref('今日工单详细数据')
const detailLoading = ref(false)
const detailErrorMessage = ref('')

// 打开今日详细数据Dialog
const openTodayDetailDialog = async (category?: string) => {
  dialogVisible.value = true
  detailData.value = []
  detailLoading.value = true
  detailErrorMessage.value = ''
  dialogTitle.value = category ? `${category} - 今日工单详细数据` : '今日工单详细数据'

  try {
    // 获取今天的日期，格式：YYYYMMDD
    const today = dayjs().format('YYYYMMDD')
    const workCenter = DEFAULT_WORK_CENTER
    
    // 通过代理调用接口（开发环境使用相对路径，生产环境使用完整URL）
    const isDev = import.meta.env.DEV
    const apiUrl = isDev 
      ? '/api/report/workOrderClosingRate' 
      : 'https://192.168.1.197:8199/api/report/workOrderClosingRate'
    
    const response = await reportApi({
      url: apiUrl,
      method: 'post',
      data: {
        dateTimeStart: today,
        dateTimeStop: today,
        workCenter
      }
    })
    
    if (response && response.data && response.data.code === 200 && response.data.data) {
      let allData: WorkOrderDetailItem[] = response.data.data || []
      
      // 如果指定了类别，需要根据客户单号或其他字段过滤
      // 由于接口返回的数据可能没有直接的类别字段，这里先显示全部
      // 如果需要按类别过滤，需要根据实际数据结构调整
      if (category === 'A类' || category === '常规') {
        // 这里可以根据实际数据结构进行过滤
        // 暂时显示全部数据
        detailData.value = allData
      } else {
        detailData.value = allData
      }
    } else {
      detailErrorMessage.value = response?.data?.message || '获取数据失败'
      ElMessage.error(detailErrorMessage.value)
    }
  } catch (error) {
    console.error('获取今日工单详细数据失败:', error)
    detailErrorMessage.value = '获取数据失败，请稍后重试'
    ElMessage.error(detailErrorMessage.value)
  } finally {
    detailLoading.value = false
  }
}

// 格式化日期：YYYYMMDD -> YYYY-MM-DD
const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return dateStr
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`
}
</script>

<style scoped>
.work-order-closing-rate {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.loading-text,
.empty-text {
  color: #72f0f5;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  opacity: 0.9;
}

.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 4px;
}

.data-card {
  background: linear-gradient(135deg, rgba(0, 30, 60, 0.6) 0%, rgba(0, 50, 100, 0.4) 100%);
  border: 1px solid rgba(0, 247, 255, 0.3);
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 247, 255, 0.6), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.data-card.clickable-card {
  cursor: pointer;
}

.data-card.clickable-card:hover {
  border-color: rgba(114, 240, 245, 0.6);
  box-shadow: 0 4px 12px rgba(114, 240, 245, 0.3);
  transform: translateY(-2px);
}

.data-card.clickable-card.has-data::after {
  content: '点击查看详情';
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  color: rgba(114, 240, 245, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.data-card.clickable-card.has-data:hover::after {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.5);
  letter-spacing: 1px;
}

.card-period {
  font-size: 11px;
  color: rgba(114, 240, 245, 0.8);
  background: rgba(0, 100, 200, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0, 247, 255, 0.3);
}

.card-period.today {
  color: #72f0f5;
  background: rgba(114, 240, 245, 0.2);
  border-color: rgba(114, 240, 245, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.data-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.data-value {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 247, 255, 0.4);
}

.data-value.highlight {
  color: #72f0f5;
  text-shadow: 0 0 8px rgba(114, 240, 245, 0.6);
}

.rate-item {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 247, 255, 0.15);
}

.rate-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.rate-value {
  font-size: 18px;
  font-weight: 700;
  color: #72f0f5;
  text-align: right;
  text-shadow: 0 0 10px rgba(114, 240, 245, 0.8);
  letter-spacing: 1px;
}

.rate-progress {
  width: 100%;
  height: 6px;
  background: rgba(0, 30, 60, 0.6);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(0, 247, 255, 0.2);
  position: relative;
}

.rate-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 247, 255, 0.8) 0%, rgba(114, 240, 245, 0.9) 100%);
  border-radius: 3px;
  transition: width 0.6s ease;
  box-shadow: 0 0 8px rgba(114, 240, 245, 0.6);
  position: relative;
}

.rate-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
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
  color: #72f0f5;
  font-size: 14px;
}

.loading-container .el-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.error-message {
  padding: 40px;
  text-align: center;
  color: #f56c6c;
  font-size: 14px;
}


</style>

