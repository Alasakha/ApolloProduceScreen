import request from '../utils/request'

//WMS

export const getpositionUtilizationRate= () => {
  return request({
    url: '/WMS/positionUtilizationRate',
    method: 'get',
  })
}
// /WMS/stagnantAmount

export const getstagnantAmount= () => {
    return request({
      url: '/WMS/stagnantAmount',
      method: 'get',
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
