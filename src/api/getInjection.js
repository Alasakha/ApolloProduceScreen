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