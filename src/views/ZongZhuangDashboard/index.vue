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
            :loading="department1Loading[panel.id]"
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
            :loading="department2Loading[panel.id]"
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
import { getOrderSettlementPerformance, getQualityReportPerformance, getProductionAchievementRate, getOrderSettlementPerformanceTrend, getQualityReportPerformanceTrend, getProductionAchievementRatePerformanceTrend, type GetMesInfoResponse, type ThroughputTrendResponse, type QualityReportPerformanceTrendResponse, type ProductionAchievementRatePerformanceTrendResponse } from '@/api/getMesInfo'
import { transformQualityReportData, type QualityReportData } from './utils/zhitonglv'
import { transformQualityReportTrendData } from './utils/zhitonglvTrend'
import { transformEfficiencyTrendData } from './utils/efficiencyTrend'
import { fetchDepartment1TopQuality, fetchDepartment2TopQuality } from './utils/topQuality'

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
  department: '总装一课' | '总装二课'
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
  
  // 定义目标结单率标准值
  const standards = {
    '总装一课': { A: 100, 常规: 95 },
    '总装二课': { A: 100, 常规: 95 }
  }
  const aClassTargetRate = standards[department].A + '%'
  const regularTargetRate = standards[department].常规 + '%'
  
  return {
    description: [
      { label: 'A类:月度累计排产工单', value: formatNumber(aClassPlanTotal) },
      { label: '累计准交工单', value: formatNumber(aClassCompletedTotal) },
      { label: '结单率', value: aClassRate },
      { label: '工单目标结单率', value: aClassTargetRate },
      { label: '常规:月度累计排产工单', value: formatNumber(regularPlanTotal) },
      { label: '累计准交工单', value: formatNumber(regularCompletedTotal) },
      { label: '结单率', value: regularRate },
      { label: '工单目标结单率', value: regularTargetRate }
    ]
    // 注意：chartData 需要其他接口或历史数据，暂时保持原有数据
  }
}

// 为每个面板添加独立的加载状态（初始状态为 true，表示正在加载）
const department1Loading = ref<Record<string, boolean>>({
  '1': true, // 工单结单率
  '2': true, // 直通率
  '3': true, // 人效达成率
  '4': true  // TOP质量问题
})

const department2Loading = ref<Record<string, boolean>>({
  '1': true, // 工单结单率
  '2': true, // 直通率
  '3': true, // 人效达成率
  '4': true  // TOP质量问题
})

// 获取总装一课工单结单率数据
async function fetchDepartment1OrderSettlement() {
  try {
    department1Loading.value['1'] = true
    const { startDate, endDate } = getDateRange()
    const response = await getOrderSettlementPerformance('总装一课', startDate, endDate)
    
    if (response.code === 200 && response.data?.orderSettlement) {
      const transformedData = transformOrderSettlementData(response.data.orderSettlement, '总装一课')
      // 更新第一个面板（工单结单率）的数据
      if (department1Panels.value[0]) {
        department1Panels.value[0].description = transformedData.description || []
      }
      console.log('✅ 总装一课工单结单率数据获取成功')
    } else {
      console.warn('获取总装一课工单结单率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课工单结单率数据失败:', err)
  } finally {
    department1Loading.value['1'] = false
  }
}

// 获取总装二课工单结单率数据
async function fetchDepartment2OrderSettlement() {
  try {
    department2Loading.value['1'] = true
    const { startDate, endDate } = getDateRange()
    const response = await getOrderSettlementPerformance('总装二课', startDate, endDate)
    
    if (response.code === 200 && response.data?.orderSettlement) {
      const transformedData = transformOrderSettlementData(response.data.orderSettlement, '总装二课')
      // 更新第一个面板（工单结单率）的数据
      if (department2Panels.value[0]) {
        department2Panels.value[0].description = transformedData.description || []
      }
      console.log('✅ 总装二课工单结单率数据获取成功')
    } else {
      console.warn('获取总装二课工单结单率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课工单结单率数据失败:', err)
  } finally {
    department2Loading.value['1'] = false
  }
}

// 获取总装一课直通率数据
async function fetchDepartment1ThroughputRate() {
  try {
    department1Loading.value['2'] = true
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getQualityReportPerformance('10041005', startDate, endDate)
    
    if (response.code === 200 && response.data) {
      const transformedData = transformQualityReportData(response.data as QualityReportData, '总装一课')
      // 更新第二个面板（直通率）的数据
      if (department1Panels.value[1]) {
        department1Panels.value[1].description = transformedData.description || []
      }
      console.log('✅ 总装一课直通率数据获取成功')
    } else {
      console.warn('获取总装一课直通率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课直通率数据失败:', err)
  } finally {
    department1Loading.value['2'] = false
  }
}

// 获取总装二课直通率数据
async function fetchDepartment2ThroughputRate() {
  try {
    department2Loading.value['2'] = true
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getQualityReportPerformance('20042005', startDate, endDate)
    
    if (response.code === 200 && response.data) {
      const transformedData = transformQualityReportData(response.data as QualityReportData, '总装二课')
      // 更新第二个面板（直通率）的数据
      if (department2Panels.value[1]) {
        department2Panels.value[1].description = transformedData.description || []
      }
      console.log('✅ 总装二课直通率数据获取成功')
    } else {
      console.warn('获取总装二课直通率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课直通率数据失败:', err)
  } finally {
    department2Loading.value['2'] = false
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
    '总装一课': { A: 100, 常规: 95 },
    '总装二课': { A: 100, 常规: 95 }
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
          lineStyle: { type: 'solid' }, // 标准线使用实线
          label: {
            show: true,
            position: 'right', // 标准线标签显示在右边
            formatter: (params: any) => {
              // 只在最后一个数据点显示标签
              if (params.dataIndex === aClassStandardData.length - 1) {
                return params.value.toFixed(1) + '%'
              }
              return ''
            },
            color: '#fff',
            fontSize: 11
          }
        },
        {
          name: 'A类实际',
          type: 'bar', // 实际用柱状图
          data: aClassActualData,
          itemStyle: { color: '#9ca3af' },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return params.value.toFixed(1) + '%'
            },
            color: '#fff',
            fontSize: 11
          }
        },
        {
          name: '常规标准',
          type: 'line', // 标准用折线图
          data: regularStandardData,
          itemStyle: { color: '#f59e0b' },
          lineStyle: { type: 'solid' }, // 标准线使用实线
          label: {
            show: true,
            position: 'right', // 标准线标签显示在右边
            formatter: (params: any) => {
              // 只在最后一个数据点显示标签
              if (params.dataIndex === regularStandardData.length - 1) {
                return params.value.toFixed(1) + '%'
              }
              return ''
            },
            color: '#fff',
            fontSize: 11
          }
        },
        {
          name: '常规实际',
          type: 'bar', // 实际用柱状图
          data: regularActualData,
          itemStyle: { color: '#3b82f6' },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => {
              return params.value.toFixed(1) + '%'
            },
            color: '#fff',
            fontSize: 11
          }
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
// 达成率 = 实际达成 / 标准
// 如果只提供单个数据源，则只使用该数据源
function transformEfficiencyData(
  assemblyData: GetMesInfoResponse | null,
  packagingData: GetMesInfoResponse | null = null,
  standard: number = 89
): Partial<PanelData> {
  if (!assemblyData?.data) {
    return {}
  }

  const assemblyPcDays = assemblyData.data.pcDays || 0
  const assemblyAchieveDays = assemblyData.data.achieveDays || 0
  const packagingPcDays = packagingData?.data?.pcDays || 0
  const packagingAchieveDays = packagingData?.data?.achieveDays || 0

  // 计算实际达成：装配+包装达成天数 / 装配+包装排产天数
  const totalPcDays = assemblyPcDays + packagingPcDays
  const totalAchieveDays = assemblyAchieveDays + packagingAchieveDays
  const actualAchievement = totalPcDays > 0 
    ? (totalAchieveDays / totalPcDays * 100).toFixed(1) + '%'
    : '0%'

  // 计算达成率：实际达成 / 标准
  const actualAchievementNum = totalPcDays > 0 
    ? (totalAchieveDays / totalPcDays * 100)
    : 0
  const achievementRate = standard > 0
    ? (actualAchievementNum / standard * 100).toFixed(1) + '%'
    : '0%'

  return {
    description: [
      { label: '人效达成率标准', value: standard + '%' },
      { label: '实际达成', value: actualAchievement },
      { label: '达成率', value: achievementRate }
    ]
  }
}

// 获取总装一课人效达成率数据
async function fetchDepartment1Efficiency() {
  try {
    department1Loading.value['3'] = true
    const monthDay = getCurrentMonth()
    
    // 获取1004的数据
    const response = await getProductionAchievementRate('1004', monthDay)
    
    if (response.code === 200) {
      const transformedData = transformEfficiencyData(
        response as GetMesInfoResponse,
        null,
        89
      )
      
      // 更新第三个面板（人效达成率）的数据
      if (department1Panels.value[2]) {
        department1Panels.value[2].description = transformedData.description || []
      }
      console.log('✅ 总装一课人效达成率数据获取成功')
    } else {
      console.warn('获取总装一课人效达成率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课人效达成率数据失败:', err)
  } finally {
    department1Loading.value['3'] = false
  }
}

// 获取总装二课人效达成率数据
async function fetchDepartment2Efficiency() {
  try {
    department2Loading.value['3'] = true
    const monthDay = getCurrentMonth()
    
    // 获取2004的数据
    const response = await getProductionAchievementRate('2004', monthDay)
    
    if (response.code === 200) {
      const transformedData = transformEfficiencyData(
        response as GetMesInfoResponse,
        null,
        89
      )
      
      // 更新第三个面板（人效达成率）的数据
      if (department2Panels.value[2]) {
        department2Panels.value[2].description = transformedData.description || []
      }
      console.log('✅ 总装二课人效达成率数据获取成功')
    } else {
      console.warn('获取总装二课人效达成率数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课人效达成率数据失败:', err)
  } finally {
    department2Loading.value['3'] = false
  }
}

// 获取总装一课人效达成率趋势数据
async function fetchDepartment1EfficiencyTrend() {
  try {
    // 获取1004的趋势数据
    const response = await getProductionAchievementRatePerformanceTrend('1004')
    
    if (response.code === 200) {
      const transformedData = transformEfficiencyTrendData(
        response as ProductionAchievementRatePerformanceTrendResponse
      )
      
      // 更新第三个面板（人效达成率）的图表数据
      if (department1Panels.value[2]) {
        if (transformedData.categories && transformedData.series) {
          department1Panels.value[2].chartData = {
            categories: transformedData.categories,
            series: transformedData.series
          }
        }
      }
      console.log('✅ 总装一课人效达成率趋势数据获取成功')
    } else {
      console.warn('获取总装一课人效达成率趋势数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装一课人效达成率趋势数据失败:', err)
  }
}

// 获取总装二课人效达成率趋势数据
async function fetchDepartment2EfficiencyTrend() {
  try {
    // 获取2004的趋势数据
    const response = await getProductionAchievementRatePerformanceTrend('2004')
    
    if (response.code === 200) {
      const transformedData = transformEfficiencyTrendData(
        response as ProductionAchievementRatePerformanceTrendResponse
      )
      
      // 更新第三个面板（人效达成率）的图表数据
      if (department2Panels.value[2]) {
        if (transformedData.categories && transformedData.series) {
          department2Panels.value[2].chartData = {
            categories: transformedData.categories,
            series: transformedData.series
          }
        }
      }
      console.log('✅ 总装二课人效达成率趋势数据获取成功')
    } else {
      console.warn('获取总装二课人效达成率趋势数据失败:', response.message)
    }
  } catch (err: any) {
    console.error('获取总装二课人效达成率趋势数据失败:', err)
  }
}

// 获取总装一课TOP质量问题数据
async function fetchDepartment1TopQualityData() {
  try {
    department1Loading.value['4'] = true
    const qualityData = await fetchDepartment1TopQuality()
    
    // 更新第四个面板（TOP质量问题）的数据
    if (department1Panels.value[3]) {
      // 更新装配饼图数据
      if (qualityData.assembly && qualityData.assembly.length > 0) {
        department1Panels.value[3].chartData = {
          series: qualityData.assembly
        }
      }
      // 更新包装饼图数据（即使为空也设置，保持UI一致性）
      department1Panels.value[3].secondChartData = qualityData.packaging && qualityData.packaging.length > 0
        ? {
            series: qualityData.packaging
          }
        : {
            series: []
          }
    }
    console.log('✅ 总装一课TOP质量问题数据获取成功')
  } catch (err: any) {
    console.error('获取总装一课TOP质量问题数据失败:', err)
  } finally {
    department1Loading.value['4'] = false
  }
}

// 获取总装二课TOP质量问题数据
async function fetchDepartment2TopQualityData() {
  try {
    department2Loading.value['4'] = true
    const qualityData = await fetchDepartment2TopQuality()
    
    // 更新第四个面板（TOP质量问题）的数据
    if (department2Panels.value[3]) {
      // 更新装配饼图数据
      if (qualityData.assembly && qualityData.assembly.length > 0) {
        department2Panels.value[3].chartData = {
          series: qualityData.assembly
        }
      }
      // 更新包装饼图数据（即使为空也设置，保持与总装一课一致的UI）
      department2Panels.value[3].secondChartData = qualityData.packaging && qualityData.packaging.length > 0
        ? {
            series: qualityData.packaging
          }
        : {
            series: []
          }
    }
    console.log('✅ 总装二课TOP质量问题数据获取成功')
  } catch (err: any) {
    console.error('获取总装二课TOP质量问题数据失败:', err)
  } finally {
    department2Loading.value['4'] = false
  }
}


// 左侧总装一课的面板数据（初始化为空状态）
const department1Panels = ref<PanelData[]>([
  {
    id: '1',
    title: '总装一课工单结单率',
    description: [],
    chartTitle: '工单结单率趋势',
    chartType: 'bar' as const,
    chartData: null,
    chartTypeDescription: '折线图(标准) + 柱状图(实际)'
  },
  {
    id: '2',
    title: '总装一课直通率',
    description: [],
    chartTitle: '直通率趋势',
    chartType: 'line' as const,
    chartData: null,
    chartTypeDescription: '折线图(每月标准和实际)'
  },
  {
    id: '3',
    title: '总装一课人效达成率',
    description: [],
    chartTitle: '人效达成率',
    chartType: 'bar' as const,
    chartData: null,
    chartTypeDescription: '柱状图(每月计划和实际)',
    hideRegular: true
  },
  {
    id: '4',
    title: 'TOP质量问题',
    description: [],
    chartTitle: '总装TOP前5不良数',
    chartType: 'pie' as const,
    chartData: null,
    chartTypeDescription: '饼图(显示总装TOP前5不良数和占比)',
    isTopQualityMode: true,
    secondChartTitle: '包装TOP前5不良数',
    secondChartType: 'pie' as const,
    secondChartData: null
  }
])

// 右侧总装二课的面板数据（初始化为空状态）
const department2Panels = ref<PanelData[]>([
  {
    id: '1',
    title: '总装二课工单结单率',
    description: [],
    chartTitle: '工单结单率趋势',
    chartType: 'bar' as const,
    chartData: null,
    chartTypeDescription: '折线图(标准) + 柱状图(实际)'
  },
  {
    id: '2',
    title: '总装二课直通率',
    description: [],
    chartTitle: '直通率趋势',
    chartType: 'line' as const,
    chartData: null,
    chartTypeDescription: '折线图(每月标准和实际)'
  },
  {
    id: '3',
    title: '总装二课人效达成率',
    description: [],
    chartTitle: '人效达成率',
    chartType: 'bar' as const,
    chartData: null,
    chartTypeDescription: '柱状图(每月计划和实际)',
    hideRegular: true
  },
  {
    id: '4',
    title: 'TOP质量问题',
    description: [],
    chartTitle: '总装TOP前5不良数',
    chartType: 'pie' as const,
    chartData: null,
    chartTypeDescription: '饼图(显示总装TOP前5不良数和占比)',
    isTopQualityMode: true,
    secondChartTitle: '包装TOP前5不良数',
    secondChartType: 'pie' as const,
    secondChartData: null
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
    fetchDepartment2Efficiency(),
    fetchDepartment1EfficiencyTrend(), // 获取总装一课人效达成率趋势数据
    fetchDepartment2EfficiencyTrend(), // 获取总装二课人效达成率趋势数据
    fetchDepartment1TopQualityData(), // 获取总装一课TOP质量问题数据
    fetchDepartment2TopQualityData() // 获取总装二课TOP质量问题数据
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
    fetchDepartment1EfficiencyTrend() // 获取总装一课人效达成率趋势数据
    fetchDepartment2EfficiencyTrend() // 获取总装二课人效达成率趋势数据
    fetchDepartment1TopQualityData() // 获取总装一课TOP质量问题数据
    fetchDepartment2TopQualityData() // 获取总装二课TOP质量问题数据
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