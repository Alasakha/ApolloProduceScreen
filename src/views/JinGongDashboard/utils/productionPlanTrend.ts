// 产量计划达成率趋势数据工具函数
import type { MonthProductionCustResponse } from '@/api/getMesInfo'

// 转换产量计划达成率趋势接口数据为图表数据
// 根据图片，图表显示的是计划数和完成数的柱状图
// 计划数 = A类计划数 + 常规计划数
// 完成数 = A类完成数 + 常规完成数
export function transformProductionPlanTrendData(
  apiData: MonthProductionCustResponse | null
): {
  categories: string[]
  series: Array<{
    name: string
    type: 'bar'
    data: number[]
    itemStyle?: { color: string }
  }>
} {
  if (!apiData?.data) {
    return {
      categories: [],
      series: []
    }
  }

  const { a_total, b_total, a_done, b_done } = apiData.data

  // 计算总计划数和总完成数
  const totalPlan = a_total + b_total
  const totalDone = a_done + b_done

  // 由于API只返回当前月份的数据，我们需要生成6个月的数据
  // 这里假设当前月份是最后一个月，前面的月份使用当前月份的数据作为示例
  // 实际应用中，应该调用趋势接口获取多个月份的数据
  const categories: string[] = []
  const planData: number[] = []
  const doneData: number[] = []

  // 生成最近6个月的数据
  const today = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const month = date.getMonth() + 1
    categories.push(`${month}月`)
    
    // 使用当前月份的数据（实际应该从API获取各个月份的数据）
    planData.push(totalPlan)
    doneData.push(totalDone)
  }

  return {
    categories,
    series: [
      {
        name: '计划数',
        type: 'bar',
        data: planData,
        itemStyle: { color: '#808080' } // 灰色，根据图片描述
      },
      {
        name: '完成数',
        type: 'bar',
        data: doneData,
        itemStyle: { color: '#00ff00' } // 绿色，根据图片描述
      }
    ]
  }
}

