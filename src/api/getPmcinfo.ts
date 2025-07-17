import request from '../utils/request'



export const getDeliveryRateMonthInfo = (prodLine) => {
  return request({
    url: '/PMC/deliveryRateMonth',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

export const getDeliveryRateTodayInfo = (prodLine) => {
    return request({
      url: '/PMC/deliveryRateToday',
      method: 'get',
      params: { prodLine } // 传递 prodLine 参数
    })
  }
  
//   /apollo/PMC/abnormalCategory'
export const getAbnormalCategory = () => {
    return request({
      url: '/PMC/abnormalCategory',
      method: 'get',

    })
  }


//   /PMC/abnormalDept
export const getAbnormalDept = () => {
    return request({
      url: '/PMC/abnormalDept',
      method: 'get',

    })
}

//   /PMC/abnormalUnfinished
export const getAbnormalUnfinished = () => {
    return request({
      url: '/PMC/abnormalUnfinished',
      method: 'get',

    })
  }

  // /PMC/abnormalUnfinishedLis
  export const getAbnormalUnfinishedList = () => {
    return request({
      url: '/PMC/abnormalUnfinishedList',
      method: 'get',

    })
  }
  // /PMC/inRate
  export const getInRate = () => {
    return request({
      url: '/PMC/inRate',
      method: 'get',

    })
  }

  // /PMC/deliveryRate
  export const getDeliveryRate = () => {
    return request({
      url: '/PMC/deliveryRate',
      method: 'get',

  })
}
  
// /PMC/outRate
export const getOutRate = () => {
  return request({
    url: '/PMC/outRate',
    method: 'get',

  })
}

// /SCM/abnormalQualityReasonAdd
// params : item_code, reason
// 单日来料质量异常问题原因记录
export const getAbnormalQualityReasonAdd = (item_code, reason,docNo,po_arrival_inspection_d_id
  ,  completeDate
) => {
  return request({
    url: '/SCM/abnormalQualityReasonAdd',
    method: 'get',
    params: { item_code, reason,docNo,po_arrival_inspection_d_id,completeDate }
  })
}


// /SCM/abnormalQualityReasonUpdate
// params : item_code , reason
// 单日来料质量异常问题原因记录更新
export const getAbnormalQualityReasonUpdate = (item_code, reason,docNo,po_arrival_inspection_d_id) => {
  return request({
    url: '/SCM/abnormalQualityReasonUpdate',
    method: 'get',
    params: { item_code, reason,docNo,po_arrival_inspection_d_id }
  })
}

// /apollo/PlC/stagnantAmount 
export const getStagnantAmount = (type:Number) => {
  return request({
    url: '/PMC/stagnantAmount',
    method: 'get',
    params: { type}
  })
}
