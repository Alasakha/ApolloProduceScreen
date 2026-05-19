
import request from '../utils/request'

// /report/orderSettlement_performance 开始日期取本月第一天  结束日期取今天   workCenter：总装一课 总装二课 金工一部焊接 金工二部焊接
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
    target: string //人效达成率目标值
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



// /quality/topDayCategory?prodLine=10041005&dayStart=2025-10-01&dayEnd=2025-11-01 开始日期取本月第一天  结束日期取今天   总之一课装配prodLine：1004  总之一课包装1005  总装二课装配：2004 总装二课包装：2005
export const getTopDayCategory = (prodLine: string | number, startDay: string, endDay: string) => {
  return request({
    url: '/quality/topDayCategory',
    method: 'get',
    params: { prodLine, startDay, endDay}
  })
}

// TOP质量问题数据项类型
export interface TopQualityItem {
  ngNO: string | null // 不良编号
  ngName: string // 问题名称
  total: number // 不良总数
  grandTotal: number | null // 总计数
  uid: string | null // 唯一标识
  createDate: string | null // 创建日期
  ih_uid: string | null // 
  ta001: string | null // 
  ta002: string | null // 
  ta006: string | null // 
  mb002: string | null // 
  peopleName: string | null // 人员名称
  ngResponPeople: string | null // 不良责任人
  ngHandle: string | null // 不良处理
  ngReason: string | null // 不良原因
  nums: number | null // 数量
  mb003: string | null // 
  udf021: string | null // 
  admin_UNIT_NAME: string | null // 管理单位名称
  ratio?: number // 比例（0-1之间，可能由前端计算得出）
  [key: string]: any // 其他可能的字段
}

// TOP质量问题API响应类型
export interface TopQualityResponse {
  code: number
  message: string
  data: TopQualityItem[]
}


// /report/productionAchievementRate_performance_trend?prodLine=1004  总装一课    1005:总装二课
    // params: { prodLine,type }
export const getProductionAchievementRatePerformanceTrend = (prodLine: string | number) => {
  return request({
    url: '/report/productionAchievementRate_performance_trend',
    method: 'get',
    params: { prodLine }
  })
}

// 人效达成率绩效趋势 - 损耗原因类型
export interface EfficiencyReason {
  reduce_type: number
  reduce_minute: number
  reduce_count: number
  reduce_total: number
  reason: string
}

// 人效达成率绩效趋势 - 每日数据项类型
export interface EfficiencyTrendItem {
  udf04: string // 日期，格式：YYYY-MM-DD
  pcNum: number // 排产数量
  completeNum: number // 完成数量
  userNum: string // 人数（字符串格式）
  hourNum: string // 工时（字符串格式，可能带小数）
  standardEfficiency: number // 标准效率
  actualEfficiency: number // 实际效率
  achievementRate: string // 达成率（百分比字符串，如 "100.0%"）
  averageHourlyOutput: number // 平均小时产出
  averageAchievementRate: string // 平均达成率（百分比字符串）
  reduceMinute_hx: number // 换线损耗分钟数
  reduceMinute_jhw: number // 计划外损耗分钟数
  hx_reason: EfficiencyReason[] // 换线损耗原因列表
  jhw_reason: EfficiencyReason[] // 计划外损耗原因列表
}

// 人效达成率绩效趋势 - 月度数据
export interface EfficiencyTrendMonthData {
  [dateKey: string]: EfficiencyTrendItem[] | number | string // dateKey格式：YYYY-MM，如 "2025-10"
  // 可选的月度汇总字段
  pcDays?: number // 月度累计排产天数
  achieveDays?: number // 月度人效达成天数
  achieveRate?: string // 月度人效达成率
}

// 人效达成率绩效趋势 - API响应类型
export interface ProductionAchievementRatePerformanceTrendResponse {
  code: number
  message: string
  data: {
    [monthKey: string]: EfficiencyTrendMonthData | string // monthKey格式：YYYY-MM，如 "2025-10"，或者 "achieveRate"
  } & {
    achieveRate?: string // 整体达成率（可能出现在最外层）
  }
}



// /report/passRate_performance?prodLine=1003&dayStart=2025-11-07&dayEnd=2025-11-07 开始日期取本月第一天  结束日期取今天    金工一部：1003 金工二部：2003
export const getPassRatePerformance = (prodLine,dayStart,dayEnd) => {
  return request({
    url: '/report/passRate_performance',
    method: 'get',
    params: { prodLine, dayStart, dayEnd }
  })
}

// 金工直通率数据项类型
export interface PassRatePaintingItem {
  inspectionDate: string | null
  cjTotal: number
  hchTotal: number
  wjTotal: number
  cjNg: number
  hchNg: number
  wjNg: number
  cjHg: number
  hchHg: number
  wjHg: number
  cjFirstNg: number
  hchFirstNg: number
  wjFirstNg: number
  rate: number // 小数格式，如 0.875 表示 87.5%
  firstRate: number | null
}

export interface PassRateChongyaItem {
  inspectionDate: string | null
  total: number
  hg: number
  ng: number
  rate: number // 百分比格式，如 98.5 表示 98.5%
}

// 金工直通率绩效数据
export interface PassRatePerformanceData {
  hjPassRate_a: number | null
  hjPassRate_normal: number | null
  target_a: number | null  // A类目标直通率，如 95 表示 95%
  target_normal: number | null  // 常规类目标直通率，如 93 表示 93%
  painting_a: PassRatePaintingItem[]
  painting_normal: PassRatePaintingItem[]
  chongya: PassRateChongyaItem[]
  zhusu: number | null
}

// 金工直通率绩效响应类型
export interface PassRatePerformanceResponse {
  code: number
  message: string
  data: PassRatePerformanceData
}

// 金工直通率绩效趋势月度数据
export interface PassRatePerformanceTrendMonthData {
  hjPassRate_a: number | null
  hjPassRate_normal: number | null
  painting_a: PassRatePaintingItem[]
  painting_normal: PassRatePaintingItem[]
  chongya: PassRateChongyaItem[]
  zhusu: number | null
}

// 金工直通率绩效趋势响应类型
export interface PassRatePerformanceTrendResponse {
  code: number
  message: string
  data: {
    [monthKey: string]: PassRatePerformanceTrendMonthData // monthKey格式：YYYY-MM，如 "2025-10"
  }
}

// curl -X 'GET' \
//   'http://192.168.1.197:10999/apollo/report/passRate_performance_trend?prodLine=1003' \ 金工一部二部趋势图 1003 2003
//   -H 'accept: */*'
export const getPassRatePerformanceTrend = (prodLine) => {
  return request({
    url: '/report/passRate_performance_trend',
    method: 'get',
    params: { prodLine }
  })
}


// /stampingWelding/monthProductionCust?prodLine=1003 金工一部1003 金工二部2003
export const getMonthProductionCust = (prodLine) => {
  return request({
    url: '/stampingWelding/monthProductionCust',
    method: 'get',
    params: { prodLine }
  })
}

// 金工月生产数据接口类型定义
export interface MonthProductionCustData {
  a_total: number //A类计划数
  b_total: number //常规计划数
  a_done: number //A类完成数
  b_done: number //常规完成数
}

export interface MonthProductionCustResponse {
  code: number
  message: string
  data: MonthProductionCustData
}

// /stampingWelding/monthProductionCust_trend?prodLine=1003 金工 产量计划达成率 柱状图接口 金工一部1003 金工二部2003
export const getMonthProductionCustTrend = (prodLine: string | number) => {
  return request({
    url: '/stampingWelding/monthProductionCust_trend',
    method: 'get',
    params: { prodLine }
  })
}

// 金工月生产趋势数据月度数据
export interface MonthProductionCustTrendMonthData {
  a_total: number //A类计划数
  b_total: number //常规计划数
  a_done: number //A类完成数
  b_done: number //常规完成数
}

// 金工月生产趋势响应类型
export interface MonthProductionCustTrendResponse {
  code: number
  message: string
  data: {
    [monthKey: string]: MonthProductionCustTrendMonthData // monthKey格式：YYYY-MM，如 "2025-10"
  }
}

// TOP质量问题数据类型
export interface BadIssuesItem {
  ngNO: string | null
  ngName: string
  total: number
  grandTotal: number
  uid: string | null
  createDate: string | null
  [key: string]: any
}

export interface BadIssuesResponse {
  code: number
  message: string
  data: BadIssuesItem[]
}

// 金工一部二部top质量问题  JG1 JG2  2025-11(填写今日所在月份 2025-xx格式)
export const getBadIssuesPerformance = (prodLine: 'JG1' | 'JG2', monthDay: string): Promise<BadIssuesResponse> => {
  return request({
    url: '/report/badIssues_performance',
    method: 'get',
    params: { prodLine, monthDay }
  })
}

// 金工人效达成率接口 /report/efficiency_jg_performance?monthDay=202511
export const getEfficiencyJgPerformance = (monthDay: string) => {
  return request({
    url: '/report/efficiency_jg_performance',
    method: 'get',
    params: { monthDay }
  })
}

// 金工人效达成率响应类型
export interface EfficiencyJgPerformanceResponse {
  code: number
  message: string
  data: {
    achieveDay: number // 月度累计达成天数
    standardDay: number // 月度累计排产天数
  }
}

// 金工人效达成率趋势接口 /report/efficiency_jg_performance_trend
export const getEfficiencyJgPerformanceTrend = () => {
  return request({
    url: '/report/efficiency_jg_performance_trend',
    method: 'get'
  })
}

// 金工人效达成率趋势响应类型
export interface EfficiencyJgPerformanceTrendMonthData {
  achieveDay: number
  standardDay: number
}

export interface EfficiencyJgPerformanceTrendResponse {
  code: number
  message: string
  data: {
    [monthKey: string]: EfficiencyJgPerformanceTrendMonthData
  }
}


// 直通率接口（焊装）
// /report/passRate?prodLine=2003&dayStart=2026-05-01&dayEnd=2026-05-12
export const getPassRate = (prodLine: string | number, dayStart: string, dayEnd: string) => {
  return request({
    url: '/report/passRate',
    method: 'get',
    params: { prodLine, dayStart, dayEnd }
  })
}

// 直通率每日数据项（焊装用）
export interface PassRateDayItem {
  inspectionDate: string
  cjTotal: number
  hchTotal: number
  wjTotal: number
  cjNg: number
  hchNg: number
  wjNg: number
  cjHg: number
  hchHg: number
  wjHg: 0
  cjFirstNg: number
  hchFirstNg: number
  wjFirstNg: number
  rate: number
  firstRate: number | null
}

// 直通率响应类型（焊装）
export interface PassRateResponse {
  code: number
  message: string
  data: {
    hjPassRate_a: PassRateDayItem[]
    hjPassRate_normal: PassRateDayItem[]
    painting_a: PassRateDayItem[]
    painting_normal: PassRateDayItem[]
    chongya: any[]
    zhusu: any[]
  }
}


// orderSettlement
export const getOrderSettlement = (workCenter: string, dateTimeStart: string, dateTimeStop: string) => {
  return request({
    url: '/report/orderSettlement',
    method: 'get',
    params: { workCenter, dateTimeStart, dateTimeStop }
  })
}

