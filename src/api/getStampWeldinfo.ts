
import request from '../utils/request'

export interface TodayProduction {
  pcGdTotal: number   // 排产工单数
  gdPg: number          // 工单派工数
  rate: number          // 达成率
  gdRate: number       // 工单达成率
  pg: number           // 派工数
  gdDone: number     // 工单报工数
  pcTotal: number  // 排产数
  done: number         // 报工数
  undone: number     // 未报工数
}

export const getTodayProduction = (prodLine) => {
  return request({
    url: '/stampingWelding/todayProduction',
    method: 'get',
    params: { prodLine }
  })
}


// /apollo/stampingWelding
export const getApolloStampingWelding = (prodLine) => {
  return request({
    url: '/stampingWelding/todayInspection',
    method: 'get',
    params: { prodLine }
  })
}
// "checkTotal": 9,
// "firstHgTotal": 8,
// "passPercent": "88.9%"
export interface ApolloStampingWelding {
  checkTotal: number
  firstHgTotal: number
  passPercent: string
  toBeInspected: number
}
// /stampingWelding/todayWeldingProduction
// export const getTodayWeldingProduction = (prodLine) => {
//   return request({
//     url: '/stampingWelding/todayWeldingProduction',
//     method: 'get',
//     params: { prodLine }
//   })
// }

// /stampingWelding/warningNextDay?prodLine=1003
export const getWarningNextDay = (prodLine) =>{
  return request({
    url:'/stampingWelding/warningNextDay',
    method: 'get',
    params: { prodLine}
  })
}


// /stampingWelding/stampingPgAbnormal
export const getStampingPgAbnormal = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingPgAbnormal',
    method: 'get',
    params: { prodLine }
  })
}


export const getStampingGeneralData = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingGeneralData',
    method: 'get',
    params: { prodLine }
  })
}
// /stampingWelding/stampingBgAbnormal
export const getStampingBgAbnormal = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingBgAbnormal',
    method: 'get',
    params: { prodLine }
  })
}

// /apollo/incoming/selectSalesIssueAmt
export const getSelectSalesIssueAmt = () => {
  return request({
    url: '/incoming/selectSalesIssueAmt',
    method: 'post',
  })
}


// /stampingWelding/stampingMachineData
export const getStampingMachineData = (prodLine,type) => {
  return request({
    url: '/stampingWelding/stampingMachineData',
    method: 'get',
    params: { prodLine,type }
  })
}


// /stampingWelding/addProcesshum  /apollo/stampingWelding/addProcesshum 填写工序完成数量
export const addProcesshum = (mo_routing_d_id ,num) => {
  return request({
    url: '/stampingWelding/addProcessNum',
    method: 'get',
    params: { mo_routing_d_id ,num },

  })
} 

// 焊接补焊API接口
export const addWeldingRepair = (workNo: string, productId: string, num: number) => {
  return request({
    url: '/stampingWelding/repairWelding',
    method: 'get',
    params: { workNo, productId, num }
  })
} 

// 冲压设备组数据接口定义
export interface StampingDeviceGroup {
  // 根据实际API字段调整，这里先预定义一些可能的字段
  id?: string
  name?: string
  orderName?: string
  totalQty?: number
  doneQty?: number
  progress?: number
  status?: string
  spec?: string
  // 可以根据实际API返回的字段进行调整
}

export interface StampingDoingResponse {
  SG_ALL: StampingDeviceGroup[]    // 冲压设备组
  CHH_ALL: StampingDeviceGroup[]   // 冲孔设备组  
  WG_ALL: StampingDeviceGroup[]    // 弯管设备组
  GH_ALL: StampingDeviceGroup[]    // 滚花设备组
  CHC_ALL: StampingDeviceGroup[]   // 冲床设备组
  YJ_ALL: StampingDeviceGroup[]    // 压机设备组
  TZ_ALL: StampingDeviceGroup[]    // 调直设备组
}

// /stampingWelding/stampingDoing
export const getStampingDoing = (prodLine ,type): Promise<{data: StampingDoingResponse}> => {
  return request({
    url: '/stampingWelding/stampingDoing',
    method: 'get',
    params: { prodLine,type }
  })
}


// 冲压焊接工序详情数据接口
export interface StampingAllItem {
  te001te002: string           // 工单号
  machineName: string | null   // 机器名称
  employeeName: string         // 员工姓名
  isDoing: string              // 是否在做 "0"或"1"
  workNo: string               // 工作号
  productId: string            // 产品ID
  num: string                  // 数量
  processName: string          // 工序名称
  item_name: string | null     // 物料名称
  item_description: string     // 物料描述
  item_specification: string   // 物料规格
  ty004: string | null         // 类型004
  plan_qty: string             // 计划数量
  macNo: string                // 机器编号
  deviceStateName: string | null // 设备状态名称
  laserPower: string | null    // 激光功率
  workSpeed: string | null     // 工作速度
  repairWelding: string | null // 补焊
  production: string | null    // 生产
  liu: string | null           // 流
  ya: string | null            // 压
  jp: string | null            // 夹
  status: string | null        // 状态
  ratedPower: string | null    // 额定功率
  itemList: any[] | null       // 物料列表
}

export type StampingAllResponse = StampingAllItem[]

// /stampingWelding/stampingAll
export const getStampingAll = (prodLine: string, type: string): Promise<StampingAllResponse> => {
  return request({
    url: '/stampingWelding/stampingAll',
    method: 'get',
    params: { prodLine, type }
  })
}


// /stampingWelding/stampingDoingIndex
export const getStampingDoingIndex = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingDoingIndex',
    method: 'get',
    params: { prodLine }
  })
}
// 设备组数据接口
export interface DeviceGroupData {
  type: number         // 设备类型
  code: string         // 设备组代码
  qty_total: number    // 总数量
  num_total: number    // 总件数
  doing_count: number  // 正在进行数量
  machine_count: number // 机器数量
}

// 冲压焊接工序详情数据接口
export interface StampingDoingIndex {
  SG_ALL?: DeviceGroupData   // 冲压设备组
  CHH_ALL?: DeviceGroupData  // 冲孔设备组
  WG_ALL?: DeviceGroupData   // 弯管设备组
  GH_ALL?: DeviceGroupData   // 滚弯设备组
  CHC_ALL?: DeviceGroupData  // 冲槽设备组
  YJ_ALL?: DeviceGroupData   // 压筋设备组
  TZ_ALL?: DeviceGroupData   // 套丝设备组
}

