
import request from '../utils/request'

//注塑
export const getProductPlanCompleteRate = () => {
  return request({
    url: '/injection/planAchievementRate',
    method: 'get',
  })
}

export const getProductPassRate = () => {
  return request({
    url: '/injection/FTQ',
    method: 'get',
  })
}

export const getBadCategory = () => {
  return request({
    url: '/injection/failure',
    method: 'get',
  })
}

export const getDeviceStatus = () => {
  return request({
    url: '/injection/deviceStatus',
    method: 'get',
  })
}

export const getabnormalInfo = () => {
  return request({
    url: '/injection/abnormal',
    method: 'get',
  })
}

export const getMaintanceInfo = () => {
  return request({
    url: '/injection/maintenance',
    method: 'get',
  })
}


// /planAchievementRateToday
// 生产计划达成率
// 改为:每台机，当日排产数、已完成数、达成率
export const getplanAchievementRateToday = () => {
  return request({
    url: '/injection/planAchievementRateToday',
    method: 'get',
  })
}

export const getInvokeDeviceList = () => {
  return request({
    url: '/injection/invokeDeviceList',
    method: 'get',
  })
}

export const getrawMaterialMonitoring = () => {
  return request({
    url: '/injection/rawMaterialMonitoring',
    method: 'get',
  })
}

// /injection/rawMaterialMonitoringAdd
export const getRawMaterialMonitoringAdd =(zhsCode,reason ) =>{
  return request({
    url: '/injection/rawMaterialMonitoringAdd',
    method: 'get',
    params:{zhsCode,reason}
  })
}



export const getElectricToday =() =>{
  return request({
    url: '/injection/electricToday',
    method: 'get',
  })
}

export const getElectricStandard =() =>{
  return request({
    url: '/injection/electricStandard',
    method: 'get',
  })
}

// injection/planDetail 注塑详细
export const getplanDetail =(zhsCode ) =>{
  return request({
    url: '/injection/planDetail',
    method: 'get',
    params:{zhsCode}
  })
}
// {
//   "ty009": "102050101002        ",
//   "ty001": "5103",
//   "ty002": "250718005",
//   "ty004": 100,
//   "item_no": "304075002001",
//   "item_name": "链条罩_黑色",
//   "qty": 100
// },
// ty009：品号 ty001+ty002：客户单号 ty004:总数 qty: 完成数  item_name:品名

// /injection/doneDetail
export const getDoneDetail = (zhsCode) => {
  return request({
    url: '/injection/doneDetail',
    method: 'get',
    params: { zhsCode },
  })
}

// 注塑产品自检质量
export const getSelfCheck = () => {
  return request({
    url: '/injection/selfCheck',
    method: 'get',
  })
}