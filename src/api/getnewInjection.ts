import request from '../utils/request'


export const getPurchasePassRate = (queryDate) => {
  return request({
    url: '/SCM/purchasePassRate',
    method: 'get',
    params: { queryDate } // 传递 prodLine 参数
  })
}

// /SCM/deliveryRat
export const getDeliveryRat = (queryDate) => {
  return request({
    url: '/SCM/purchaseDeliveryRate',
    method: 'get',
    params: { queryDate } // 传递 prodLine 参数

  })
}

// /SCM/purchaseSigningRate?
export const getPurchaseSigningRate = (queryDate) => {
  return request({
    url: '/SCM/purchaseSigningRate',
    method: 'get',
    params: { queryDate } // 传递 prodLine 参数

  })
}
// /SCM/abnormalQualityToday
export const getAbnormalQualityToday = (queryDate) => {
  return request({
    url: '/SCM/abnormalQualityToday',
    method: 'get',
    params: { queryDate } // 传递 prodLine 参数

  })
}


// SCM/top3PurchaserToday
export const getExellentPerson = () => {
  return request({
    url: '/SCM/top3PurchaserToday',
    method: 'get',
  })
}

// /SCM/purchaseDeliveryRate
export const getPurchaseDeliveryRate = (type ) => {
  return request({
    url: '/SCM/purchaseDeliveryRate2',
    method: 'get',
    params: { type} // 传递 prodLine 参数
  })
}



