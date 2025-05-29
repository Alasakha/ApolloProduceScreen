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