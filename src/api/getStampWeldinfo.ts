
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