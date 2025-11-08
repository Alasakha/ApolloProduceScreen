// 直通率趋势数据工具函数
import type { QualityReportPerformanceTrendResponse, QualityReportPerformanceMonthData, QualityReportPerformanceItem } from '@/api/getMesInfo'

// 解析first_ok_rate字符串为数字（百分比转为小数）
function parseRate(rate: string | null | undefined): number {
  if (!rate) return 1
  const parsed = parseFloat(rate)
  return isNaN(parsed) ? 1 : parsed / 100 // 转换为小数（如86.46% -> 0.8646）
}

// 获取数组中第一个有效项的first_ok_rate，如果没有则返回1
function getFirstRate(items: (QualityReportPerformanceItem | null)[] | undefined): number {
  if (!items || items.length === 0) return 1
  const firstItem = items[0]
  if (!firstItem) return 1
  return parseRate(firstItem.first_ok_rate)
}

// 计算当日直通率：xxj_a × cpj_a × chhj_a 的first_ok_rate相乘
export function calculateDailyThroughputRate(
  data: QualityReportPerformanceMonthData
): number {
  const xxjRate = getFirstRate(data.xxj_a)
  const cpjRate = getFirstRate(data.cpj_a)
  const chhjRate = getFirstRate(data.chhj_a)
  
  return xxjRate * cpjRate * chhjRate
}

// 计算常规类当日直通率：xxj_normal × cpj_normal × chhj_normal 的first_ok_rate相乘
export function calculateDailyRegularThroughputRate(
  data: QualityReportPerformanceMonthData
): number {
  const xxjRate = getFirstRate(data.xxj_normal)
  const cpjRate = getFirstRate(data.cpj_normal)
  const chhjRate = getFirstRate(data.chhj_normal)
  
  return xxjRate * cpjRate * chhjRate
}

// 转换趋势接口数据为图表数据
export function transformQualityReportTrendData(
  apiData: QualityReportPerformanceTrendResponse | null,
  department: '金工一部' | '金工二部'
): {
  categories: string[]
  series: Array<{
    name: string
    type: 'line' | 'bar'
    data: number[]
    itemStyle?: { color: string }
    lineStyle?: { type?: 'dashed' | 'solid' }
    smooth?: boolean
    label?: {
      show: boolean
      position: string
      formatter: string | ((params: any) => string)
      color: string
      fontSize: number
    }
  }>
} {
  if (!apiData?.data) {
    return {
      categories: [],
      series: []
    }
  }

  // 定义标准值
  const standards = {
    '金工一部': { A: 75, 常规: 72 },
    '金工二部': { A: 89, 常规: 87 }
  }
  const aClassStandard = standards[department].A
  const regularStandard = standards[department].常规

  // 按月份排序（YYYY-MM格式）
  const monthKeys = Object.keys(apiData.data).sort()
  
  // 每个月的A类和常规类直通率数据
  const aClassActualData: number[] = []
  const regularActualData: number[] = []
  const categories: string[] = []

  monthKeys.forEach(monthKey => {
    const monthData = apiData.data[monthKey]
    
    // 计算该月的A类和常规类当日直通率
    const monthAThroughput = calculateDailyThroughputRate(monthData)
    const monthRegularThroughput = calculateDailyRegularThroughputRate(monthData)
    
    // 转换为百分比值
    aClassActualData.push(parseFloat((monthAThroughput * 100).toFixed(2)))
    regularActualData.push(parseFloat((monthRegularThroughput * 100).toFixed(2)))
    
    // 月份标签（从YYYY-MM转换为X月格式）
    const month = parseInt(monthKey.substring(5, 7))
    categories.push(`${month}月`)
  })

  // 生成标准线数据（每个月份都是相同的标准值）
  const aClassStandardData = new Array(monthKeys.length).fill(aClassStandard)
  const regularStandardData = new Array(monthKeys.length).fill(regularStandard)

  return {
    categories,
    series: [
      {
        name: 'A类标准',
        type: 'line',
        data: aClassStandardData,
        itemStyle: { color: '#10b981' },
        lineStyle: { type: 'dashed' }, // 标准线使用虚线
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
      },
      {
        name: '常规标准',
        type: 'line',
        data: regularStandardData,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { type: 'dashed' }, // 标准线使用虚线
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
        itemStyle: { color: '#a855f7' },
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

