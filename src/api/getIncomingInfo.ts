import request from '../utils/request'



// 来料检验信息
export const getCheckInfo = (params) => {
  return request({
    url: '/incoming/check',
    method: 'post',
    params: params,
    data: ''
  })
}

// 来料检验信息饼图
export const getCheckPie = (params) => {
  return request({
    url: '/incoming/checkPie',
    method: 'post',
    params: params,
    data: ''
  })
}

// 入库信息
export const getEnterInfo = (params) => {
  return request({
    url: '/incoming/enter',
    method: 'post',
    params: params,
    data: ''
  })
}

// 入库信息饼图
export const getEnterPie = (params) => {
  return request({
    url: '/incoming/enterPie',
    method: 'post',
    params: params,
    data: ''
  })
}

// 到货信息
export const getPlanPie = (params) => {
  return request({
    url: '/incoming/planPie',
    method: 'post',
    params: params,  // 作为URL参数
    data: ''  // 空的请求体
  })
}


// 到货信息
export const getPlanInfo = (params) => {
  return request({
    url: '/incoming/plan',
    method: 'post',
    params: params,
    data: ''
  })
}

// /incoming/orderCompletion 
export const getOrderCompletion = (params) => {
  return request({
    url: '/incoming/orderCompletion',
    method: 'post',
    params: params,
    data: ''
  })
}
// /incoming/updateSalesPerformanceYs 更新
export const updateSalesPerformanceYs = (params) => {
  return request({
    url: '/incoming/updateSalesPerformanceYs',
    method: 'post',
    params: params,
    data: ''
  })
}


// /apollo/incoming/financeQuantity
export const getFinanceQuantity = () => {
  return request({
    url: '/incoming/financeQuantity',
    method: 'post',
    data: ''
  })
}

// /incoming/financeIncome
export const getFinanceIncome = () => {
  return request({
    url: '/incoming/financeIncome',
    method: 'post',
    data: ''
  })
}

// /apollo/incoming/financeProfit 利润
export const getFinanceProfit = () => {
  return request({
    url: '/incoming/financeProfit',
    method: 'post',
    data: ''
  })
}


///incoming/financeList 获取数据
export const getFinanceList = () => {
  return request({
    url: '/incoming/financeList',
    method: 'post',
    data: ''
  })
}

// /incoming/updateFinanceById
export const updateFinanceById = (params) => {
  return request({
    url: '/incoming/updateFinanceById',
    method: 'post',
    params: params,
    data: ''
  })
}