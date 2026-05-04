// 金工直通率数据工具函数
import type { PassRatePerformanceData } from '@/api/getMesInfo'

// 部门默认标准配置（当接口未返回目标时使用）
const DEPARTMENT_DEFAULT_STANDARDS = {
  '金工一部': {
    aClass: 95, // A类默认标准直通率
    regular: 93 // 常规默认标准直通率
  },
  '金工二部': {
    aClass: 95, // A类默认标准直通率
    regular: 93 // 常规默认标准直通率
  }
} as const

// 获取数组第一项的rate，如果没有则返回1
function getFirstRate(items: Array<{ rate: number }> | undefined): number {
  if (!items || items.length === 0) return 1
  const rate = items[0]?.rate
  // 如果 rate 是 undefined 或 null，返回 1
  if (rate === undefined || rate === null) return 1
  return rate
}

// 计算A类直通率：painting_a × chongya
function calculateAClassThroughput(data: PassRatePerformanceData): number {
  const paintingRate = getFirstRate(data.painting_a) // 小数格式，如 0.875
  const chongyaRate = getFirstRate(data.chongya) / 100 // 百分比转小数，如 98.5 -> 0.985
  
  // 如果 chongyaRate 为 0，直接返回 paintingRate（避免乘以0导致结果为0）
  if (chongyaRate === 0) {
    return paintingRate
  }
  
  return paintingRate * chongyaRate
}

// 计算常规类直通率：painting_normal × chongya
function calculateRegularThroughput(data: PassRatePerformanceData): number {
  const paintingRate = getFirstRate(data.painting_normal) // 小数格式，如 0.883
  const chongyaRate = getFirstRate(data.chongya) / 100 // 百分比转小数，如 98.5 -> 0.985
  
  // 如果 chongyaRate 为 0，直接返回 paintingRate（避免乘以0导致结果为0）
  if (chongyaRate === 0) {
    return paintingRate
  }
  
  return paintingRate * chongyaRate
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
export function transformPassRateData(
  apiData: PassRatePerformanceData,
  department: '金工一部' | '金工二部'
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
      { label: '常规月度累计直通率', value: formatPercent(regularActual) },
      { label: '目标达成率', value: regularAchievement }
    ]
  }
}

