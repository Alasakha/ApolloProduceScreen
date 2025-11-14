// 产量计划达成率趋势数据工具函数
import type { MonthProductionCustTrendResponse, MonthProductionCustResponse } from '@/api/getMesInfo'

// 转换产量计划达成率趋势接口数据为图表数据
// 分别显示A类和常规类的计划数和完成数
export function transformProductionPlanTrendData(
  apiData: MonthProductionCustTrendResponse | MonthProductionCustResponse | null
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

  // 判断是趋势接口（多月份）还是单月接口
  // 单月接口：data 直接包含 a_total 字段
  // 趋势接口：data 是一个对象，键是月份，值是包含 a_total 的对象
  const firstKey = Object.keys(apiData.data)[0]
  const firstValue = (apiData.data as any)[firstKey]
  
  // 判断是否为趋势数据：如果第一个键的值是对象且包含 a_total 字段，则是趋势数据
  const isTrendData = firstKey && 
    typeof firstKey === 'string' && 
    typeof firstValue === 'object' && 
    firstValue !== null &&
    'a_total' in firstValue

  let categories: string[] = []
  let aClassPlanData: number[] = []
  let aClassDoneData: number[] = []

  if (isTrendData) {
    // 趋势接口：处理多月份数据
    const trendData = apiData.data as MonthProductionCustTrendResponse['data']
    
    // 获取所有月份并排序
    const monthKeys = Object.keys(trendData).sort()
    
    // 只取最近6个月
    const recentMonths = monthKeys.slice(-6)
    
    for (const monthKey of recentMonths) {
      const monthData = trendData[monthKey]
      if (monthData) {
        // 提取月份数字：支持 YYYYMM 格式（如 "202509"）和 YYYY-MM 格式（如 "2025-09"）
        let month: string
        if (monthKey.includes('-')) {
          // YYYY-MM 格式
          month = monthKey.split('-')[1]
        } else if (monthKey.length === 6) {
          // YYYYMM 格式（如 "202509"）
          month = monthKey.substring(4, 6)
        } else {
          // 其他格式，尝试提取后两位
          month = monthKey.substring(monthKey.length - 2)
        }
        categories.push(`${parseInt(month)}月`)
        
        // 合并A类和常规数据（综合数据）
        const totalPlan = monthData.a_total + monthData.b_total
        const totalDone = monthData.a_done + monthData.b_done
        
        aClassPlanData.push(totalPlan)
        aClassDoneData.push(totalDone)
      }
    }
  } else {
    // 单月接口：兼容旧逻辑
    const singleMonthData = apiData.data as MonthProductionCustResponse['data']
    const { a_total, b_total, a_done, b_done } = singleMonthData

    // 合并A类和常规数据（综合数据）
    const totalPlan = a_total + b_total
    const totalDone = a_done + b_done

    // 生成最近6个月的数据（使用当前月份数据）
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const month = date.getMonth() + 1
      categories.push(`${month}月`)
      
      // 使用合并后的综合数据
      aClassPlanData.push(totalPlan)
      aClassDoneData.push(totalDone)
    }
  }

  return {
    categories,
    series: [
      {
        name: '计划数',
        type: 'bar',
        data: aClassPlanData,
        itemStyle: { color: '#3571E5' }, // 蓝色
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
        name: '完成数',
        type: 'bar',
        data: aClassDoneData,
        itemStyle: { color: '#9ca3af' }, // 灰色
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


