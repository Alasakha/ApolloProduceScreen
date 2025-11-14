<template>
  <div class="work-order-closing-rate h-full flex flex-col">
    <!-- 工单结单率标题 -->
    <div class="section-title">工单结单率</div>
    
    <!-- 月度数据 -->
    <div class="data-section">
      <div class="section-subtitle">月度</div>
      <div class="grid grid-cols-3 gap-2 h-full">
        <dv-border-box-12 class="data-box">
          <Datacard 
            title="月已完成工单数" 
            EnlishTitle="MonthCompletedOrders" 
            :value="workOrderData.monthCompletedOrders" 
          />
        </dv-border-box-12>
        <dv-border-box-12 class="data-box">
          <Datacard 
            title="按时完成工单数" 
            EnlishTitle="OnTimeCompletedOrders" 
            :value="workOrderData.onTimeOrders" 
          />
        </dv-border-box-12>
        <dv-border-box-12 class="data-box">
          <Datacard 
            title="结单率" 
            EnlishTitle="ClosingRate" 
            :value="workOrderData.closingRate + '%'" 
          />
        </dv-border-box-12>
      </div>
    </div>

    <!-- 今日数据 -->
    <div class="data-section" @click="openTodayDetailDialog" style="cursor: pointer;">
      <div class="section-subtitle">今日</div>
      <div class="grid grid-cols-3 gap-2 h-full">
        <dv-border-box-12 class="data-box">
          <Datacard 
            title="今日应完成工单数" 
            EnlishTitle="TodayPlanOrders" 
            :value="workOrderData.todayPlanOrders" 
          />
        </dv-border-box-12>
        <dv-border-box-12 class="data-box">
          <Datacard 
            title="已完成工单数" 
            EnlishTitle="TodayCompletedOrders" 
            :value="workOrderData.todayCompletedOnTime" 
          />
        </dv-border-box-12>
        <dv-border-box-12 class="data-box">
          <Datacard 
            title="结单率" 
            EnlishTitle="TodayClosingRate" 
            :value="workOrderData.todayClosingRate + '%'" 
          />
        </dv-border-box-12>
      </div>
    </div>

    <!-- 今日详细数据Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="今日工单详细数据"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :append-to-body="true"
      :destroy-on-close="true"
      class="detail-dialog"
    >
      <div class="detail-content">
        <div v-if="loading" class="loading-container">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>数据加载中...</span>
        </div>
        
        <el-table 
          v-else 
          :data="detailData" 
          border 
          style="width: 100%"
          :empty-text="errorMessage || '暂无数据'"
          v-loading="loading"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import axios from 'axios'
import Datacard from '../../components/Datacard.vue'
import { getMonthCompleteGd } from '@/api/getInjection'

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

const route = useRoute()
const prodLine = route.query.prodLine as string

// 工单结单率数据
const workOrderData = ref({
  monthCompletedOrders: 0,    // 月已完成工单数
  onTimeOrders: 0,            // 按时完成工单数
  closingRate: 0,             // 月度结单率
  todayPlanOrders: 0,         // 今日应完成工单数
  todayCompletedOnTime: 0,    // 今日已完成工单数
  todayClosingRate: 0         // 今日结单率
})

// Dialog控制
const dialogVisible = ref(false)
const detailData = ref([])
const loading = ref(false)
const errorMessage = ref('')

const fetchData = async (_prodLine) => {
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
      
      workOrderData.value.monthCompletedOrders = monthTotalGd  // 月入库工单总数（显示为"月已完成工单数"）
      workOrderData.value.onTimeOrders = monthOnTimeGd         // 准时工单数（显示为"按时完成工单数"）
      workOrderData.value.closingRate = monthClosingRate

      // 今日数据
      const todayPlanGd = res.data.todayTotalGd ?? 0  // 今日计划工单数
      const todayCompletedGd = res.data.todayJsGd ?? 0 // 今日已完结工单数
      // 今日结单率 = 今日已完结工单数 / 今日计划工单数 * 100
      const todayClosingRate = todayPlanGd > 0 
        ? Math.round((todayCompletedGd / todayPlanGd) * 1000) / 10 
        : 0
      
      workOrderData.value.todayPlanOrders = todayPlanGd        // 今日计划工单数（显示为"今日应完成工单数"）
      workOrderData.value.todayCompletedOnTime = todayCompletedGd  // 今日已完结工单数（显示为"已完成工单数"）
      workOrderData.value.todayClosingRate = todayClosingRate
    }
  } catch (error) {
    console.error('获取工单结单率数据失败:', error)
  }
}

onMounted(() => {
  fetchData(prodLine)
  // 订阅刷新事件
  eventBus.on('refreshData', () => fetchData(prodLine))
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', () => fetchData(prodLine))
})

// 打开今日详细数据Dialog
const openTodayDetailDialog = async () => {
  dialogVisible.value = true
  loading.value = true
  errorMessage.value = ''
  detailData.value = []
  
  try {
    // 获取今天的日期，格式：YYYYMMDD
    const today = dayjs().format('YYYYMMDD')
    // 参数：dateTimeStart, dateTimeStop (都是今天), workCenter = '注塑车间'
    const workCenter = '注塑车间'
    
    // 通过代理调用接口（开发环境使用相对路径，生产环境使用完整URL）
    // 开发环境：/api/report/workOrderClosingRate (通过 vite 代理转发)
    // 生产环境：https://192.168.1.197:8199/api/report/workOrderClosingRate
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
    loading.value = false
  }
}
</script>

<style scoped>
.work-order-closing-rate {
  padding: 1rem;
  gap: 1rem;
}

.section-title {
  font-size: 1.5vw;
  font-weight: bold;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.2vw;
  font-weight: bold;
  color: #00eaff;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 0.2vw;
}

.data-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.data-box {
  height: 100%;
  padding: 1rem;
  position: relative;
  overflow: hidden;
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
