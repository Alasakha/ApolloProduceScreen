// 人效达成率趋势数据工具函数
import type { 
  ProductionAchievementRatePerformanceTrendResponse, 
  EfficiencyTrendMonthData 
} from '@/api/getMesInfo'

// 合并两个趋势数据（用于装配+包装）
export function mergeEfficiencyTrendData(
  assemblyData: ProductionAchievementRatePerformanceTrendResponse | null,
  packagingData: ProductionAchievementRatePerformanceTrendResponse | null
): ProductionAchievementRatePerformanceTrendResponse | null {
  if (!assemblyData?.data || !packagingData?.data) {
    return assemblyData || packagingData || null
  }

  // 获取所有月份键（排除 achieveRate）
  const allMonthKeys = new Set<string>()
  
  Object.keys(assemblyData.data).forEach(key => {
    if (key !== 'achieveRate') allMonthKeys.add(key)
  })
  Object.keys(packagingData.data).forEach(key => {
    if (key !== 'achieveRate') allMonthKeys.add(key)
  })

  const sortedMonthKeys = Array.from(allMonthKeys).sort()
  
  // 合并数据：每个月的 pcDays 和 achieveDays 相加
  const mergedData: { [monthKey: string]: EfficiencyTrendMonthData } = {}
  
  sortedMonthKeys.forEach(monthKey => {
    const assemblyMonthData = assemblyData.data[monthKey] as EfficiencyTrendMonthData | undefined
    const packagingMonthData = packagingData.data[monthKey] as EfficiencyTrendMonthData | undefined
    
    const assemblyPcDays = assemblyMonthData?.pcDays || 0
    const assemblyAchieveDays = assemblyMonthData?.achieveDays || 0
    const packagingPcDays = packagingMonthData?.pcDays || 0
    const packagingAchieveDays = packagingMonthData?.achieveDays || 0
    
    // 合并计划天数和达成天数
    mergedData[monthKey] = {
      [monthKey]: [], // 保留原始结构，但不需要具体日数据
      pcDays: assemblyPcDays + packagingPcDays,
      achieveDays: assemblyAchieveDays + packagingAchieveDays,
      achieveRate: '' // 这个可以后续计算
    }
  })

  return {
    code: 200,
    message: 'success',
    data: mergedData
  }
}

// 转换人效达成率趋势接口数据为图表数据
export function transformEfficiencyTrendData(
  apiData: ProductionAchievementRatePerformanceTrendResponse | null
): {
  categories: string[]
  series: Array<{
    name: string
    type: 'line' | 'bar'
    data: number[]
    itemStyle?: { color: string }
    lineStyle?: { type?: 'dashed' | 'solid' }
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

  // 硬编码标准值：89%
  const standard = 89

  // 按月份排序（YYYY-MM格式）
  const monthKeys = Object.keys(apiData.data)
    .filter(key => key !== 'achieveRate') // 排除最外层的 achieveRate
    .sort()
  
  // 每个月的计划天数和达成天数数据
  const planDaysData: number[] = []
  const achieveDaysData: number[] = []
  const standardDaysData: number[] = [] // 标准达成天数
  const categories: string[] = []

  monthKeys.forEach(monthKey => {
    const monthData = apiData.data[monthKey] as EfficiencyTrendMonthData
    
    // 从月度数据中提取计划天数和达成天数
    const pcDays = monthData.pcDays || 0
    const achieveDays = monthData.achieveDays || 0
    
    planDaysData.push(pcDays)
    achieveDaysData.push(achieveDays)
    
    // 计算标准达成天数：计划天数 × 89%
    const standardDays = Math.round(pcDays * standard / 100)
    standardDaysData.push(standardDays)
    
    // 月份标签（从YYYY-MM转换为X月格式）
    const month = parseInt(monthKey.substring(5, 7))
    categories.push(`${month}月`)
  })

  return {
    categories,
    series: [
      {
        name: '计划天数',
        type: 'bar',
        data: planDaysData,
        itemStyle: { color: '#6b7280' },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return params.value.toString()
          },
          color: '#fff',
          fontSize: 11
        }
      },
      {
        name: '达成天数',
        type: 'bar',
        data: achieveDaysData,
        itemStyle: { color: '#10b981' },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return params.value.toString()
          },
          color: '#fff',
          fontSize: 11
        }
      },
      {
        name: '标准达成天数',
        type: 'line',
        data: standardDaysData,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { type: 'dashed' },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return params.value.toString()
          },
          color: '#f59e0b',
          fontSize: 11
        }
      }
    ]
  }
}

