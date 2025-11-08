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
}

// 部门标准配置
const DEPARTMENT_STANDARDS = {
  '金工一部': {
    aClass: 75, // A类标准直通率 75%
    regular: 72 // 常规标准直通率 72%
  },
  '金工二部': {
    aClass: 89, // A类标准直通率 89%
    regular: 87 // 常规标准直通率 87%
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
  department: '金工一部' | '金工二部'
): {
  description: Array<{ label: string; value: string }>
} {
  const standards = DEPARTMENT_STANDARDS[department]
  
  // 计算实际直通率
  const aClassActual = calculateAClassThroughput(apiData)
  const regularActual = calculateRegularThroughput(apiData)
  
  // 计算达成率
  const aClassAchievement = calculateAchievementRate(aClassActual * 100, standards.aClass)
  const regularAchievement = calculateAchievementRate(regularActual * 100, standards.regular)
  
  return {
    description: [
      { label: 'A类直通率标准', value: standards.aClass + '%' },
      { label: 'A类月度累计直通率', value: formatPercent(aClassActual) },
      { label: '达成率', value: aClassAchievement },
      { label: '常规直通率标准', value: standards.regular + '%' },
      { label: '常规月度累计直通率', value: formatPercent(regularActual) },
      { label: '达成率', value: regularAchievement }
    ]
  }
}
