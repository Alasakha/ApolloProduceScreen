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
