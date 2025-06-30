import request from '../utils/request'

//WMS

export const getpositionUtilizationRate= () => {
  return request({
    url: '/WMS/positionUtilizationRate',
    method: 'get',
  })
}
// /WMS/stagnantAmount

export const getstagnantAmount= (type) => {
    return request({
      url: '/WMS/stagnantAmount',
      method: 'get',
      params: { type } // 传递 prodLine 参数
    })
  }
  
// 仓库呆滞物料预警前置15天
  export const getstagnantMaterial= () => {
    return request({
      url: '/WMS/stagnantMaterial',
      method: 'get',
    })
  }

  // /WMS/inventory 库存金额 库存数量
  export const getstore= () => {
    return request({
      url: '/WMS/inventory',
      method: 'get',
    })
  }

  // /WMS/warehouseLocation 总库位 + 已用库位 + 库位利用率
  export const getwarehouseLocation= () => {
    return request({
      url: '/WMS/warehouseLocation',
      method: 'get',
    })
  }

  // /WMS/timelyAccountingRate // 及时入账率
  export const gettimelyAccountingRate= () => {
    return request({
      url: '/WMS/timelyAccountingRate',
      method: 'get',
    })
  }

  // /WMS/deliveryTimelinessRat 出库
    export const getdeliveryTimelinessRat= () => {
    return request({
      url: '/WMS/deliveryTimelinessRate',
      method: 'get',
    })
  }


  // /WMS/deliveryTimelinessRateDetail 
    export const getdeliveryTimelinessRateDetail= (warehouseKeeper) => {
    return request({
      url: '/WMS/deliveryTimelinessRateDetail',
      method: 'get',
      params: {
        warehouseKeeper
      } 
    })
  }

      export const gettimelyAccountingRateDetail= (warehouseKeeper) => {
    return request({
      url: '/WMS/timelyAccountingRateDetail',
      method: 'get',
      params: {
        warehouseKeeper
      }
    })
  }

  // /WMS/deliveryTimelinessRateAdd
  export const getdeliveryTimelinessRateAdd= (mo_d_id ,reason,completeDate) => {
    return request({
      url: '/WMS/deliveryTimelinessRateAdd',
      method: 'get',
      params: {
        mo_d_id,
        reason,
        completeDate
      }
    })
  }

  // /apollo/WMS/deliveryTimelinessRateDetailPie
  export const getdeliveryTimelinessRateDetailPie= () => {
    return request({
      url: '/WMS/deliveryTimelinessRateDetailPie',
      method: 'get',
    })
  }

  // /WMS/timelyAccountingRateDetailPie
  export const gettimelyAccountingRateDetailPie= () => {
    return request({
      url: '/WMS/timelyAccountingRateDetailPie',
      method: 'get',
    })
  }