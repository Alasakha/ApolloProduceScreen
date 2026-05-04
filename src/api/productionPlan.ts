import axios from 'axios'

// 创建独立的 axios 实例（无需 token）
const request2 = axios.create({
  // baseURL: 'http://192.168.1.167:8085',  // ❌ 删除这一行，让请求走代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 销售订单阶段列表
export const getSalesOrderPhaseList = (orderNo?: string, emp?: string, pageNum?: number, pageSize?: number) => {
  return request2({
    url: '/api/sales-order/phase/fy',  // 使用相对路径，会走 Vite 代理
    method: 'get',
    params: { orderNo, emp, pageNum, pageSize }
  })
}

// 工序计划进度列表
export const getProcessPlanProgress = (params: any) => {
  return request2({
    url: '/api/process/plan/progress',  // 使用相对路径
    method: 'get',
    params
  })
}
