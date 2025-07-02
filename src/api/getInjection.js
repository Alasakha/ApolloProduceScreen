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
