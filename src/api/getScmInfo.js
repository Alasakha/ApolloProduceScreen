import request from '../utils/request'

export const getJinhuoHege = () => {
  return request({
    url: '/SCM/purchasePassRate5Day',
    method: 'get',
  })
}

// 供应商不良TOP5
export const getTop5SupplierBad = () => {
  return request({
    url: '/SCM/top5SupplierBad',
    method: 'get',
  })
}

// 进货不良问题TOP5
export const getTop5PurchaseBad = () => {
  return request({
    url: '/SCM/top5PurchaseBad',
    method: 'get',
  })
}

//到货及时率
export const getDeliveryRate5Day = () => {
  return request({
    url: '/SCM/deliveryRate5Day',
    method: 'get',
  })
}

//到货不及时供应商TO5
export const getTop5SuppliersDelayedDelivery = () => {
  return request({
    url: '/SCM/top5SuppliersDelayedDelivery',
    method: 'get',
  })
}
//供应商回签不及时TOP5
export const getTop5SuppliersDelayedSignature = () => {
  return request({
    url: '/SCM/top5SuppliersDelayedSignature',
    method: 'get',
  })
}


// 采购单回签不及时采购员TOP5
export const getTop5PurchaserSignBackDelayed = () => {
  return request({
    url: '/SCM/top5PurchaserSignBackDelayed',
    method: 'get',
  })
}

// 次日生产欠料
export const getWarningNextDay = () => {
  return request({
    url: '/SCM/warningNextDay',
    method: 'get',
  })
}


// /SCM/top3SupplierLastMonth
export const getTop3SupplierLastMonth = () => {
  return request({
    url: '/SCM/top3SupplierLastMonth',
    method: 'get',
  })
}

// 获取天气API
export const getWeather = () => {
  return request({
    url: '/SCM/getCurrentWeather',
    method: 'get',
  })
}


///SCM/warningNextDay1 次日生产欠料预警 总装一课

export const getWarningNextDay1  = () => {
  return request({
    url: '/SCM/warningNextDay1',
    method: 'get',
  })
}

///SCM/warningNextDay1 次日生产欠料预警 总装二课

export const getWarningNextDay2  = () => {
  return request({
    url: '/SCM/warningNextDay2',
    method: 'get',
  })
}