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
  ,  completeDate ,pmc
) => {
  return request({
    url: '/SCM/abnormalQualityReasonAdd',
    method: 'get',
    params: { item_code, reason,docNo,po_arrival_inspection_d_id,completeDate,pmc }
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


// /apollo/PLM/ysComplete 本月爆品上新达成情况
export const getYsComplete = () => {
  return request({
    url: '/PLM/ysComplete',
    method: 'get',
  })
}

// 物料配送列表
export const getMaterialDeliveryList = () => {
  return request({
    url: '/PMC/materialDeliveryList',
    method: 'get',
  })
}

// 物料配送单个工单详情
export const getMaterialDeliveryDetail = (doc_no: string) => {
  return request({
    url: '/PMC/materialDeliveryDetail',
    method: 'get',
    params: { doc_no }
  })
}

// AGV使用率
export const getAgvUseRate = () => {
  return request({
    url: '/PMC/agvUseRate',
    method: 'get',
  })
}

export const getOutboundShipping = () => {
  return request({
    url: '/PMC/outboundShipping',
    method: 'get',
  })
}

// 出库发货明细
export const getOutboundShippingDetail = () => {
  return request({
    url: '/PMC/outboundShippingDetail',
    method: 'get',
  })
}

// 库存信息
export const getInventoryInformation = () => {
  return request({
    url: '/PMC/inventoryInformation',
    method: 'get',
  })
}

// 库存信息
export const getoutboundShippingDetail3day = () => {
  return request({
    url: '/PMC/outboundShippingDetail_3day',
    method: 'get',
  })
}

// 库存信息明细
export const getInventoryInformationDetail = () => {
  return request({
    url: '/PMC/inventoryInformationDetail',
    method: 'get',
  })
}

// 数据填充分析接口
// fill_key: 字段名称（如"月度计划出库发货数"、"今日计划出库发货数"）
// fill_value: 要填写的数值
export const fillDataAnalysis = (fill_key: string, fill_value: number) => {
  return request({
    url: '/incoming/fillDataAnalysis',
    method: 'post',
    params: { fill_key, fill_value }
  })
}