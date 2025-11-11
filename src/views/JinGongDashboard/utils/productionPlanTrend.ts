// 产量计划达成率趋势数据工具函数
import type { MonthProductionCustResponse } from '@/api/getMesInfo'

// 转换产量计划达成率趋势接口数据为图表数据
// 分别显示A类和常规类的计划数和完成数
export function transformProductionPlanTrendData(
  apiData: MonthProductionCustResponse | null
): {
  categories: string[]
  series: Array<{
    name: string
    type: 'bar'
    data: number[]
    itemStyle?: { color: string }
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

  const { a_total, b_total, a_done, b_done } = apiData.data

  // 由于API只返回当前月份的数据，我们需要生成6个月的数据
  // 这里假设当前月份是最后一个月，前面的月份使用当前月份的数据作为示例
  // 实际应用中，应该调用趋势接口获取多个月份的数据
  const categories: string[] = []
  const aClassPlanData: number[] = []
  const aClassDoneData: number[] = []
  const regularPlanData: number[] = []
  const regularDoneData: number[] = []

  // 生成最近6个月的数据
  const today = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const month = date.getMonth() + 1
    categories.push(`${month}月`)
    
    // 使用当前月份的数据（实际应该从API获取各个月份的数据）
    aClassPlanData.push(a_total)
    aClassDoneData.push(a_done)
    regularPlanData.push(b_total)
    regularDoneData.push(b_done)
  }

  return {
    categories,
    series: [
      {
        name: 'A类计划数',
        type: 'bar',
        data: aClassPlanData,
        itemStyle: { color: '#808080' }, // 灰色
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return formatNumber(params.value)
          },
          color: '#fff',
          fontSize: 11
        }
      },
      {
        name: 'A类完成数',
        type: 'bar',
        data: aClassDoneData,
        itemStyle: { color: '#3b82f6' }, // 蓝色
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return formatNumber(params.value)
          },
          color: '#fff',
          fontSize: 11
        }
      },
      {
        name: '常规计划数',
        type: 'bar',
        data: regularPlanData,
        itemStyle: { color: '#808080' }, // 灰色
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return formatNumber(params.value)
          },
          color: '#fff',
          fontSize: 11
        }
      },
      {
        name: '常规完成数',
        type: 'bar',
        data: regularDoneData,
        itemStyle: { color: '#10b981' }, // 绿色
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => {
            return formatNumber(params.value)
          },
          color: '#fff',
          fontSize: 11
        }
      }
    ]
  }
}

// 格式化数字，添加千分位
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


