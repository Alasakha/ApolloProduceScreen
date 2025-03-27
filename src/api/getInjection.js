import request from '../utils/request'

//注塑

export const getProductPlanCompleteRate = () => {
  return request({
    url: '/injection/planAchievementRate',
    method: 'get',
  })
}