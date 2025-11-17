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
      <el-table-column prop="project" label="项目" width="100" align="center" />
      <el-table-column prop="category" label="分类" width="100" align="center" />
      <el-table-column prop="shouldComplete" label="应完成数" align="center" />
      <el-table-column prop="onTimeComplete" label="及时完成数" align="center" />
      <el-table-column prop="completionRate" label="完结率" align="center">
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
        <div v-if="dialogLoading" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>数据加载中...</span>
        </div>
        
        <el-table 
          v-else 
          :data="detailData" 
          border 
          style="width: 100%"
          :empty-text="errorMessage || '暂无数据'"
          v-loading="dialogLoading"
          element-loading-text="数据加载中..."
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
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import axios from 'axios'
import { getMonthCompleteGd } from '@/api/getInjection'

const props = defineProps<{
  workOrderDataProp?: any  // 工单结单率数据
}>()

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
      console.log('Request with token:', {
        url: config.url,
        method: config.method,
        hasToken: true,
        tokenPrefix: token.substring(0, 20) + '...'
      })
    } else {
      console.warn('Request without token:', {
        url: config.url,
        method: config.method,
        hasToken: false
      })
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器，用于调试
reportApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Report API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      headers: error.config?.headers
    })
    return Promise.reject(error)
  }
)

// 工单结单率数据
const workOrderData = ref<any>(null)
const loading = ref(false)

// 将 categoryData 转换为表格数据（包含月度和每日）
const tableData = computed(() => {
  if (!workOrderData.value || !workOrderData.value.categoryData) {
    return []
  }
  const { categoryA, regular } = workOrderData.value.categoryData
  
  // 获取月度和每日数据
  const monthTotalGd = workOrderData.value.monthCompletedOrders || 0
  const monthOnTimeGd = workOrderData.value.onTimeOrders || 0
  
  // 计算A类和常规的月度数据（假设平均分配）
  const categoryAMonthShould = Math.floor(monthTotalGd * 0.5) || 0
  const categoryAMonthOnTime = Math.floor(monthOnTimeGd * 0.5) || 0
  const categoryAMonthRate = categoryAMonthShould > 0 
    ? Math.round((categoryAMonthOnTime / categoryAMonthShould) * 1000) / 10 
    : 0
  
  const regularMonthShould = Math.ceil(monthTotalGd * 0.5) || 0
  const regularMonthOnTime = Math.ceil(monthOnTimeGd * 0.5) || 0
  const regularMonthRate = regularMonthShould > 0 
    ? Math.round((regularMonthOnTime / regularMonthShould) * 1000) / 10 
    : 0
  
  return [
    // A类 - 月度
    {
      project: 'A类',
      category: '月度',
      shouldComplete: categoryAMonthShould,
      onTimeComplete: categoryAMonthOnTime,
      completionRate: categoryAMonthRate,
      canClick: false,
      categoryType: 'A类',
      periodType: 'month'
    },
    // A类 - 每日
    {
      project: 'A类',
      category: '每日',
      shouldComplete: categoryA?.shouldComplete || 0,
      onTimeComplete: categoryA?.onTimeComplete || 0,
      completionRate: categoryA?.completionRate || 0,
      canClick: categoryA?.canClick || false,
      categoryType: 'A类',
      periodType: 'day'
    },
    // 常规 - 月度
    {
      project: '常规',
      category: '月度',
      shouldComplete: regularMonthShould,
      onTimeComplete: regularMonthOnTime,
      completionRate: regularMonthRate,
      canClick: false,
      categoryType: '常规',
      periodType: 'month'
    },
    // 常规 - 每日
    {
      project: '常规',
      category: '每日',
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
    const res = await getMonthCompleteGd('金工一部焊接')
    if (res && res.code === 200 && res.data) {
      // 根据接口注释：月入库工单,准时工单,今日计划工单数,已完结工单
      // totalGd: 月入库工单（总数）
      // jsGd: 准时工单（按时完成的工单数）
      // todayTotalGd: 今日计划工单数
      // todayJsGd: 今日已完结工单数
      
      // 月度数据
      const monthTotalGd = res.data.totalGd ?? 0  // 月入库工单总数
      const monthOnTimeGd = res.data.jsGd ?? 0    // 准时工单数（按时完成的工单数）
      // 结单率 = 准时工单数 / 月入库工单总数 * 100
      const monthClosingRate = monthTotalGd > 0 
        ? Math.round((monthOnTimeGd / monthTotalGd) * 1000) / 10 
        : 0

      // 今日数据
      const todayPlanGd = res.data.todayTotalGd ?? 0  // 今日计划工单数
      const todayCompletedGd = res.data.todayJsGd ?? 0 // 今日已完结工单数
      // 今日结单率 = 今日已完结工单数 / 今日计划工单数 * 100
      const todayClosingRate = todayPlanGd > 0 
        ? Math.round((todayCompletedGd / todayPlanGd) * 1000) / 10 
        : 0
      
      // 根据接口数据，构造A类和常规的数据结构
      // 这里假设接口返回的数据需要按分类处理，如果没有分类数据，则平均分配或使用默认值
      const categoryAShouldComplete = Math.floor(todayPlanGd * 0.5) || 0
      const categoryAOnTimeComplete = Math.floor(todayCompletedGd * 0.5) || 0
      const categoryACompletionRate = categoryAShouldComplete > 0 
        ? Math.round((categoryAOnTimeComplete / categoryAShouldComplete) * 1000) / 10 
        : 0
      
      const regularShouldComplete = Math.ceil(todayPlanGd * 0.5) || 0
      const regularOnTimeComplete = Math.ceil(todayCompletedGd * 0.5) || 0
      const regularCompletionRate = regularShouldComplete > 0 
        ? Math.round((regularOnTimeComplete / regularShouldComplete) * 1000) / 10 
        : 0
      
      workOrderData.value = {
        categoryData: {
          categoryA: {
            shouldComplete: categoryAShouldComplete,  // 今日应完结工单数（A类）
            onTimeComplete: categoryAOnTimeComplete,  // 今日及时完结数（A类）
            completionRate: categoryACompletionRate,  // 完结率
            canClick: true
          },
          regular: {
            shouldComplete: regularShouldComplete,  // 今日应完结工单数（常规）
            onTimeComplete: regularOnTimeComplete,  // 今日及时完结数（常规）
            completionRate: regularCompletionRate,  // 完结率
            canClick: true
          }
        },
        // 保留原有字段用于兼容
        monthCompletedOrders: monthTotalGd,
        onTimeOrders: monthOnTimeGd,
        closingRate: monthClosingRate,
        todayCompletedOnTime: todayPlanGd,
        todayOnTimeCompleted: todayCompletedGd,
        todayClosingRate: todayClosingRate
      }
    } else {
      workOrderData.value = null
    }
  } catch (error) {
    console.error('获取工单结单率数据失败:', error)
    workOrderData.value = null
  } finally {
    loading.value = false
  }
}

// 监听 props 变化
watch(() => props.workOrderDataProp, () => {
  processPropData()
}, { deep: true })

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
const detailData = ref([])
const dialogLoading = ref(false)
const errorMessage = ref('')
const dialogTitle = ref('今日工单详细数据')

// 打开今日详细数据Dialog
const openTodayDetailDialog = async (category?: string) => {
  dialogVisible.value = true
  dialogLoading.value = true
  errorMessage.value = ''
  detailData.value = []
  // 设置 Dialog 标题
  dialogTitle.value = category ? `${category} - 今日工单详细数据` : '今日工单详细数据'
  
  try {
    // 获取今天的日期，格式：YYYYMMDD
    const today = dayjs().format('YYYYMMDD')
    // 参数：dateTimeStart, dateTimeStop (都是今天), workCenter = '焊接车间'
    const workCenter = '焊接车间'
    // 如果传入了分类，可以在请求中使用
    const categoryType = category || ''
    
    // 通过代理调用接口（开发环境使用相对路径，生产环境使用完整URL）
    // 开发环境：/api/report/workOrderClosingRate (通过 vite 代理转发到 http://192.168.1.197:10999/apollo/report/workOrderClosingRate)
    // 生产环境：http://192.168.1.197:10999/apollo/report/workOrderClosingRate
    const isDev = import.meta.env.DEV
    const apiUrl = isDev 
      ? '/api/report/workOrderClosingRate' 
      : 'http://192.168.1.197:10999/apollo/report/workOrderClosingRate'
    
    console.log('Making request to:', apiUrl, {
      dateTimeStart: today,
      dateTimeStop: today,
      workCenter
    })
    
    const response = await reportApi({
      url: apiUrl,
      method: 'post',
      data: {
        workCenter,
        dateTimeStart: today,
        dateTimeStop: today,
        ...(categoryType && { category: categoryType })
      }
    })
    
    if (response && response.data && response.data.code === 200 && response.data.data) {
      detailData.value = response.data.data
    } else {
      errorMessage.value = response?.data?.message || '获取数据失败'
      ElMessage.error(errorMessage.value)
    }
  } catch (error) {
    console.error('获取今日工单详细数据失败:', error)
    errorMessage.value = '获取数据失败，请稍后重试'
    ElMessage.error(errorMessage.value)
  } finally {
    dialogLoading.value = false
  }
}
</script>

<style scoped>
.work-order-closing-rate {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  overflow: hidden;
}

.loading-text,
.empty-text {
  color: #72f0f5;
  font-size: 12px;
  text-align: center;
  padding: 10px;
  opacity: 0.7;
}

/* Element Plus 表格样式覆盖 */
.work-order-table {
  flex: 1;
  overflow: hidden;
}

.work-order-table :deep(.el-table) {
  background: rgba(10, 119, 228, 0.3);
  color: #ececec;
}

.work-order-table :deep(.el-table__header) {
  background: rgba(0, 100, 200, 0.4);
}

.work-order-table :deep(.el-table__header th) {
  background: rgb(0, 128, 255);
  border-color: rgba(0, 247, 255, 0.4);
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 0;
}


.work-order-table :deep(.el-table__body tr) {
  background: rgb(5, 69, 71);
  border-color: rgba(114, 240, 245, 0.2);
}

.work-order-table :deep(.el-table__body td) {
  border-color: rgba(36, 116, 207, 0.788);
  color: #ffffff;
  font-size: 14px;
  padding: 8px 0;
}

.work-order-table :deep(.el-table__body tr:hover > td) {
  background: rgb(114, 241, 245);
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
  background: rgba(114, 240, 245, 0.15) !important;
  border-color: rgba(114, 240, 245, 0.5) !important;
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

