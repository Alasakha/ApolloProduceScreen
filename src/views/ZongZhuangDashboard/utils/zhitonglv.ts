// 直通率数据工具函数

// 接口返回的数据项类型
export interface QualityReportItem {
  monthDay: string | null
  ok_count: number
  ng_count: number
  first_ng_count: number
  total_count: number
  first_ok_count: number
  first_ok_rate: string | null
}

// 接口返回的数据结构
export interface QualityReportData {
  xxj_a?: QualityReportItem[]
  cpj_a?: QualityReportItem[]
  chhj_a?: QualityReportItem[]
  xxj_normal?: QualityReportItem[]
  cpj_normal?: QualityReportItem[]
  chhj_normal?: QualityReportItem[]
  target_a?: number | null  // A类目标直通率，如 81 表示 81%
  target_normal?: number | null  // 常规类目标直通率，如 79 表示 79%
}

// 部门默认标准配置（当接口未返回目标时使用）
const DEPARTMENT_DEFAULT_STANDARDS = {
  '总装一课': {
    aClass: 88, // A类默认标准直通率
    regular: 83 // 常规默认标准直通率
  },
  '总装二课': {
    aClass: 91, // A类默认标准直通率
    regular: 90 // 常规默认标准直通率
  }
} as const

// 解析first_ok_rate字符串为数字，如果为null或无效则返回1
function parseRate(rate: string | null | undefined): number {
  if (!rate) return 1
  const parsed = parseFloat(rate)
  return isNaN(parsed) ? 1 : parsed / 100 // 转换为小数（如86.46% -> 0.8646）
}

// 获取数组第一项的first_ok_rate，如果没有则返回1
function getFirstRate(items: QualityReportItem[] | undefined): number {
  if (!items || items.length === 0) return 1
  return parseRate(items[0]?.first_ok_rate)
}

// 计算A类直通率：xxj_a × cpj_a × chhj_a
function calculateAClassThroughput(data: QualityReportData): number {
  const xxjRate = getFirstRate(data.xxj_a)
  const cpjRate = getFirstRate(data.cpj_a)
  const chhjRate = getFirstRate(data.chhj_a)
  
  return xxjRate * cpjRate * chhjRate
}

// 计算常规类直通率：xxj_normal × cpj_normal × chhj_normal
function calculateRegularThroughput(data: QualityReportData): number {
  const xxjRate = getFirstRate(data.xxj_normal)
  const cpjRate = getFirstRate(data.cpj_normal)
  const chhjRate = getFirstRate(data.chhj_normal)
  
  return xxjRate * cpjRate * chhjRate
}

// 格式化百分比（小数转百分比字符串，保留2位小数）
function formatPercent(decimal: number): string {
  return (decimal * 100).toFixed(2) + '%'
}

// 计算达成率：实际 / 标准
function calculateAchievementRate(actual: number, standard: number): string {
  if (standard === 0) return '0%'
  const rate = (actual / standard) * 100
  return rate.toFixed(2) + '%'
}

// 转换接口数据为面板描述数据
export function transformQualityReportData(
  apiData: QualityReportData,
  department: '总装一课' | '总装二课'
): {
  description: Array<{ label: string; value: string }>
} {
  // 从接口返回的 target 字段获取目标值，如果没有则使用默认值
  const defaults = DEPARTMENT_DEFAULT_STANDARDS[department]
  const aClassTarget = apiData.target_a ?? defaults.aClass
  const regularTarget = apiData.target_normal ?? defaults.regular
  
  // 计算实际直通率
  const aClassActual = calculateAClassThroughput(apiData)
  const regularActual = calculateRegularThroughput(apiData)
  
  // 计算达成率
  const aClassAchievement = calculateAchievementRate(aClassActual * 100, aClassTarget)
  const regularAchievement = calculateAchievementRate(regularActual * 100, regularTarget)
  
  return {
    description: [
      { label: 'A类直通率目标', value: aClassTarget + '%' },
      { label: 'A类月度累计直通率', value: formatPercent(aClassActual) },
      { label: '目标达成率', value: aClassAchievement },
      { label: '常规直通率目标', value: regularTarget + '%' },
      { label: '月度累计直通率', value: formatPercent(regularActual) },
      { label: '目标达成率', value: regularAchievement }
    ]
  }
}
