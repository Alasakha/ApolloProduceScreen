import request from '../utils/request'



export const getabnormalProductionMonthInfo = (prodLine) => {
  return request({
    url: '/production/abnormalProductionMonth',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

export const getabnormalProductionDaliyInfo = (prodLine) => {
  return request({
    url: '/production/abnormalProductionDay',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

export const getMonthTotalInfo = (prodLine) => {
  return request({
    url: '/production/monthTotal',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}
export const getTodayProductionInfo = (prodLine) => {
  return request({
    url: '/production/todayProduction',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}
export const getColumnarHourInfo = (prodLine) => {
  return request({
    url: '/production/columnarHour',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// 5.	今日工单进度
export const getTodayOrderProgressInfo = (prodLine) => {
  return request({
    url: '/production/workOrderProgress',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

//认识效率
export const getEfficiencyInfo = (prodLine) => {
  return request({
    url: '/production/workerEfficiency',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}


// /production/maintenance
//设备点检
export const getMaintenanceInfo = (prodLine) => {
  return request({
    url: '/production/maintenance',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

//当日人时效率
// /production/efficiencyToday
export const getEfficiencyToday = (prodLine) => {
  return request({
    url: '/production/efficiencyToday',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// /production/abnormalList
export const getAbnormalList = (prodLine) => {
  return request({
    url: '/production/abnormalList',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// 修改请求方式，使用 form-data 格式
export const getAbnormalUnfinishedList = (formData) => {
  return request({
    url: '/production/abnormalUnfinishedList', // 请求的 URL
    method: 'post',
    data: formData,  // 直接将 formData 作为请求体
    headers: {
      'Content-Type': 'multipart/form-data', // 明确设置为 form-data 格式
    }
  })
}