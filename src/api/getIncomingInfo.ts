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
