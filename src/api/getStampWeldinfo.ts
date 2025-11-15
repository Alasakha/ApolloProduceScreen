
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
  udf021: string               // 客户单号
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

export type StampingAllResponse = {
  code: number
  message: string
  data: StampingAllItem[]
}

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

// /stampingWelding/stampingTaskAll
export const getStampingTaskAll = (prodLine,type) => {
  return request({
    url: '/stampingWelding/stampingTaskAll',
    method: 'get',
    params: { prodLine,type }
  })
}


// /stampingWelding/stampingStandb
export const getStampingStandb = (prodLine,type) => {
  return request({
    url: '/stampingWelding/stampingStandby',
    method: 'get',
    params: { prodLine,type }
  })
}


// /stamping"elding/stampingAbnormal
export const getStampingAbnormal = () => {
  return request({
    url: '/stampingWelding/stampingAbnormal',
    method: 'get',
  })
} 


// /stampingWelding/weldingPass
export const getWeldingPass = (): Promise<{data: WeldingPass}> => {
  return request({
    url: '/stampingWelding/weldingPass',
    method: 'get',
  })
} 

export interface WeldingPass {
  cjTotal: number   // 车架检验总数
  cjPass: number    // 车架检验合格数
  hchTotal: number  // 后叉检验总数
  hchPass: number   // 后叉检验合格数
  wjTotal: number   // 尾架检验总数
  wjPass: number    // 尾架检验合格数
}

// /stampingWelding/weldingProduction
export const getWeldingProduction = (): Promise<{data: WeldingProduction}> => {
  return request({
    url: '/stampingWelding/weldingProduction',
    method: 'get',
  })
}
export interface WeldingProduction {
  wjDone: number   // 尾架完成数
  cjTotal: number  // 车架总数
  hchTotal: number // 后叉总数
  wjTotal: number  // 尾架总数
  hchDone: number   // 后叉完成数
  cjDone: number    // 车架完成数
}


// /stampingWelding/weldingPassDetail
export const getWeldingPassDetail = (): Promise<{data: WeldingPassDetail}> => {
  return request({
    url: '/stampingWelding/weldingPassDetail',
    method: 'get',
  })
}

export interface WeldingPassDetail {
  uid: string  // 日期
  ta001: string // ta001 + ta002 为工单号
  ta002: string
  ta006: string //品号
  udf021: string //客户单号
  mb002: string //类型
  mb003: string //规格
  bhgNum: number //不合格数
  updateTime: string // 更新时间
  detailList: {
    ngNO: string // 不合格代码
    ngName: string // 不合格名称
    admin_unit_name: string // 责任部门
    ngResponPeople: string // 责任人
  }[]
}


// stampingWelding/todayBadIssues 今日不良TOP5问题
export const getTodayBadIssues = (prodLine: string): Promise<{data: TodayBadIssues[]}> => {
  return request({
    url: '/stampingWelding/todayBadIssues',
    method: 'get',
    params: { prodLine }
  })
}

export interface TodayBadIssues {
  ngName: string
  total: number
} 


// /stampingWelding/sprayFty 喷涂直通率详细 获取接口
export const getSprayFty = (): Promise<{data: SprayFty[]}> => {
  return request({
    url: '/stampingWelding/sprayFty',
    method: 'get',
  })
}

export interface SprayFty {
  po_arrival_inspection_id: string //用于上传数据的id
  inventory_qty: string // 送检数量
  item_description: string // 品名
  item_code: string // 客户单号
  doc_no: string // 检验单号
  udf021: string // 品号
  okCount: number // 合格数
  firstOkCount: number // 首次合格数
  issueList: {
    problemPoint: string // 问题点
    dutyPeople: string // 责任人
  }[]
  //不合格数就是 送检数量-合格数量
}

// /stampingWelding/sprayFtyFillin 数据填写
export const getSprayFtyFillin = (data: SprayFty): Promise<{data: SprayFty}> => {
  return request({
    url: '/stampingWelding/sprayFtyFillin',
    method: 'post',
    data: data
  })
}

export interface SprayFtyFillin {
  po_arrival_inspection_id: string
  okCount: number
  issueList: {
    problemPoint: string
    dutyPeople: string
  }[]
}

// /stampingWelding/automaticWelding 获取自动焊1线 和 2线 小时产能  code=HJ1:自动焊1线  code=HJ2:自动焊2线
export const getAutomaticWelding = (code: string): Promise<{data: AutomaticWelding}> => {
  return request({
    url: '/stampingWelding/automaticWelding',
    method: 'get',
    params: { code }
  })
}

export interface AutomaticWelding {
  code: string // code=HJ1:自动焊1线  code=HJ2:自动焊2线
  monthDay: string // 日期
  jsonStr: string // JSON字符串格式的小时数据
  hourList: {
    hour: number // 小时 (每次上传会覆盖原有的数据 因此上传要全部小时上传)
    cj: number // 车架
    hch: number // 后叉
    wj: number // 尾架
    plan: number // 计划
  }[]
}

// automaticWeldingFillin  自动焊1线2线小时产能填写) 
export const automaticWeldingFillin = (data: AutomaticWeldingFillin): Promise<any> => {
  return request({
    url: '/stampingWelding/automaticWeldingFillin',
    method: 'post',
    data: data
  })
}

export interface AutomaticWeldingFillin {
  code: string // code=HJ1:自动焊1线  code=HJ2:自动焊2线
  hourList: {
    hour: number // 小时 (每次上传会覆盖原有的数据 因此上传要全部小时上传)
    cj: number // 车架
    hch: number // 后叉
    wj: number // 尾架
    plan: number // 计划
  }[]
}




// /dataAcquisition
export const getDataAcquisition = (workspace: string) => {
  return request({
    url: '/stampingWelding/dataAcquisition',
    method: 'get',
    params: { workspace }
  })
}

// /stampingWelding/ruisongHourCl - 瑞松小时产能
export interface RuisongHourCl {
  prodLine: string | null
  hour: number | null
  hour2: number
  date: string | null
  reason: string | null
  cl: string | null
  total: number
  duty: string | null
}

export const getRuisongHourCl = (): Promise<{data: RuisongHourCl[]}> => {
  return request({
    url: '/stampingWelding/ruisongHourCl',
    method:'get'
  })
}

// 提交瑞松小时产能数据
export interface RuisongHourClSubmit {
  hour2: number
  total: number
}

export const submitRuisongHourCl = (data: RuisongHourClSubmit[]): Promise<any> => {
  return request({
    url: '/stampingWelding/ruisongHourCl',
    method: 'post',
    data: data
  })
}

// /stampingWelding/anchuanHourCl - 自动焊一线小时产能（安川）
export interface AnchuanHourCl {
  prodLine: string | null
  hour: number | null
  hour2: number | null
  date: string | null
  reason: string | null
  cl: string | null
  total: number | null
  duty: string | null
}

export const getAnchuanHourCl = (): Promise<{data: AnchuanHourCl[]}> => {
  return request({
    url: '/stampingWelding/anchuanHourCl',
    method: 'get'
  })
}

// /stampingWelding/paintingPassRate
export const getPaintingPassRate = (): Promise<{data: PaintingPassRate[]}> => {
  return request({
    url: '/stampingWelding/paintingPassRate',
    method: 'get',

  })
}

export interface PaintingPassRate {
  inspectionDate: string
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
  rate: number
  firstRate: number
}
// /stampingWelding/getTemperature4
export const getTemperature4 = (): Promise<{data: Temperature4}> => {
  return request({
    url: '/stampingWelding/getTemperature4',
    method: 'get',
  })
}
export interface Temperature4 {
  pmx: number //粉体线 固化炉温度
  tbx: number //铁板线 固化炉温度
  ytx: number //液体线 固化炉温度
}


// paintingPassRateDetail 二部 直通率点击详细信息
export const getPaintingPassRateDetail = (): Promise<{data: PaintingPassRateDetail[]}> => {
  return request({
    url: '/stampingWelding/paintingPassRateDetail',
    method: 'get',
  })
}

export interface PaintingPassRateDetail {
  udateTim: string         // 更新时间
  MB00: string             // 品号
  UDF66: string            // 总数
  ng: number               // 不合格数
  firstNg: number          // 首件不合格数
  TAO01: string            // 工单号 （TA001+TA002）
  TA002: string           
  TA006: string            // 品号
  MBO03: string            // 规格
  peopleName: string       // 操作人
}

// paintingPassRate2 一部 直通率点击详细信息
export const getPaintingPassRate2 = (): Promise<{data: PaintingPassRateDetail[]}> => {
  return request({
    url: '/stampingWelding/paintingPassRate2',
    method: 'get',
  })
}

// /todayBadIssuesDetail
export const getTodayBadIssuesDetail = (prodLine: string): Promise<{data: TodayBadIssuesDetail[]}> => {
  return request({
    url: '/stampingWelding/todayBadIssuesDetail',
    method: 'get', 
    params: { prodLine }
  })
}

export interface TodayBadIssuesDetail {
  ngNO: string
  ngName: string //问题名称
  total: number | null
  grandTotal: number | null
  uid: string
  createDate: string //生成时间
  ih_uid: string | null
  ta001: string | null //
  ta002: string //工单号
  ta006: string //品号
  mb002: string //品名
  peopleName: string | null 
  ngResponPeople: string //责任人
  ngHandle: string | null
  ngReason: string | null
  nums: string //数量
  mb003: string //规格型号
  admin_UNIT_NAME: string //责任部门
}

// 月度生产数据接口返回类型
export interface MonthProductionData {
  pcTotal: number  // 排产总数
  done: number     // 已完成数
  undone: number   // 未完成数
}

// monthProduction - 支持一部焊接(1006)和二部焊接(2006)
export const getMonthProduction = (prodLine: string): Promise<{code: number, message: string, data: MonthProductionData}> => {
  return request({
    url: '/stampingWelding/monthProduction',
    method: 'get',
    params: { prodLine }
  })
}

// /stampingWelding/dayPlanDone?prodLineType=8  88手工焊
// 9自动焊1线
// 10自动焊2线
// 11铁架焊
export const getDayPlanDone = (prodLineType: string): Promise<{data: DayPlanDone[]}> => {
  return request({
    url: '/stampingWelding/dayPlanDone',
    method: 'get',
    params: { prodLineType }
  })
}

export interface DayPlanDone {
  te006: string       // 物料编码
  te007: string       // 工单号
  num: number         // 计划
  te017: string | null
  cx: string          // 车型
  te018: string       // 品名
  label: string       // 产品
  done: number        // 已完成数
}




// /stampingWelding/dayPlanDoneTotal?prodLineType=8
export const getDayPlanDoneTotal = (prodLineType: string): Promise<{data: DayPlanDoneTotal}> => {
  return request({
    url: '/stampingWelding/dayPlanDoneTotal',
    method: 'get',
    params: { prodLineType }
  })
}

export interface DayPlanDoneTotal {
  total: number       // 计划总数
  done: number        // 已完成数
  //效率 done/total
}

// 计划进度管控数据接口
export interface PlanProgressControl {
  monthTotalPlan: number      // 月总计划量（4台机总计划）
  monthCompleted: number      // 月已完成量（4台机累计完成数）
  monthCompletionRate: number // 月完成率
  todayPlan: number           // 今日计划量（4台机今日总计划）
  todayCompleted: number      // 今日已完成量（4台机总完成数）
  todayCompletionRate: number // 今日完成率
}

// 工单结单率数据接口
export interface WorkOrderClosingRate {
  dailyInboundOrders: number  // 日入库工单
  onTimeOrders: number        // 准时工单
  closingRate: number         // 结单率
  todayPlanOrders: number     // 今日计划工单数
  todayCompletedOnTime: number // 已准时完结工单
  todayClosingRate: number    // 今日结单率
}

// 获取计划进度管控数据（mock数据，后续连接真实接口）
export const getPlanProgressControl = async (_prodLine: string): Promise<{code: number, data: PlanProgressControl}> => {
  // TODO: 后续连接真实接口
  // return request({
  //   url: '/injection/planProgressControl',
  //   method: 'get',
  //   params: { prodLine: _prodLine }
  // })
  
  // Mock数据
  return Promise.resolve({
    code: 200,
    data: {
      monthTotalPlan: 12500,
      monthCompleted: 10200,
      monthCompletionRate: 81.6,
      todayPlan: 450,
      todayCompleted: 380,
      todayCompletionRate: 84.4
    }
  })
}

// 获取工单结单率数据（mock数据，后续连接真实接口）
export const getWorkOrderClosingRate = async (_prodLine: string): Promise<{code: number, data: WorkOrderClosingRate}> => {
  // TODO: 后续连接真实接口
  // return request({
  //   url: '/injection/workOrderClosingRate',
  //   method: 'get',
  //   params: { prodLine: _prodLine }
  // })
  
  // Mock数据
  return Promise.resolve({
    code: 200,
    data: {
      dailyInboundOrders: 28,
      onTimeOrders: 25,
      closingRate: 89.3,
      todayPlanOrders: 32,
      todayCompletedOnTime: 28,
      todayClosingRate: 87.5
    }
  })
}


// curl -X 'GET' \
//   'http://192.168.1.197:10999/apollo/stampingWelding/productionScheduleProgress?prodLine=1003&type=1' \
//   -H 'accept: */*'  type: 1:安川,2:松下
export const getProductionScheduleProgress = (prodLine: string, type: string): Promise<{data: ProductionScheduleProgress[]}> => {
  return request({
    url: '/stampingWelding/productionScheduleProgress',
    method: 'get',
    params: { prodLine, type }
  })
}

export interface ProductionScheduleProgress {
  prodLine: string
  type: string
  data: any
}

// 类型
export interface ProductionScheduleProgressItem {
  type: number;           // 类型，1=月度数据，2=今日数据 
  machName: string;       // 设备名称
  pg: number;             // 计划数
  done: number;           // 完成数
  pgDetailList: any;      // 详细列表（可为null）
}


  // curl -X 'GET' \
  //   'http://192.168.1.197:10999/apollo/stampingWelding/todayBadIssues_person?prodLine=1003' \
  //   -H 'accept: */*'
  export const getTodayBadIssuesPerson = (prodLine: string): Promise<{data: TodayBadIssuesPerson[]}> => {
    return request({
      url: '/stampingWelding/todayBadIssues_person',
      method: 'get',
      params: { prodLine }
    })
  }
  export interface TodayBadIssuesPerson {
    ngResponPeople: string;
    total: number;
  }