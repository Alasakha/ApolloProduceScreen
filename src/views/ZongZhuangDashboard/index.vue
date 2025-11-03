<!-- 金工绩效看板入口文件 -->
<template>
<body>
  <Header></Header>
  
  <div class="dashboard-container">
    <!-- <div class="dashboard-title">
      <h1>金工一部/二部绩效管理看板</h1>
    </div> -->
    
    <div class="dashboard-content">
      <!-- 左侧总装一部 -->
      <div class="department-section">
        <div class="department-header">
          <h2>总装一课</h2>
        </div>
        <div class="panels-container">
          <PerformancePanel
            v-for="panel in department1Panels"
            :key="panel.id"
            :title="panel.title"
            :description="panel.description"
            :chart-title="panel.chartTitle"
            :chart-type="panel.chartType"
            :chart-data="panel.chartData"
            :chart-type-description="panel.chartTypeDescription"
            :is-top-quality-mode="panel.isTopQualityMode"
            :second-chart-title="panel.secondChartTitle"
            :second-chart-type="panel.secondChartType"
            :second-chart-data="panel.secondChartData"
            :hide-regular="panel.hideRegular"
          />
        </div>
      </div>
      
      <!-- 右侧总装二部 -->
      <div class="department-section">
        <div class="department-header">
          <h2>总装二课</h2>
        </div>
        <div class="panels-container">
          <PerformancePanel
            v-for="panel in department2Panels"
            :key="panel.id"
            :title="panel.title"
            :description="panel.description"
            :chart-title="panel.chartTitle"
            :chart-type="panel.chartType"
            :chart-data="panel.chartData"
            :chart-type-description="panel.chartTypeDescription"
            :is-top-quality-mode="panel.isTopQualityMode"
            :second-chart-title="panel.secondChartTitle"
            :second-chart-type="panel.secondChartType"
            :second-chart-data="panel.secondChartData"
            :hide-regular="panel.hideRegular"
          />
        </div>
      </div>
    </div>
  </div>
</body>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './Header/index.vue'
import PerformancePanel from './components/PerformancePanel.vue'
import { getOrderSettlementPerformance, getQualityReportPerformance, getProductionAchievementRate, getOrderSettlementPerformanceTrend, getQualityReportPerformanceTrend, type GetMesInfoResponse, type ThroughputTrendResponse, type QualityReportPerformanceTrendResponse } from '@/api/getMesInfo'
import { transformQualityReportData, type QualityReportData } from './utils/zhitonglv'
import { transformQualityReportTrendData } from './utils/zhitonglvTrend'

// 定义面板数据类型
interface PanelData {
  id: string
  title: string
  description: Array<{ label: string; value: string }>
  chartTitle: string
  chartType: 'line' | 'bar' | 'pie' | 'gauge'
  chartData: any
  chartTypeDescription: string
  isTopQualityMode?: boolean
  secondChartTitle?: string
  secondChartType?: 'line' | 'bar' | 'pie' | 'gauge'
  secondChartData?: any
  hideRegular?: boolean
}

// 接口返回的数据类型
interface OrderSettlementItem {
  workNo: string | null
  workCenter: string
  customer: string
  productionQuantity: string | null
  inboundQuantity: string | null
  [key: string]: any
}

// 日期工具函数：获取本月第一天和今天的日期（用于orderSettlement接口：YYYYMMDD格式）
function getDateRange() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  
  // 本月第一天
  const firstDay = `${year}${String(month).padStart(2, '0')}01`
  // 今天
  const todayStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
  
  return {
    startDate: firstDay,
    endDate: todayStr
  }
}

// 日期工具函数：获取本月第一天和今天的日期（用于qualityReportPerformance接口：YYYY-MM-DD格式）
function getDateRangeForQuality() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  
  // 本月第一天
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  // 今天
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  return {
    startDate: firstDay,
    endDate: todayStr
  }
}

// 日期工具函数：获取当前月份（用于productionAchievementRate接口：YYYY-MM格式）
function getCurrentMonth() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  
  return `${year}-${String(month).padStart(2, '0')}`
}

// 格式化数字，添加千分位
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 计算百分比
function calculateRate(numerator: number, denominator: number): string {
  if (denominator === 0) return '0%'
  return (numerator / denominator * 100).toFixed(1) + '%'
}

// 转换工单结单率接口数据为面板数据
function transformOrderSettlementData(
  apiData: OrderSettlementItem[],
  _department: '总装一课' | '总装二课'
): Partial<PanelData> {
  // 按客户类型分组计算
  const aClassData = apiData.filter(item => item.customer === 'A')
  const regularData = apiData.filter(item => item.customer === '常规')
  
  // A类数据计算
  const aClassPlanTotal = aClassData.reduce((sum, item) => {
    return sum + parseInt(item.productionQuantity || '0', 10)
  }, 0)
  const aClassCompletedTotal = aClassData.reduce((sum, item) => {
    return sum + parseInt(item.inboundQuantity || '0', 10)
  }, 0)
  const aClassRate = calculateRate(aClassCompletedTotal, aClassPlanTotal)
  
  // 常规数据计算
  const regularPlanTotal = regularData.reduce((sum, item) => {
    return sum + parseInt(item.productionQuantity || '0', 10)
  }, 0)
  const regularCompletedTotal = regularData.reduce((sum, item) => {
    return sum + parseInt(item.inboundQuantity || '0', 10)
  }, 0)
  const regularRate = calculateRate(regularCompletedTotal, regularPlanTotal)
  
  return {
    description: [
      { label: 'A类:月度累计排产工单', value: formatNumber(aClassPlanTotal) },
      { label: '累计准交工单', value: formatNumber(aClassCompletedTotal) },
      { label: '结单率', value: aClassRate },
      { label: '常规:月度累计排产工单', value: formatNumber(regularPlanTotal) },
      { label: '累计准交工单', value: formatNumber(regularCompletedTotal) },
      { label: '结单率', value: regularRate }
    ]
    // 注意：chartData 需要其他接口或历史数据，暂时保持原有数据
  }
}

// 加载状态
const loading1 = ref(false)
const loading2 = ref(false)

// 获取总装一课工单结单率数据
async function fetchDepartment1OrderSettlement() {
  try {
    loading1.value = true
    const { startDate, endDate } = getDateRange()
    const response = await getOrderSettlementPerformance('总装一课', startDate, endDate)
    
    if (response.code === 200 && response.data?.orderSettlement) {
      const transformedData = transformOrderSettlementData(response.data.orderSettlement, '总装一课')
      // 更新第一个面板（工单结单率）的数据
      if (department1Panels.value[0]) {
        department1Panels.value[0].description = transformedData.description || department1Panels.value[0].description
      }
      console.log('✅ 总装一课工单结单率数据获取成功')
    } else {
      console.warn('获取总装一课工单结单率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课工单结单率数据失败:', err)
  } finally {
    loading1.value = false
  }
}

// 获取总装二课工单结单率数据
async function fetchDepartment2OrderSettlement() {
  try {
    loading2.value = true
    const { startDate, endDate } = getDateRange()
    const response = await getOrderSettlementPerformance('总装二课', startDate, endDate)
    
    if (response.code === 200 && response.data?.orderSettlement) {
      const transformedData = transformOrderSettlementData(response.data.orderSettlement, '总装二课')
      // 更新第一个面板（工单结单率）的数据
      if (department2Panels.value[0]) {
        department2Panels.value[0].description = transformedData.description || department2Panels.value[0].description
      }
      console.log('✅ 总装二课工单结单率数据获取成功')
    } else {
      console.warn('获取总装二课工单结单率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课工单结单率数据失败:', err)
  } finally {
    loading2.value = false
  }
}

// 获取总装一课直通率数据
async function fetchDepartment1ThroughputRate() {
  try {
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getQualityReportPerformance('10041005', startDate, endDate)
    
    if (response.code === 200 && response.data) {
      const transformedData = transformQualityReportData(response.data as QualityReportData, '总装一课')
      // 更新第二个面板（直通率）的数据
      if (department1Panels.value[1]) {
        department1Panels.value[1].description = transformedData.description || department1Panels.value[1].description
      }
      console.log('✅ 总装一课直通率数据获取成功')
    } else {
      console.warn('获取总装一课直通率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课直通率数据失败:', err)
  }
}

// 获取总装二课直通率数据
async function fetchDepartment2ThroughputRate() {
  try {
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getQualityReportPerformance('20042005', startDate, endDate)
    
    if (response.code === 200 && response.data) {
      const transformedData = transformQualityReportData(response.data as QualityReportData, '总装二课')
      // 更新第二个面板（直通率）的数据
      if (department2Panels.value[1]) {
        department2Panels.value[1].description = transformedData.description || department2Panels.value[1].description
      }
      console.log('✅ 总装二课直通率数据获取成功')
    } else {
      console.warn('获取总装二课直通率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课直通率数据失败:', err)
  }
}

// 获取总装一课直通率趋势数据
async function fetchDepartment1ThroughputRateTrend() {
  try {
    const response = await getQualityReportPerformanceTrend('10041005')
    
    if (response.code === 200 && response.data) {
      const transformedData = transformQualityReportTrendData(response as QualityReportPerformanceTrendResponse, '总装一课')
      
      // 更新第二个面板（直通率）的图表数据
      if (department1Panels.value[1]) {
        if (transformedData.categories && transformedData.series) {
          department1Panels.value[1].chartData = {
            categories: transformedData.categories,
            series: transformedData.series
          }
        }
      }
      console.log('✅ 总装一课直通率趋势数据获取成功')
    } else {
      console.warn('获取总装一课直通率趋势数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课直通率趋势数据失败:', err)
  }
}

// 获取总装二课直通率趋势数据
async function fetchDepartment2ThroughputRateTrend() {
  try {
    const response = await getQualityReportPerformanceTrend('20042005')
    
    if (response.code === 200 && response.data) {
      const transformedData = transformQualityReportTrendData(response as QualityReportPerformanceTrendResponse, '总装二课')
      
      // 更新第二个面板（直通率）的图表数据
      if (department2Panels.value[1]) {
        if (transformedData.categories && transformedData.series) {
          department2Panels.value[1].chartData = {
            categories: transformedData.categories,
            series: transformedData.series
          }
        }
      }
      console.log('✅ 总装二课直通率趋势数据获取成功')
    } else {
      console.warn('获取总装二课直通率趋势数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课直通率趋势数据失败:', err)
  }
}

// 转换结单率趋势接口数据为图表数据
// 标准：总装一课 A类95% 常规类94% | 总装二课 A类95% 常规类94%
// 标准用折线图，实际用柱状图
function transformOrderSettlementTrendData(
  apiData: ThroughputTrendResponse | null,
  department: '总装一课' | '总装二课'
): Partial<PanelData> {
  if (!apiData?.data) {
    return {}
  }

  // 定义标准值
  const standards = {
    '总装一课': { A: 95, 常规: 94 },
    '总装二课': { A: 95, 常规: 94 }
  }
  const aClassStandard = standards[department].A
  const regularStandard = standards[department].常规

  // 按月份排序（YYYYMM格式）
  const monthKeys = Object.keys(apiData.data).sort()
  
  // 月度累计数据统计
  let totalAProduction = 0
  let totalAInbound = 0
  let totalRegularProduction = 0
  let totalRegularInbound = 0

  // 每个月的A类和常规类数据
  const aClassActualData: number[] = []
  const regularActualData: number[] = []
  const categories: string[] = []

  monthKeys.forEach(monthKey => {
    const items = apiData.data[monthKey]
    
    // 计算该月的A类和常规类的总生产数和入库数
    let monthAProduction = 0
    let monthAInbound = 0
    let monthRegularProduction = 0
    let monthRegularInbound = 0

    items.forEach(item => {
      const production = parseFloat(item.productionQuantity || '0')
      const inbound = parseFloat(item.inboundQuantity || '0')
      
      if (item.customer === 'A') {
        monthAProduction += production
        monthAInbound += inbound
      } else if (item.customer === '常规') {
        monthRegularProduction += production
        monthRegularInbound += inbound
      }
    })

    // 计算该月的结单率
    const monthARate = monthAProduction > 0 ? (monthAInbound / monthAProduction * 100) : 0
    const monthRegularRate = monthRegularProduction > 0 ? (monthRegularInbound / monthRegularProduction * 100) : 0

    // 添加到月度数据数组
    aClassActualData.push(parseFloat(monthARate.toFixed(2)))
    regularActualData.push(parseFloat(monthRegularRate.toFixed(2)))
    
    // 月份标签（从YYYYMM转换为X月格式）
    const month = parseInt(monthKey.substring(4, 6))
    categories.push(`${month}月`)

    // 累计统计
    totalAProduction += monthAProduction
    totalAInbound += monthAInbound
    totalRegularProduction += monthRegularProduction
    totalRegularInbound += monthRegularInbound
  })

  // 生成标准线数据（每个月份都是相同的标准值）
  const aClassStandardData = new Array(monthKeys.length).fill(aClassStandard)
  const regularStandardData = new Array(monthKeys.length).fill(regularStandard)

  return {
    chartData: {
      categories,
      series: [
        {
          name: 'A类标准',
          type: 'line', // 标准用折线图
          data: aClassStandardData,
          itemStyle: { color: '#10b981' },
          lineStyle: { type: 'dashed' } // 标准线使用虚线
        },
        {
          name: 'A类实际',
          type: 'bar', // 实际用柱状图
          data: aClassActualData,
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'line', // 标准用折线图
          data: regularStandardData,
          itemStyle: { color: '#f59e0b' },
          lineStyle: { type: 'dashed' } // 标准线使用虚线
        },
        {
          name: '常规实际',
          type: 'bar', // 实际用柱状图
          data: regularActualData,
          itemStyle: { color: '#ef4444' }
        }
      ]
    }
  }
}

// 获取总装一课结单率趋势数据
async function fetchDepartment1OrderSettlementTrend() {
  try {
    const response = await getOrderSettlementPerformanceTrend('总装一课')
    
    if (response.code === 200 && response.data) {
      const transformedData = transformOrderSettlementTrendData(response as ThroughputTrendResponse, '总装一课')
      
      // 更新第一个面板（结单率）的图表数据
      if (department1Panels.value[0]) {
        if (transformedData.chartData) {
          department1Panels.value[0].chartData = transformedData.chartData
        }
      }
      console.log('✅ 总装一课结单率趋势数据获取成功')
    } else {
      console.warn('获取总装一课结单率趋势数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课结单率趋势数据失败:', err)
  }
}

// 获取总装二课结单率趋势数据
async function fetchDepartment2OrderSettlementTrend() {
  try {
    const response = await getOrderSettlementPerformanceTrend('总装二课')
    
    if (response.code === 200 && response.data) {
      const transformedData = transformOrderSettlementTrendData(response as ThroughputTrendResponse, '总装二课')
      
      // 更新第一个面板（结单率）的图表数据
      if (department2Panels.value[0]) {
        if (transformedData.chartData) {
          department2Panels.value[0].chartData = transformedData.chartData
        }
      }
      console.log('✅ 总装二课结单率趋势数据获取成功')
    } else {
      console.warn('获取总装二课结单率趋势数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课结单率趋势数据失败:', err)
  }
}

// 转换人效达成率接口数据为面板数据
// 根据公式：实际达成 = (装配达成天数 + 包装达成天数) / (装配排产天数 + 包装排产天数)
// 达成率 = 实际达成 / 标准(89%)
function transformEfficiencyData(
  assemblyData: GetMesInfoResponse | null,
  packagingData: GetMesInfoResponse | null,
  standard: number = 89
): Partial<PanelData> {
  if (!assemblyData?.data || !packagingData?.data) {
    return {}
  }

  const assemblyPcDays = assemblyData.data.pcDays || 0
  const assemblyAchieveDays = assemblyData.data.achieveDays || 0
  const packagingPcDays = packagingData.data.pcDays || 0
  const packagingAchieveDays = packagingData.data.achieveDays || 0

  // 计算实际达成：装配+包装达成天数 / 装配+包装排产天数
  const totalPcDays = assemblyPcDays + packagingPcDays
  const totalAchieveDays = assemblyAchieveDays + packagingAchieveDays
  const actualAchievement = totalPcDays > 0 
    ? (totalAchieveDays / totalPcDays * 100).toFixed(1) + '%'
    : '0%'

  // 计算达成率：实际达成 / 标准
  const achievementRate = totalPcDays > 0 && standard > 0
    ? ((totalAchieveDays / totalPcDays) / (standard / 100) * 100).toFixed(1) + '%'
    : '0%'

  return {
    description: [
      { label: '人效达成率标准', value: `${standard}%` },
      { label: '实际达成', value: actualAchievement },
      { label: '达成率', value: achievementRate }
    ]
  }
}

// 获取总装一课人效达成率数据
async function fetchDepartment1Efficiency() {
  try {
    const monthDay = getCurrentMonth()
    
    // 并行获取装配(1004)和包装(1005)的数据
    const [assemblyResponse, packagingResponse] = await Promise.all([
      getProductionAchievementRate('1004', monthDay),
      getProductionAchievementRate('1005', monthDay)
    ])
    
    if (assemblyResponse.code === 200 && packagingResponse.code === 200) {
      const transformedData = transformEfficiencyData(
        assemblyResponse as GetMesInfoResponse,
        packagingResponse as GetMesInfoResponse,
        89 // 标准89%
      )
      
      // 更新第三个面板（人效达成率）的数据
      if (department1Panels.value[2]) {
        department1Panels.value[2].description = transformedData.description || department1Panels.value[2].description
      }
      console.log('✅ 总装一课人效达成率数据获取成功')
    } else {
      console.warn('获取总装一课人效达成率数据失败:', assemblyResponse.message || packagingResponse.message)
    }
  } catch (err: any) {
    console.error('获取总装一课人效达成率数据失败:', err)
  }
}

// 获取总装二课人效达成率数据
async function fetchDepartment2Efficiency() {
  try {
    const monthDay = getCurrentMonth()
    
    // 并行获取装配(2004)和包装(2005)的数据
    const [assemblyResponse, packagingResponse] = await Promise.all([
      getProductionAchievementRate('2004', monthDay),
      getProductionAchievementRate('2005', monthDay)
    ])
    
    if (assemblyResponse.code === 200 && packagingResponse.code === 200) {
      const transformedData = transformEfficiencyData(
        assemblyResponse as GetMesInfoResponse,
        packagingResponse as GetMesInfoResponse,
        89 // 标准89%
      )
      
      // 更新第三个面板（人效达成率）的数据
      if (department2Panels.value[2]) {
        department2Panels.value[2].description = transformedData.description || department2Panels.value[2].description
      }
      console.log('✅ 总装二课人效达成率数据获取成功')
    } else {
      console.warn('获取总装二课人效达成率数据失败:', assemblyResponse.message || packagingResponse.message)
    }
  } catch (err: any) {
    console.error('获取总装二课人效达成率数据失败:', err)
  }
}


// 左侧金工一部的面板数据
const department1Panels = ref<PanelData[]>([
  {
    id: '1',
    title: '总装一课工单结单率',
    description: [
      { label: 'A类:月度累计排产工单', value: '1,250' },
      { label: '累计准交工单', value: '1,180' },
      { label: '结单率', value: '94.4%' },
      { label: '常规:月度累计排产工单', value: '2,100' },
      { label: '累计准交工单', value: '1,980' },
      { label: '结单率', value: '94.3%' }
    ],
    chartTitle: '工单结单率趋势',
    chartType: 'bar' as const, // 混合图表，但默认类型设为 bar
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'line', // 标准用折线图
          data: [95, 95, 95, 95, 95, 95],
          itemStyle: { color: '#10b981' },
          lineStyle: { type: 'dashed' } // 标准线使用虚线
        },
        {
          name: 'A类实际',
          type: 'bar', // 实际用柱状图
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'line', // 标准用折线图
          data: [94, 94, 94, 94, 94, 94],
          itemStyle: { color: '#f59e0b' },
          lineStyle: { type: 'dashed' } // 标准线使用虚线
        },
        {
          name: '常规实际',
          type: 'bar', // 实际用柱状图
          data: [93, 94, 92, 93, 94, 93],
          itemStyle: { color: '#ef4444' }
        }
      ]
    },
    chartTypeDescription: '折线图(标准) + 柱状图(实际)'
  },
  {
    id: '2',
    title: '总装一课直通率',
    description: [
      { label: 'A类直通率标准', value: '75%' },
      { label: 'A类月度累计直通率', value: '97.2%' },
      { label: '达成率', value: '95.7%' },
      { label: '常规直通率标准', value: '72%' },
      { label: '常规月度累计直通率', value: '96.5%' },
      { label: '达成率', value: '94.3%' }
    ],
    chartTitle: '直通率趋势',
    chartType: 'line' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'line',
          data: [75, 75, 75, 75, 75, 75],
          itemStyle: { color: '#10b981' },
          lineStyle: { type: 'dashed' }
        },
        {
          name: 'A类实际',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0],
          itemStyle: { color: '#3b82f6' },
          smooth: true
        },
        {
          name: '常规标准',
          type: 'line',
          data: [72, 72, 72, 72, 72, 72],
          itemStyle: { color: '#f59e0b' },
          lineStyle: { type: 'dashed' }
        },
        {
          name: '常规实际',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0],
          itemStyle: { color: '#ef4444' },
          smooth: true
        }
      ]
    },
    chartTypeDescription: '折线图(每月标准和实际)'
  },
  {
    id: '3',
    title: '总装一课人效达成率',
    description: [
      { label: '人效达成率标准', value: '89%' },
      { label: '实际达成', value: '0%' },
      { label: '达成率', value: '0%' }
    ],
    chartTitle: '人效达成率',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '计划数',
          type: 'bar',
          data: [15000, 15000, 15000, 15000, 15000, 15000],
          itemStyle: { color: '#6b7280' }
        },
        {
          name: '完成数',
          type: 'bar',
          data: [14250, 14300, 14150, 14400, 14200, 14250],
          itemStyle: { color: '#10b981' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月计划和实际)',
    hideRegular: true
  },
  {
    id: '4',
    title: 'TOP质量问题',
    description: [], // 空数组，不显示数据区域
    chartTitle: '总装TOP前5不良数',
    chartType: 'pie' as const,
    chartData: {
      series: [
        { name: '装配错误', value: 35, itemStyle: { color: '#ef4444' } },
        { name: '零件缺失', value: 28, itemStyle: { color: '#f59e0b' } },
        { name: '尺寸偏差', value: 22, itemStyle: { color: '#3b82f6' } },
        { name: '功能异常', value: 18, itemStyle: { color: '#10b981' } },
        { name: '其他', value: 22, itemStyle: { color: '#6b7280' } }
      ]
    },
    chartTypeDescription: '饼图(显示总装TOP前5不良数和占比)',
    // TOP质量问题模式配置
    isTopQualityMode: true,
    secondChartTitle: '包装TOP前5不良数',
    secondChartType: 'pie' as const,
    secondChartData: {
      series: [
        { name: '包装破损', value: 30, itemStyle: { color: '#ef4444' } },
        { name: '标签错误', value: 25, itemStyle: { color: '#f59e0b' } },
        { name: '密封不良', value: 20, itemStyle: { color: '#3b82f6' } },
        { name: '尺寸不符', value: 15, itemStyle: { color: '#10b981' } },
        { name: '其他', value: 15, itemStyle: { color: '#6b7280' } }
      ]
    }
  }
])

// 右侧金工一部的面板数据
const department2Panels = ref<PanelData[]>([
  {
    id: '1',
    title: '总装二课工单结单率',
    description: [
      { label: 'A类:月度累计排产工单', value: '1,180' },
      { label: '累计准交工单', value: '1,120' },
      { label: '结单率', value: '94.9%' },
      { label: '常规:月度累计排产工单', value: '1,950' },
      { label: '累计准交工单', value: '1,850' },
      { label: '结单率', value: '94.9%' }
    ],
    chartTitle: '工单结单率趋势',
    chartType: 'bar' as const, // 混合图表，但默认类型设为 bar
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'line', // 标准用折线图
          data: [95, 95, 95, 95, 95, 95],
          itemStyle: { color: '#10b981' },
          lineStyle: { type: 'dashed' } // 标准线使用虚线
        },
        {
          name: 'A类实际',
          type: 'bar', // 实际用柱状图
          data: [94, 95, 93, 94, 95, 94],
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '常规标准',
          type: 'line', // 标准用折线图
          data: [94, 94, 94, 94, 94, 94],
          itemStyle: { color: '#f59e0b' },
          lineStyle: { type: 'dashed' } // 标准线使用虚线
        },
        {
          name: '常规实际',
          type: 'bar', // 实际用柱状图
          data: [93, 94, 92, 93, 94, 93],
          itemStyle: { color: '#ef4444' }
        }
      ]
    },
    chartTypeDescription: '折线图(标准) + 柱状图(实际)'
  },
  {
    id: '2',
    title: '总装二课直通率',
    description: [
    { label: 'A类直通率标准', value: '75%' },
      { label: 'A类月度累计直通率', value: '97.2%' },
      { label: '达成率', value: '95.7%' },
      { label: '常规直通率标准', value: '72%' },
      { label: '常规月度累计直通率', value: '96.5%' },
      { label: '达成率', value: '94.3%' }
    ],
    chartTitle: '直通率趋势',
    chartType: 'line' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: 'A类标准',
          type: 'line',
          data: [89, 89, 89, 89, 89, 89],
          itemStyle: { color: '#10b981' },
          lineStyle: { type: 'dashed' }
        },
        {
          name: 'A类实际',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0],
          itemStyle: { color: '#3b82f6' },
          smooth: true
        },
        {
          name: '常规标准',
          type: 'line',
          data: [87, 87, 87, 87, 87, 87],
          itemStyle: { color: '#f59e0b' },
          lineStyle: { type: 'dashed' }
        },
        {
          name: '常规实际',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0],
          itemStyle: { color: '#ef4444' },
          smooth: true
        }
      ]
    },
    chartTypeDescription: '折线图(每月标准和实际)'
  },
  {
    id: '3',
    title: '总装二课人效达成率',
    description: [
      { label: '人效达成率标准', value: '89%' },
      { label: '实际达成', value: '0%' },
      { label: '达成率', value: '0%' }
    ],
    chartTitle: '人效达成率',
    chartType: 'bar' as const,
    chartData: {
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '计划天数',
          type: 'bar',
          data: [22, 22, 22, 22, 22, 22],
          itemStyle: { color: '#6b7280' }
        },
        {
          name: '达成天数',
          type: 'bar',
          data: [21, 21, 20, 22, 21, 21],
          itemStyle: { color: '#10b981' }
        }
      ]
    },
    chartTypeDescription: '柱状图(每月计划和实际)',
    hideRegular: true
  },
  {
    id: '4',
    title: 'TOP质量问题',
    description: [], // 空数组，不显示数据区域
    chartTitle: '总装TOP前5不良数',
    chartType: 'pie' as const,
    chartData: {
      series: [
        { name: '装配错误', value: 28, itemStyle: { color: '#ef4444' } },
        { name: '零件缺失', value: 22, itemStyle: { color: '#f59e0b' } },
        { name: '尺寸偏差', value: 18, itemStyle: { color: '#3b82f6' } },
        { name: '功能异常', value: 15, itemStyle: { color: '#10b981' } },
        { name: '其他', value: 15, itemStyle: { color: '#6b7280' } }
      ]
    },
    chartTypeDescription: '饼图(显示总装TOP前5不良数和占比)',
    // TOP质量问题模式配置
    isTopQualityMode: true,
    secondChartTitle: '包装TOP前5不良数',
    secondChartType: 'pie' as const,
    secondChartData: {
      series: [
        { name: '包装破损', value: 25, itemStyle: { color: '#ef4444' } },
        { name: '标签错误', value: 20, itemStyle: { color: '#f59e0b' } },
        { name: '密封不良', value: 18, itemStyle: { color: '#3b82f6' } },
        { name: '尺寸不符', value: 12, itemStyle: { color: '#10b981' } },
        { name: '其他', value: 10, itemStyle: { color: '#6b7280' } }
      ]
    }
  }
])

// 定时更新数据
let updateTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  console.log('总装绩效看板已加载')
  
  // 并行获取两个部门的所有数据
  Promise.all([
    fetchDepartment1OrderSettlement(),
    fetchDepartment2OrderSettlement(),
    fetchDepartment1ThroughputRate(),
    fetchDepartment2ThroughputRate(),
    fetchDepartment1OrderSettlementTrend(), // 获取总装一课结单率趋势数据
    fetchDepartment2OrderSettlementTrend(), // 获取总装二课结单率趋势数据
    fetchDepartment1ThroughputRateTrend(), // 获取总装一课直通率趋势数据
    fetchDepartment2ThroughputRateTrend(), // 获取总装二课直通率趋势数据
    fetchDepartment1Efficiency(),
    fetchDepartment2Efficiency()
  ])
  
  // 每5分钟更新一次数据（根据实际需求调整）
  updateTimer = setInterval(() => {
    fetchDepartment1OrderSettlement()
    fetchDepartment2OrderSettlement()
    fetchDepartment1ThroughputRate()
    fetchDepartment2ThroughputRate()
    fetchDepartment1OrderSettlementTrend() // 获取总装一课结单率趋势数据
    fetchDepartment2OrderSettlementTrend() // 获取总装二课结单率趋势数据
    fetchDepartment1ThroughputRateTrend() // 获取总装一课直通率趋势数据
    fetchDepartment2ThroughputRateTrend() // 获取总装二课直通率趋势数据
    fetchDepartment1Efficiency()
    fetchDepartment2Efficiency()
  }, 300000) // 5分钟
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
    updateTimer = null
  }
})
</script>

<style scoped>
body{
width: 100vw;
height: 100vh;
background: 
linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
 url('@/assets/background.jpg') no-repeat center center;
background-size: cover;
transform-origin: center center;
position: relative;
transition: transform 0.3s ease-in-out;
overflow-x: hidden;
}

.dashboard-container {
  padding: 6px;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.dashboard-content {
  width: 100%;
  display: flex;
  gap: 6px;
  height: 100%;
}

.department-section {
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 6px;
  border: 1px solid rgba(0, 150, 255, 0.3);
  height: 93%;
  overflow: hidden;
}

.department-header {
  background: rgba(0, 150, 255, 0.2);
  border-radius: 3px;
  padding: 4px 8px;
  margin-bottom: 6px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
}

.department-header h2 {
  color: #00d4ff;
  font-size: 17px;
  font-weight: bold;
  margin: 0;
}

.panels-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  height: calc(100% - 40px);
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .department-header h2 {
    font-size: 19px;
  }
  
  .panels-container {
    gap: 8px;
  }
}
</style>