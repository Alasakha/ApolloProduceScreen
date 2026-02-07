// 销售仪表板 API 接口
import request from '@/utils/request'

// 筛选选项接口（简单数组格式）
export interface FilterOptions {
  settlementCustomerList: string[]  // 结算客户列表
  yearMonthList: string[]           // 月份列表
  yearList: string[]               // 年份列表
  groupby: string[]                // 分组维度选项
}

// 查询参数（支持多选）
export interface ROEQueryParams {
  // 筛选条件（数组格式，支持多选）
  settlementCustomer?: string[]    // 结算客户
  yearMonth?: string[]             // 月份
  year?: string[]                  // 年
  brand?: string[]               // 品牌
  model?: string[]               // 车型
  category?: string[]            // 产品分类
  group?: string[]                // 组别
  area?: string[]                 // 地区
  company?: string[]              // 公司分类

  // 分组维度
  groupby: 'settlementCustomer' | 'salesman' | 'brand' | 'productSeries' | 'area'
}

// 表格数据项
export interface ROETableItem {
  dimension: string        // 分组维度值，如结算客户名称、业务员名称等
  totalSales: number       // 总销售额(万元)
  grossProfit: number      // 毛利额(万元)
  margin: number           // 综合毛利率(%)
  salesYoY: number         // 销售额同比(%)
  profitYoY: number        // 毛利额同比(%)
  marginYoY: number        // 毛利率同比(%)
}

// 饼图数据项
export interface ROEPieItem {
  name: string
  value: number
  color?: string
}

// 趋势图数据
export interface ROETrendData {
  months: string[]
  sales: number[]
  margin: number[]
}

// API 响应结构 - 筛选选项
export interface FilterOptionsResponse {
  settlementCustomerList: string[]
  yearMonthList: string[]
  yearList: string[]
  groupby: string[]
}

// API 响应结构 - 报表数据
export interface ROEResponse {
  tableData: ROETableItem[]
  pieData: ROEPieItem[]
  trendData: ROETrendData
}

/**
 * 获取筛选选项
 */
export const getFilterOptions = (): Promise<FilterOptionsResponse> => {
  return request.post('/roe/roeList', {})
}

/**
 * 获取 ROE 报表数据
 * @param params 查询参数
 */
export const getROEData = (params: ROEQueryParams): Promise<ROEResponse> => {
  return request.post('/roe/roeList', params)
}

/**
 * 默认分组维度
 */
export const DEFAULT_GROUPBY: ROEQueryParams['groupby'] = 'settlementCustomer'

/**
 * 可选分组维度配置
 */
export const GROUPBY_OPTIONS = [
  { value: 'settlementCustomer', label: '结算客户' },
  { value: 'salesman', label: '业务员' },
  { value: 'brand', label: '品牌' },
  { value: 'productSeries', label: '产品系列' },
  { value: 'area', label: '地区' }
]

/**
 * 获取维度字段名
 */
export const getDimensionLabel = (groupby: ROEQueryParams['groupby']): string => {
  const option = GROUPBY_OPTIONS.find(opt => opt.value === groupby)
  return option ? option.label : '维度'
}

/**
 * 检查是否是有效的分组维度值
 */
export const isValidGroupby = (value: string): value is ROEQueryParams['groupby'] => {
  return GROUPBY_OPTIONS.some(opt => opt.value === value)
}
