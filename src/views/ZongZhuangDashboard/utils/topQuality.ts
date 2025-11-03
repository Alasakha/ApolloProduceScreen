// TOP质量问题数据工具函数

import { getTopDayCategory, type TopQualityItem, type TopQualityResponse } from '@/api/getMesInfo'

// 日期工具函数：获取本月第一天和今天的日期（用于topDayCategory接口：YYYY-MM-DD格式）
function getDateRangeForQuality() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  
  // 本月第一天
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  // 今天
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  
  return {
    startDate: firstDay,
    endDate: todayStr
  }
}

// 获取总装一课装配TOP质量问题（prodLine: 1004）
export async function fetchDepartment1AssemblyTopQuality(): Promise<TopQualityItem[]> {
  try {
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getTopDayCategory('1004', startDate, endDate) as TopQualityResponse
    
    if (response.code === 200 && response.data) {
      return response.data || []
    }
    return []
  } catch (error) {
    console.error('获取总装一课装配TOP质量问题失败:', error)
    return []
  }
}

// 获取总装一课包装TOP质量问题（prodLine: 1005）
export async function fetchDepartment1PackagingTopQuality(): Promise<TopQualityItem[]> {
  try {
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getTopDayCategory('1005', startDate, endDate) as TopQualityResponse
    
    if (response.code === 200 && response.data) {
      return response.data || []
    }
    return []
  } catch (error) {
    console.error('获取总装一课包装TOP质量问题失败:', error)
    return []
  }
}

// 获取总装二课装配TOP质量问题（prodLine: 2004）
export async function fetchDepartment2AssemblyTopQuality(): Promise<TopQualityItem[]> {
  try {
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getTopDayCategory('2004', startDate, endDate) as TopQualityResponse
    
    if (response.code === 200 && response.data) {
      return response.data || []
    }
    return []
  } catch (error) {
    console.error('获取总装二课装配TOP质量问题失败:', error)
    return []
  }
}

// 获取总装二课包装TOP质量问题（prodLine: 2005）
export async function fetchDepartment2PackagingTopQuality(): Promise<TopQualityItem[]> {
  try {
    const { startDate, endDate } = getDateRangeForQuality()
    const response = await getTopDayCategory('2005', startDate, endDate) as TopQualityResponse
    
    if (response.code === 200 && response.data) {
      return response.data || []
    }
    return []
  } catch (error) {
    console.error('获取总装二课包装TOP质量问题失败:', error)
    return []
  }
}

// 转换TOP质量问题数据为饼图格式（取前5个）
export function transformTopQualityToPieChart(
  data: TopQualityItem[],
  colors: string[] = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6b7280']
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

// 统一获取总装一课TOP质量问题（装配和包装）
export async function fetchDepartment1TopQuality() {
  const [assemblyData, packagingData] = await Promise.all([
    fetchDepartment1AssemblyTopQuality(),
    fetchDepartment1PackagingTopQuality()
  ])

  return {
    assembly: transformTopQualityToPieChart(assemblyData),
    packaging: transformTopQualityToPieChart(packagingData)
  }
}

// 统一获取总装二课TOP质量问题（装配和包装）
export async function fetchDepartment2TopQuality() {
  const [assemblyData, packagingData] = await Promise.all([
    fetchDepartment2AssemblyTopQuality(),
    fetchDepartment2PackagingTopQuality()
  ])

  return {
    assembly: transformTopQualityToPieChart(assemblyData),
    packaging: transformTopQualityToPieChart(packagingData)
  }
}

