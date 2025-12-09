/**
 * 全局饼图颜色配置
 * 根据设计规范定义的8种饼图颜色
 */
export const GLOBAL_PIE_CHART_COLORS = [
  '#0018A8', // 克莱因蓝
  '#81D8D0', // 蒂芙尼蓝
  '#367C2B', // 马尔斯绿
  '#808066', // 橄榄灰
  '#D4A373', // PANTONE 935U
  '#D1A054', // PANTONE 728U
  '#9B26B6', // PANTONE 2592U
  '#C4E17F'  // PANTONE 374C
] as const

/**
 * 获取饼图颜色（循环使用）
 * @param index - 颜色索引
 * @returns 颜色值
 */
export function getPieChartColor(index: number): string {
  return GLOBAL_PIE_CHART_COLORS[index % GLOBAL_PIE_CHART_COLORS.length]
}

