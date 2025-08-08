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
export const getAbnormalUnfinishedList = (workCenter,dateTimeStart,dateTimeStop) => {
  return request({
    url: '/production/abnormalUnfinishedList', // 请求的 URL
    method: 'get',
    params: { workCenter, dateTimeStart, dateTimeStop }
})
}
// /production/abnormalList
export const getEfficiencyHour = (prodLine) => {
  return request({
    url: '/production/efficiencyHour',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// /apollo/production/
export const getProductionPlan = (prodLine,type) => {
  return request({
    url: '/production/reasonHour',
    method: 'get',
    params: { prodLine,type } // 传递 prodLine 参数
  })
}

// 插入小时计划数据
export const insertHourPlan = (data) => {
  return request({
    url: '/production/insertHourEffReason',
    method: 'post',
    data: data  // data应该是一个数组
  })
}


// /production/planHour 计划产量
export const getPlanHour = (prodLine) => {
  return request({
    url: '/production/planHour',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}
// /production/capacityHour
export const getCapacityHour = (prodLine) => {
  return request({
    url: '/production/capacityHour',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// /production/abnormalUnfinishedAdd
export const getAbnormalUnfinishedAdd = (prodLine,doc_no,item_code,pc_date,reason,duty,completeDate ) => {
  return request({
    url: '/production/abnormalUnfinishedAdd',
    method: 'get',
    params:{prodLine,doc_no,item_code,pc_date,reason,duty,completeDate }
  })
}

// /production/efficiencyBelowAdd
export const getEfficiencyBelowAdd = (prodLine,reason ) => {
  return request({
    url: '/production/efficiencyBelowAdd',
    method: 'get',
    params:{prodLine,reason }
  })
}


// /production/efficiencyReduceAdd
export const getEfficiencyReduceAdd = (prodLine,reduce_minute,reduce_count ,reason ,reduce_type ) => {
  return request({
    url: '/production/efficiencyReduceAdd',
    method: 'get',
    params:{prodLine,reduce_minute,reduce_count,reason ,reduce_type }
  })
}