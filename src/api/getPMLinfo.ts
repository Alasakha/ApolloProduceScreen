import request from '../utils/request'



export const getDeliveryRateMonthInfo = () => {
  return request({
    url: '/PLM/ProjectMilestones',
    method: 'get',
  })
}

// /PLM/projectOverdue
export const getProjectOverdueInfo = () => {
  return request({
    url: '/PLM/projectOverdue',
    method: 'get',
  })
}

// /PLM/dailyComplete
export const getDailyCompleteInfo = () => {
  return request({
    url: '/PLM/dailyComplete',
    method: 'get',
  })
}


// /PLM/projectOverdueMain
export const getProjectOverdueMainInfo = () => {
  return request({
    url: '/PLM/projectOverdueMain',
    method: 'get',
  })
}

// /PLl/ysComplete
export const getYsCompleteInfo = () => {
  return request({
    url: '/PLM/ysComplete',
    method: 'get',
  })
}


// /PLM/projectOverdueMainCount
export const getProjectOverdueMainCountInfo = () => {
  return request({
    url: '/PLM/projectOverdueMainCount',
    method: 'get',
  })
}