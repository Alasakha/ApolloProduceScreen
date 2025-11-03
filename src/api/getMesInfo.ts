import request from '../utils/request'

// /report/orderSettlement_performance 开始日期取本月第一天  结束日期取今天   workCenter：总装一课 总装二课
export const getOrderSettlementPerformance = (workCenter,dateTimeStart,dateTimeStop) => {
  return request({
    url: '/report/orderSettlement_performance',
    method: 'get',
    params: {
      workCenter, //工作中心
      dateTimeStart, //开始日期
      dateTimeStop, //结束日期
    }
  })
}
// /report/qualityReportPerformance?prodLine=10041005&dayStart=2025-10-01&dayEnd=2025-11-01 开始日期取本月第一天  结束日期取今天   总之一课prodLine：10041005  总装二课：20042005
export const getQualityReportPerformance = (prodLine,dayStart,dayEnd) => {
  return request({
    url: '/report/qualityReportPerformance',
    method: 'get',
    params: {
      prodLine, //产品线
      dayStart, //开始日期 2025-xx-xx格式 区别getOrderSettlementPerformance的格式
      dayEnd, //结束日期  2025-xx-xx格式 区别getOrderSettlementPerformance的格式
    }
  })
}

// /report/productionAchievementRate?prodLine=1004&monthDay=2025-10-01 总之一课包装prodLine：1005  总装一课装配1004  总装二课装配2004 总装二课包装2005
export const getProductionAchievementRate = (prodLine,monthDay) => {
  return request({
    url: '/report/productionAchievementRate',
    method: 'get',
    params: {
      prodLine, //产品线 总之一课包装prodLine：1005  总装一课装配1004  总装二课装配2004 总装二课包装2005
      monthDay, //日期 2025-xx格式 10月填写2025-10  11月填写2025-11 填写的是本月的月份
    }
  })
}
// ts类型定义

// 损耗原因类型
export interface Reason {
  reduce_type: number
  reduce_minute: number
  reduce_count: number
  reduce_total: number
  reason: string
}

// 单条产线数据类型
export interface MesInfoItem {
  udf04: string // 日期
  pcNum: number
  completeNum: number
  userNum: string
  hourNum: string
  standardEfficiency: number
  actualEfficiency: number
  achievementRate: string
  averageHourlyOutput: number
  averageAchievementRate: string
  reduceMinute_hx: number
  reduceMinute_jhw: number
  hx_reason: Reason[]
  jhw_reason: Reason[]
}

// 整体响应数据类型
export interface GetMesInfoResponse {
  code: number
  message: string
  data: {
    item: MesInfoItem[]
    pcDays: number //月度累计排产天数
    achieveDays: number //月度人效达成天数
    achieveRate: string  //人效达成率
  }
}




// /report/orderSettlement_performance_trend?workCenter=%E6%80%BB%E8%A3%85%E4%B8%80%E8%AF%BE workCenter：总装一课 总装二课
export const getOrderSettlementPerformanceTrend = (workCenter) => {
  return request({
    url: '/report/orderSettlement_performance_trend',
    method: 'get',
    params: { workCenter }
  })
}

// 直通率趋势接口返回的数据类型
export interface ThroughputTrendItem {
  workNo: string | null
  workCenter: string
  customer: string // "A" 或 "常规"
  productionQuantity: string
  inboundQuantity: string
  [key: string]: any
}

export interface ThroughputTrendResponse {
  code: number
  message: string
  data: {
    [monthKey: string]: ThroughputTrendItem[] // monthKey格式：YYYYMM，如 "202508"
  }
}

// /report/qualityReportPerformance_trend?prodLine=10041005  总之一课prodLine：10041005  总装二课：20042005
export const getQualityReportPerformanceTrend = (prodLine) => {
  return request({
    url: '/report/qualityReportPerformance_trend',
    method: 'get',
    params: { prodLine,  }
  })
}

// 质量报告绩效趋势数据类型
export interface QualityReportPerformanceItem {
  monthDay: null
  ok_count: number
  ng_count: number
  first_ng_count: number
  total_count: number
  first_ok_count: number
  first_ok_rate: string
}

// 质量报告绩效趋势月度数据
export interface QualityReportPerformanceMonthData {
  xxj_a: (QualityReportPerformanceItem | null)[]
  cpj_a: (QualityReportPerformanceItem | null)[]
  chhj_a: (QualityReportPerformanceItem | null)[]
  xxj_normal: (QualityReportPerformanceItem | null)[]
  cpj_normal: (QualityReportPerformanceItem | null)[]
  chhj_normal: (QualityReportPerformanceItem | null)[]
}

// 质量报告绩效趋势响应类型
export interface QualityReportPerformanceTrendResponse {
  code: number
  message: string
  data: {
    [monthKey: string]: QualityReportPerformanceMonthData // monthKey格式：YYYY-MM，如 "2025-10"
  }
}