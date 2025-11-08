// TOP质量问题数据工具函数

import { getBadIssuesPerformance, type BadIssuesItem, type BadIssuesResponse } from '@/api/getMesInfo'

// 日期工具函数：获取当前月份（格式：YYYY-MM）
function getCurrentMonth(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  
  return `${year}-${String(month).padStart(2, '0')}`
}

// 转换TOP质量问题数据为饼图格式（取前5个）
export function transformTopQualityToPieChart(
  data: BadIssuesItem[],
  colors: string[] = ['#f59e0b', '#3b82f6', '#10b981', '#6b7280', '#8b5cf6']
): Array<{ name: string; value: number; itemStyle: { color: string } }> {
  if (!data || data.length === 0) {
    return []
  }

  // 按total降序排序，取前5个
  const sortedData = [...data]
    .sort((a, b) => (b.total || 0) - (a.total || 0))
    .slice(0, 5)

  return sortedData.map((item, index) => ({
    name: item.ngName || '未知',
    value: item.total || 0,
    itemStyle: {
      color: colors[index % colors.length]
    }
  }))
}

// 获取金工一部TOP质量问题
export async function fetchDepartment1TopQuality() {
  try {
    const monthDay = getCurrentMonth()
    const response = await getBadIssuesPerformance('JG1', monthDay) as BadIssuesResponse
    
    if (response.code === 200 && response.data) {
      return transformTopQualityToPieChart(response.data || [])
    }
    return []
  } catch (error) {
    console.error('获取金工一部TOP质量问题失败:', error)
    return []
  }
}

// 获取金工二部TOP质量问题
export async function fetchDepartment2TopQuality() {
  try {
    const monthDay = getCurrentMonth()
    const response = await getBadIssuesPerformance('JG2', monthDay) as BadIssuesResponse
    
    if (response.code === 200 && response.data) {
      return transformTopQualityToPieChart(response.data || [])
    }
    return []
  } catch (error) {
    console.error('获取金工二部TOP质量问题失败:', error)
    return []
  }
}
