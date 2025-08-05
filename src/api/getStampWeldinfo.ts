
import request from '../utils/request'

export interface TodayProduction {
  pcGdTotal: number   // 排产工单数
  gdPg: number          // 工单派工数
  rate: number          // 达成率
  gdRate: number       // 工单达成率
  pg: number           // 派工数
  gdDone: number     // 工单报工数
  pcTotal: number  // 排产数
  done: number         // 报工数
  undone: number     // 未报工数
}

export const getTodayProduction = (prodLine) => {
  return request({
    url: '/stampingWelding/todayProduction',
    method: 'get',
    params: { prodLine }
  })
}


// /apollo/stampingWelding
export const getApolloStampingWelding = (prodLine) => {
  return request({
    url: '/stampingWelding/todayInspection',
    method: 'get',
    params: { prodLine }
  })
}
// "checkTotal": 9,
// "firstHgTotal": 8,
// "passPercent": "88.9%"
export interface ApolloStampingWelding {
  checkTotal: number
  firstHgTotal: number
  passPercent: string
  toBeInspected: number
}
// /stampingWelding/todayWeldingProduction
// export const getTodayWeldingProduction = (prodLine) => {
//   return request({
//     url: '/stampingWelding/todayWeldingProduction',
//     method: 'get',
//     params: { prodLine }
//   })
// }

// /stampingWelding/warningNextDay?prodLine=1003
export const getWarningNextDay = (prodLine) =>{
  return request({
    url:'/stampingWelding/warningNextDay',
    method: 'get',
    params: { prodLine}
  })
}


// /stampingWelding/stampingPgAbnormal
export const getStampingPgAbnormal = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingPgAbnormal',
    method: 'get',
    params: { prodLine }
  })
}


export const getStampingGeneralData = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingGeneralData',
    method: 'get',
    params: { prodLine }
  })
}
// /stampingWelding/stampingBgAbnormal
export const getStampingBgAbnormal = (prodLine) => {
  return request({
    url: '/stampingWelding/stampingBgAbnormal',
    method: 'get',
    params: { prodLine }
  })
}

// /apollo/incoming/selectSalesIssueAmt
export const getSelectSalesIssueAmt = () => {
  return request({
    url: '/incoming/selectSalesIssueAmt',
    method: 'post',
  })
}


// /stampingWelding/stampingMachineData
export const getStampingMachineData = (prodLine,type) => {
  return request({
    url: '/stampingWelding/stampingMachineData',
    method: 'get',
    params: { prodLine,type }
  })
}


// /stampingWelding/addProcesshum  /apollo/stampingWelding/addProcesshum 填写工序完成数量
export const addProcesshum = (mo_routing_d_id ,num) => {
  return request({
    url: '/stampingWelding/addProcessNum',
    method: 'get',
    params: { mo_routing_d_id ,num },

  })
} 

// 焊接补焊API接口
export const addWeldingRepair = (workNo: string, productId: string, num: number) => {
  return request({
    url: '/stampingWelding/repairWelding',
    method: 'get',
    params: { workNo, productId, num }
  })
} 