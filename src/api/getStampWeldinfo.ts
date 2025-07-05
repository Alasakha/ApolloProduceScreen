import request from '../utils/request'

export interface TodayProduction {
  rate: number
  pcTotal: number
  done: number
  undone: string
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
}
// /stampingWelding/todayWeldingProduction
// export const getTodayWeldingProduction = (prodLine) => {
//   return request({
//     url: '/stampingWelding/todayWeldingProduction',
//     method: 'get',
//     params: { prodLine }
//   })
// }