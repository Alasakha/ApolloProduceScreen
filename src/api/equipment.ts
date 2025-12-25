import request from '@/utils/request'

export interface MachineInspectionItem {
  te001?: string
  te002?: string
  te011?: string
  te012?: string
  te019?: string
  te031?: string
  te033?: string
  te029?: string
  te030?: string
  [key: string]: unknown
}

export interface MachineRunningItem {
  machCode: string
  machName: string
}

export interface MachineRepairItem {
  deviceId: string
  deviceName: string
  moctyudf05: string | null
  status: string | null
  lvTwoLastMaintenanceDay: string | null
  lvThreeLastMaintenanceDay: string | null
}

export interface MachineInspectionData {
  total?: number
  uncheckCount?: number
  checkCount?: number
  check?: MachineInspectionItem[]
  running?: MachineRunningItem[]
  repair?: MachineRepairItem[]
  runningCount?: number
  standbyCount?: number
  repairCount?: number
  repairCompleteCount?: number
  standby?: number
  abnormal?: number
  [key: string]: unknown
}

export interface MachineInspectionResponse {
  code: number
  message: string
  data: MachineInspectionData
}

export const getMachineInspection = (): Promise<MachineInspectionResponse> => {
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/inspection',
    method: 'post',
    data: {}
  })
}

export interface KeyMachineStatusResponse {
  code: number
  message: string
  data: MachineInspectionData
}

export const getKeyMachineStatus = (): Promise<KeyMachineStatusResponse> => {
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/keyMachineSts',
    method: 'post',
    data: {}
  })
}


// /machine/machineAbnormalPie
export const getMachineAbnormalPie = () => {
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/machineAbnormalPie',
    method: 'post',
    data: {}
  })
}

// /machine/machineAbnormalDetail
export interface MachineAbnormalDetailItem {
  id: number
  ta001: string
  ta002: string
  startTime: string
  endTime: string
  startPeopleName: string
  startRemark: string
  endPeopleName: string
  endRemark: string
  dutyDeptName: string        
  udf01: string
  responseTime: string
}

export interface MachineAbnormalDetailResponse {
  code: number
  message: string
  data: MachineAbnormalDetailItem[]
}

export const getMachineAbnormalDetail = (category: string): Promise<MachineAbnormalDetailResponse> => {
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/machineAbnormalDetail',
    method: 'post',
    params: { category },
    data: {}
  })
}

// /machine/oee
export interface OeeItem {
  monthday: string
  mac_no: string
  mac_name: string
  oee: number
  operation: number
  performance: number
  pass: number
}

export interface OeeResponse {
  code: number
  message: string
  data: OeeItem[]
}

export const getMachineOee = (workshop?: string): Promise<OeeResponse> => {
  const data: Record<string, unknown> = {}
  if (workshop) {
    data.workshop = workshop
  }
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/oee',
    method: 'post',
    data
  })
}

// curl -X 'POST' \
//   'http://192.168.1.197:10989/apollo/machine/faultyEquipment' \
//   -H 'accept: */*' \
//   -d ''

// 类型定义
export interface FaultyEquipmentItem {
  machCode: string
  machName: string
  fault_count: number
  total_minutes: number
}

export interface FaultyEquipmentResponse {
  code: number
  message: string
  data: FaultyEquipmentItem[]
}

export const getFaultyEquipment = (): Promise<FaultyEquipmentResponse> => {
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/faultyEquipment',
    method: 'post',
    data: {}
  })
}

// /machine/singleMachineInfo
export interface SingleMachineInfoItem {
  macNo: string           // 机器编号
  macName: string         // 机器名称
  state: string | null    // 设备状态（加工中、调机、待机等）
  powerOnTime: string     // 开机时间（小时）
  nextBaoyangTime: string // 下次保养时间
}

export interface SingleMachineInfoResponse {
  code: number
  message: string
  data: SingleMachineInfoItem[]
}

export const getSingleMachineInfo = (): Promise<SingleMachineInfoResponse> => {
  return request({
    baseURL: 'http://192.168.1.197:10989/apollo',
    url: '/machine/singleMachineInfo',
    method: 'post',
    data: {}
  })
}