<template>
  <div class="plan-progress-container">
    <!-- 标题区 -->
    <div class="header-section">
      <div class="header-left">
        <div class="logo-box">
          <svg viewBox="0 0 100 100" class="logo-icon">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#00f0ff" stroke-width="3"/>
            <path d="M30 50 L45 65 L70 35" fill="none" stroke="#00f0ff" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="title-box">
          <h1 class="main-title">生产计划进度</h1>
          <p class="sub-title">PRODUCTION PLAN PROGRESS</p>
        </div>
      </div>
      <div class="header-right">
        <div class="date-box">
          <span class="date-label">日期</span>
          <span class="date-value">{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="输入客户单号"
          @keyup.enter="handleSearch"
        />
        <input
          v-model="searchSalesman"
          type="text"
          class="search-input salesman-input"
          placeholder="输入业务员名称"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <span class="btn-icon">🔍</span>
          搜索
        </button>
        <button class="reset-btn" @click="handleReset">
          <span class="btn-icon">↻</span>
          重置
        </button>
      </div>
      <div class="stats-box">
        <div class="stat-item">
          <span class="stat-value">{{ total }}</span>
          <span class="stat-label">总记录数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ totalPages }}</span>
          <span class="stat-label">总页数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ pageNum }}/{{ totalPages }}</span>
          <span class="stat-label">当前页</span>
        </div>
      </div>
    </div>

    <!-- 订单生产进度 -->
    <div class="section-card">
      <div class="section-header">
        <div class="header-decoration left"></div>
        <h2 class="section-title">
          <span class="title-icon">📋</span>
          订单生产进度
        </h2>
        <div class="header-decoration right"></div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="title">序号</th>
              <th class="title">业务员</th>
              <th class="title">工单号</th>
              <th class="title">品号</th>
              <th class="title">品名</th>


              <th class="title">规格</th>
              <th class="title">客户单号</th>
      
              <th class="title">业务数量</th>
              <th class="title">审核日期</th>
              <th class="title">计划货日期</th>
              <th class="title">生产进度详情</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in orderList" :key="index" :class="{ 'row-highlight': index % 2 === 0 }">
              <td class="col-center">{{ item.sequenceNumber }}</td>
              <td class="col-salesman">{{ item.employee_name || '-' }}</td>
              <td class="col-code">{{ item.gdh || '-' }}</td>
              <td class="col-code">{{ item.itemCode }}</td>
              <td>{{ item.itemName }}</td>
              <td class="col-spec">{{ item.itemSpecification }}</td>
              <td class="col-order">{{ item.customerOrderNo }}</td>
 

              <td class="col-num">{{ item.businessQty?.toFixed(0) || 0 }}</td>
              <td class="col-date">{{ item.approveDate }}</td>
              <td class="col-date">{{ item.planDeliveryDate?.split(' ')[0] || '' }}</td>
              <td class="col-progress" rowspan="1">
                <!-- 电池式工序进度可视化 - 横向排列 -->
                <div class="battery-visual-h">
                  <!-- 电池组 -->
                  <div class="battery-group-h">
                    <div v-for="(step, sIdx) in workshopSteps" :key="sIdx" class="battery-item-h">
                      <!-- 电池主体 -->
                      <div class="battery-body-h">
                        <div class="battery-liquid-h" :style="{
                          width: getPhasePercent(item, sIdx) + '%',
                          background: getBatteryColor(getPhasePercent(item, sIdx))
                        }">
                          <span class="battery-value-h">{{ getPhasePercent(item, sIdx) }}%</span>
                        </div>
                        <div class="battery-shell-h"></div>
                      </div>
                      <!-- 阶段标签 -->
                      <div class="battery-label-h">{{ step.label }}</div>
                    </div>
                    <!-- 连接线SVG -->
                    <svg class="battery-connector-svg" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="rgba(100,100,100,0.6)" />
                          <stop offset="100%" stop-color="rgba(100,100,100,0.3)" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="5" x2="100" y2="5" stroke="url(#lineGrad)" stroke-width="2" stroke-dasharray="4,2" />
                    </svg>
                  </div>
                  <!-- 总体进度 -->
                  <div class="battery-overall-h">
                    <span class="overall-label">总进度</span>
                    <div class="overall-bar-wrapper">
                      <div class="overall-bar-fill" :style="{ width: getOverallProgress(item) + '%' }"></div>
                    </div>
                    <span class="overall-percent">{{ getOverallProgress(item) }}%</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="orderList.length === 0 && !orderLoading">
              <td colspan="11" class="empty-cell">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="pagination-section">
        <div class="page-info">
          每页 {{ pageSize }} 条，共 {{ total }} 条
        </div>
        <div class="pagination-controls">
          <button class="page-btn" @click="goFirst" :disabled="pageNum <= 1">首页</button>
          <button class="page-btn" @click="goPrev" :disabled="pageNum <= 1">上一页</button>
          <div class="page-numbers">
            <button
              v-for="p in displayPages"
              :key="p"
              class="page-num"
              :class="{ active: p === pageNum }"
              @click="goTo(p)"
            >
              {{ p }}
            </button>
          </div>
          <button class="page-btn" @click="goNext" :disabled="pageNum >= totalPages">下一页</button>
          <button class="page-btn" @click="goLast" :disabled="pageNum >= totalPages">末页</button>
        </div>
        <div class="page-jump">
          跳至 <input type="number" v-model.number="jumpPage" class="jump-input" @keyup.enter="handleJump" min="1" :max="totalPages" /> 页
        </div>
        <div class="page-size-select">
          <span>每页</span>
          <select v-model.number="pageSize" @change="handlePageSizeChange" class="size-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span>条</span>
        </div>
      </div>
    </div>



    <!-- 加载动画 -->
    <div class="loading-overlay" v-if="orderLoading">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSalesOrderPhaseList } from '@/api/productionPlan'

// 分页参数
const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 显示的页码（最多显示7个）
const displayPages = computed(() => {
  const pages: number[] = []
  let start = Math.max(1, pageNum.value - 3)
  let end = Math.min(totalPages.value, pageNum.value + 3)
  
  if (end - start < 6) {
    if (start === 1) {
      end = Math.min(totalPages.value, start + 6)
    } else {
      start = Math.max(1, end - 6)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 搜索
const searchKeyword = ref('')
const searchSalesman = ref('')
const orderLoading = ref(false)
const processLoading = ref(false)

// 车间工序步骤定义
const workshopSteps = [
  { label: '焊接', value: 1, key: 'p1p' },
  { label: '委外', value: 2, key: 'p2p' },
  { label: '装配', value: 3, key: 'p3p' },
  { label: '包装', value: 4, key: 'p4p' },
  { label: '销货', value: 5, key: 'p5p' },
]

// 获取单个阶段百分比
const getPhasePercent = (item: any, index: number) => {
  const key = workshopSteps[index].key
  return Math.round((item[key] || 0) * 100)
}

// 电池颜色（带发光效果）
const getBatteryColor = (percent: number) => {
  if (percent >= 100) return 'linear-gradient(to top, #00ff88, #00cc6a)'  // 满电 - 翠绿
  if (percent >= 60) return 'linear-gradient(to top, #00d4ff, #00a8cc)' // 高电量 - 蓝色
  if (percent >= 30) return 'linear-gradient(to top, #ffcc00, #ff9900)'    // 中电量 - 橙色
  if (percent > 0) return 'linear-gradient(to top, #ff6b6b, #ff4444)'     // 低电量 - 红色
  return 'transparent'                                                   // 空电 - 透明
}

// 计算总体进度（加权平均）
const getOverallProgress = (item: any) => {
  const weights = [0.2, 0.2, 0.2, 0.2, 0.2]  // 每个阶段权重相同
  let total = 0
  workshopSteps.forEach((step, idx) => {
    total += (item[step.key] || 0) * weights[idx]
  })
  return Math.round(total * 100)
}

// 跳转页码
const jumpPage = ref(1)

// 日期
const currentDate = ref('')
let dateTimer: number | undefined

// 数据列表
const orderList = ref<any[]>([])
const processList = ref<any[]>([])

// 获取订单阶段列表
const fetchOrderList = async () => {
  orderLoading.value = true
  try {
    const res: any = await getSalesOrderPhaseList(searchKeyword.value || undefined, searchSalesman.value || undefined, pageNum.value, pageSize.value)
    if (res && res.data) {
      orderList.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      orderList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    orderList.value = []
    total.value = 0
  } finally {
    orderLoading.value = false
  }
}

// 获取工序计划列表（mock数据）
const fetchProcessList = async () => {
  processLoading.value = true
  try {
    processList.value = [
      { sequenceNumber: 1, workOrderNo: 'WO20240401001', itemCode: 'A001', itemName: '铝合金支架', processName: '冲压', planQty: 1000, doneQty: 800, progress: 80, status: '1', statusName: '进行中' },
      { sequenceNumber: 2, workOrderNo: 'WO20240401002', itemCode: 'A002', itemName: '不锈钢底座', processName: '焊接', planQty: 500, doneQty: 500, progress: 100, status: '3', statusName: '已完成' },
      { sequenceNumber: 3, workOrderNo: 'WO20240401003', itemCode: 'A003', itemName: '塑料外壳', processName: '注塑', planQty: 2000, doneQty: 600, progress: 30, status: '1', statusName: '进行中' },
      { sequenceNumber: 4, workOrderNo: 'WO20240401004', itemCode: 'A004', itemName: '电机组件', processName: '装配', planQty: 300, doneQty: 0, progress: 0, status: '2', statusName: '待生产' },
      { sequenceNumber: 5, workOrderNo: 'WO20240401005', itemCode: 'A005', itemName: '控制面板', processName: '喷涂', planQty: 800, doneQty: 780, progress: 98, status: '1', statusName: '进行中' },
    ]
  } catch (error) {
    console.error('获取工序列表失败:', error)
    processList.value = []
  } finally {
    processLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  fetchOrderList()
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  searchSalesman.value = ''
  pageNum.value = 1
  fetchOrderList()
}

// 分页操作
const goFirst = () => { pageNum.value = 1; fetchOrderList() }
const goPrev = () => { if (pageNum.value > 1) { pageNum.value--; fetchOrderList() } }
const goNext = () => { if (pageNum.value < totalPages.value) { pageNum.value++; fetchOrderList() } }
const goLast = () => { pageNum.value = totalPages.value; fetchOrderList() }
const goTo = (p: number) => { pageNum.value = p; fetchOrderList() }
const handleJump = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
    pageNum.value = jumpPage.value
    fetchOrderList()
  }
}

// 每页条数变化
const handlePageSizeChange = () => {
  pageNum.value = 1
  fetchOrderList()
}

// 进度颜色
// const getProgressColor = (progress: number) => {
//   if (progress >= 100) return '#00ff88'
//   if (progress >= 60) return '#00d4ff'
//   if (progress >= 30) return '#ffcc00'
//   return '#ff6666'
// }

// 更新日期
const updateDate = () => {
  const now = new Date()
  currentDate.value = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  updateDate()
  dateTimer = window.setInterval(updateDate, 1000)
  fetchOrderList()
  fetchProcessList()
})

onUnmounted(() => {
  if (dateTimer) clearInterval(dateTimer)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.plan-progress-container {
  height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f4e 50%, #0d1230 100%);
  padding: 20px;
  color: #e0e6ed;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.plan-progress-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 240, 255, 0.03) 0%, transparent 50%);
  animation: rotate 60s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 头部区域 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 6px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 50%, rgba(0, 240, 255, 0.1) 100%);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-icon {
  width: 60px;
  height: 60px;
}

.title-box .main-title {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #00f0ff, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
}

.title-box .sub-title {
  font-size: 12px;
  color: rgba(0, 240, 255, 0.7);
  letter-spacing: 3px;
  margin-top: 5px;
}

.header-right {
  text-align: right;
}

.date-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.date-value {
  font-size: 18px;
  color: #00f0ff;
  font-family: 'Orbitron', monospace;
}

/* 搜索区域 */
.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 10px;
  /* margin-bottom: 20px; */
  position: relative;
  z-index: 1;
}

.search-box {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 280px;
  padding: 5px 5px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.salesman-input {
  width: 160px;
  cursor: text;
}

.search-btn, .reset-btn {
  padding: 5px 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.search-btn {
  background: linear-gradient(135deg, #00f0ff, #0080ff);
  color: #000;
  font-weight: bold;
}

.search-btn:hover {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
  transform: translateY(-2px);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-icon {
  font-size: 14px;
}

/* 统计区域 */
.stats-box {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-size: 15px;
  font-weight: bold;
  color: #00f0ff;
  font-family: 'Orbitron', monospace;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* 卡片区域 */
.section-card {
  background: rgba(0, 20, 60, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 4px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.1), rgba(138, 43, 226, 0.1));
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-bottom: none;
  margin: -1px -1px 0 -1px;
}

.header-decoration {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f0ff, transparent);
}

.header-decoration.left {
  background: linear-gradient(90deg, transparent, #00f0ff);
}

.header-decoration.right {
  background: linear-gradient(90deg, #00f0ff, transparent);
}

.section-title {
  font-size: 18px;
  color: #00f0ff;
  display: flex;
  /* align-items: center; */
  gap: 10px;
  margin: 0 30px;
}

.title-icon {
  font-size: 20px;
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  max-height: 75vh;
  overflow-y: auto;
  border-left: 1px solid rgba(0, 240, 255, 0.2);
  border-right: 1px solid rgba(0, 240, 255, 0.2);
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.3);
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.5);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background: rgba(0, 240, 255, 0.1);
}

.data-table th {
  padding: 12px 15px;
  text-align: left;
  color: #00f0ff;
  font-weight: bold;
  white-space: nowrap;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
}

.data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e0e6ed;
}

.data-table tbody tr:hover {
  background: rgba(0, 240, 255, 0.05);
}

.data-table tbody tr.row-highlight {
  background: rgba(0, 240, 255, 0.02);
}

.col-center { text-align: center; }
.col-code { font-family: monospace; color: #00ff88; }
.col-spec { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-order { max-width: 100px; color: #ffcc00; }
.col-salesman { color: #c084fc; }
.col-num { text-align: center; font-family: 'Orbitron', monospace; color: #00d4ff; }
.col-date { color: rgba(255, 255, 255, 0.7); font-size: 13px; }
/* 横向电池式进度可视化 */
.col-progress {
  min-width: 350px;
  padding: 4px 6px;
}

.battery-visual-h {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 横向电池组 */
.battery-group-h {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  padding: 0 4px;
}

.battery-item-h {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  z-index: 2;
  width: 30%;
}

/* 横向电池主体 */
.battery-body-h {
  display: flex;
  align-items: stretch;
  position: relative;
  height: 24px;
}

/* 横向电池外壳 */
.battery-shell-h {
  width: 36px;
  height: 24px;
  border: 2px solid rgba(100, 100, 100, 0.7);
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
}

/* 横向电池液体 */
.battery-liquid-h {
  position: absolute;
  top: 2px;
  left: 2px;
  bottom: 2px;
  border-radius: 2px;
  transition: width 0.6s ease-out, background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 4px;
  overflow: hidden;
  min-width: 0;
}

.battery-liquid-h::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(255,255,255,0.15), transparent 50%);
}

.battery-value-h {
  font-size: 8px;
  font-family: 'Orbitron', monospace;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
  position: relative;
  z-index: 1;
  font-weight: bold;
  white-space: nowrap;
}

/* 横向电池标签 */
.battery-label-h {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 连接线SVG */
.battery-connector-svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 10px;
  z-index: 1;
  pointer-events: none;
}

/* 总体进度指示 */
.battery-overall-h {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border: 1px solid rgba(0, 240, 255, 0.12);
}

.battery-overall-h .overall-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.battery-overall-h .overall-bar-wrapper {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.battery-overall-h .overall-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00ff88);
  border-radius: 3px;
  transition: width 0.8s ease-out;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}

.battery-overall-h .overall-percent {
  font-size: 11px;
  font-family: 'Orbitron', monospace;
  color: #00ff88;
  font-weight: bold;
  min-width: 34px;
  text-align: right;
}

/* 旧样式保留（兼容） */
.workshop-flow {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.step-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.step-check {
  width: 10px;
  height: 10px;
}

.step-label {
  font-size: 10px;
  text-align: center;
  white-space: nowrap;
  transition: color 0.3s;
}

.step-done .step-dot {
  background: #00ff88;
  border-color: #00ff88;
  color: #0a0e27;
}

.step-done .step-label {
  color: #00ff88;
}

.step-active .step-dot {
  background: #00d4ff;
  border-color: #00d4ff;
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.8);
  animation: pulse 1.5s ease-in-out infinite;
}

.step-active .step-label {
  color: #00d4ff;
  font-weight: bold;
}

.step-waiting .step-dot {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.step-waiting .step-label {
  color: rgba(255, 255, 255, 0.35);
}

.flow-step {
  position: relative;
}

.flow-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 7px;
  left: 14px;
  width: calc(100% - 14px);
  height: 2px;
  z-index: 0;
}

.step-done:not(:last-child)::after {
  background: #00ff88;
}

.step-active:not(:last-child)::after {
  background: linear-gradient(to right, #00d4ff 50%, rgba(255,255,255,0.1) 50%);
}

.step-waiting:not(:last-child)::after {
  background: rgba(255, 255, 255, 0.12);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 4px rgba(0, 212, 255, 0.6); }
  50% { box-shadow: 0 0 10px rgba(0, 212, 255, 1); }
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  color: #00f0ff;
  min-width: 40px;
  text-align: right;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-1 { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }
.status-2 { background: rgba(255, 204, 0, 0.2); color: #ffcc00; }
.status-3 { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
.status-4 { background: rgba(255, 102, 102, 0.2); color: #ff6666; }

.empty-cell {
  text-align: center;
  padding: 40px !important;
  color: rgba(255, 255, 255, 0.4);
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid rgba(0, 240, 255, 0.2);
  border-left: 1px solid rgba(0, 240, 255, 0.2);
  border-right: 1px solid rgba(0, 240, 255, 0.2);
  border-bottom: none;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 -1px -1px -1px;
}

.page-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 8px 12px;
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 5px;
  color: #00f0ff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: rgba(0, 240, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-num {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.page-num:hover {
  background: rgba(0, 240, 255, 0.1);
  border-color: #00f0ff;
}

.page-num.active {
  background: linear-gradient(135deg, #00f0ff, #0080ff);
  color: #000;
  font-weight: bold;
  border-color: #00f0ff;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.jump-input {
  width: 60px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 5px;
  color: #00f0ff;
  font-size: 13px;
  text-align: center;
  outline: none;
}

.jump-input:focus {
  border-color: #00f0ff;
}

.page-size-select {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.size-select {
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 5px;
  color: #00f0ff;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.size-select:focus {
  border-color: #00f0ff;
}

.size-select option {
  background: #0a0e27;
  color: #fff;
}

/* 加载动画 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 240, 255, 0.2);
  border-top-color: #00f0ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.title {
  text-align: center;
}
</style>
