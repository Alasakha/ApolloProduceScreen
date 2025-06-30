import request from '../utils/request'

// 导出生产计划
export const getExportProductionScheduling = (prodLine, dayStart, dayEnd, config = {}) => {
  return request({
    url: '/report/exportProductionScheduling',
    method: 'get',
    params: { prodLine, dayStart, dayEnd },
    ...config
  })
} 