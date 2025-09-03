import request from '../utils/request'


// /manufacturing/fty post
export const getFty = (date: string ,endDay: string) => {
  return request({
    url: '/manufacturing/fty',
    method: 'post',
    params: {
      date: date,
      endDay: endDay
    },
  })
}

export interface TodayProduction {
    target_normal: string, //常规达成率目标
    actual_normal: number, //常规达成率实际值
    target_a: string, //A类达成率目标
    actual_a: number //A类达成率实际值
    // 达成率就是实际值除以目标值 分为常规和A类
}


// /manufacturing/onTime post  参数通过URL查询参数传递 当月填写本月第一天  当日填写今日
export const getOnTime = (date: string) => {
  return request({
    url: '/manufacturing/onTime',
    method: 'post',
    params: {
        startDay: date
    },
  })
}
export interface OnTime {
    code: number,
    message: string,
    data: {
          a: {
            completeNum: number, //A类客户订单 已入库工单数
            total: number //A类客户订单 工单总数
            //准交率= 已入库工单数/工单总数
          },
          normal: {
            completeNum: number, //常规客户订单 已入库工单数
            total: number //常规客户订单 工单总数
            //准交率= 已入库工单数/工单总数
        }
    }
}

// 问题项数据类型
export interface IssueItem {
  ngName: string, // 问题名称
  ngNatureType: string, // 问题性质类型（性能问题、外观问题、紧固问题、组装问题等）
  ngReason: string | null, // 问题原因
  admin_unit_name: string | null, // 管理单位名称
  ngResponPeople: string | null, // 问题负责人
  total: number // 问题总数
}

// 车间问题数据类型
export interface WorkshopIssueData {
  workCenterId: string, // 工作中心ID
  A类: IssueItem[], // A类客户问题列表
  常规类: IssueItem[], // 常规客户问题列表
  workCenter: string // 工作中心名称
}

// 顶级问题车间响应类型
export interface TopIssueWorkshopResponse {
  code: number,
  message: string,
  data: {
    code: number,
    message: string,
    data: WorkshopIssueData[]
  }
}

// /manufacturing/topIssueWorkshop post
export const getTopIssueWorkshop = (startDay: string,endDay: string): Promise<TopIssueWorkshopResponse> => {
  return request({
    url: '/manufacturing/topIssueWorkshop',
    method: 'post',
    params: {
      startDay: startDay,
      endDay: endDay
    },
  })
}



// /manufacturing/ftyWorkshop   //返回data数据类型 用上面的TodayProduction一样
// prodLine: 10041005 startDay:本月第一天 为总装一棵月度数据
// prodLine: 10041005 startDay:本年第一天 为总装一课年度数据
// prodLine: 20042005 startDay:本月第一天 为总装二课月度数据
// prodLine: 20042005 startDay:本年第一天 为总装二课年度数据
// 接口返回结构如下
// export interface TodayProduction {
//   target_normal: string, //常规达成率目标
//   actual_normal: number, //常规达成率实际值
//   target_a: string, //A类达成率目标
//   actual_a: number //A类达成率实际值
//   // 达成率就是实际值除以目标值 分为常规和A类
// }

export const getFtyWorkshop = (prodLine: string,startDay: string,endDay: string) => {
  return request({
    url: '/manufacturing/ftyWorkshop',
    method: 'post',
    params: {
      prodLine: prodLine,
      startDay: startDay,
      endDay: endDay
    },
  })
}

// /manufacturing/onTimeChart  返回数据结构
// /manufacturing/onTimeChart 接口返回数据的 TypeScript 类型定义

// 单个客户类型（A类或常规）
export interface OnTimeChartCustomer {
  completeNum: number; // 已入库工单数
  total: number;       // 工单总数
  target: number;      // 目标达成率（如0.95）
  // 直通率：completeNum/total 手算
}

// 单条数据类型
export interface OnTimeChartItem {
  a: OnTimeChartCustomer;       // A类客户数据
  normal: OnTimeChartCustomer;  // 常规客户数据
  sunday: string;               // 本周日日期（yyyy-MM-dd）
  monday: string;               // 本周一日期（yyyy-MM-dd）
}

// 响应类型
export interface OnTimeChartResponse {
  code: number;
  message: string;
  data: OnTimeChartItem[];
}
export const getOnTimeChart = () => {
  return request({
    url: '/manufacturing/onTimeChart',
    method: 'post',
  })
}


/**
 * 提交人效原因说明
 * @param code 代码（如：FTY_A_MONTH）
 * @param reason 原因说明
 * @param solve 解决措施
 * @returns Promise
 * "FTY_A_MONTH";        // A类月度直通通率 
"FTY_NORMAL_MONTH";   // 常规类月度直通通率 
"ONTIME_A_MONTH";     // A类月度准交率 
"ONTIME_A_DAY";       // A类每日准交率 
"ONTIME_NORMAL_MONTH"; // 常规类月度准交率 
"ONTIME_NORMAL_DAY";   // 常规类每日准交率 
COST"： 制造费用
 */


export const fillInReason = (code: string, reason: string, solve: string) => {
  return request({
    url: '/manufacturing/fillIn',
    method: 'post',
    params: {
      code,
      reason,
      solve,
    },
    // 这里不需要传递data，body为空
    data: ''
  })
}


/**
 * 获取人效原因说明数据
 * @param code 代码（如：FTY_A_MONTH）
 * @returns Promise
 */
export const getFillInData = (code: string) => {
  return request({
    url: '/manufacturing/getFillInData',
    method: 'post',
    params: {
      code,
    },
    data: ''
  })
}



// /manufacturing/manufacturingCost
export const getManufacturingCost = () => {
  return request({
    url: '/manufacturing/manufacturingCost',
    method: 'post',
  })
}


// 制造费用相关类型定义
export interface ManufacturingCostResponse {
  code: number
  message: string
  data: ManufacturingCostData
}

export interface ManufacturingCostData {
  营业收入: number
  实际制造费: number
  目标: number
}


// /manufacturing/onTimePart
export const getOnTimePart = (customer: string) => {
  return request({
    url: '/manufacturing/onTimePart',
    method: 'post',
    params: { customer }
  })
}


// 准交率接口返回类型定义
export interface OnTimePartResponse {
  code: number
  message: string
  data: OnTimePartData
}

export interface OnTimePartData {
  total: number //总数
  zjNum: number //准交数
}

// onTimePartDetail
export const  getOnTimePartDetail= (customer) =>{

  return request({
    url: '/manufacturing/onTimePartDetail',
    method: 'post',
    params: { customer }
  })

}

// ftyChart 
export const getFtyChart = (Customer) => {
  return request({
    url: '/manufacturing/ftyChart',
    method: 'post',
    params: {
      Customer 
    },
  })
}



// 涂装合格率数据接口
export interface PaintingPassRateData {
  target_normal: number  // 目标合格率
  actual_normal: number  // 实际合格率  
  target_a: number       // A类目标合格率
  actual_a: number       // A类实际合格率
}

// /paintingPassRate - 涂装合格率
export const getPaintingPassRate = (startDay?: string, endDay?: string): Promise<{data: PaintingPassRateData}> => {
  const params: Record<string, string> = {}
  if (startDay) params.startDay = startDay
  if (endDay) params.endDay = endDay
  
  return request({
    url: '/manufacturing/paintingPassRate',
    method: 'post',
    params
  })
}
