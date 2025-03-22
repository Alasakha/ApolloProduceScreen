import request from '../utils/request'



export const getPaassedInfo = (prodLine) => {
  return request({
    url: '/quality/passData',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

export const getcumulativePassRate = (prodLine) => {
  return request({
    url: '/quality/cumulativePassRate',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// 产品合格率排行
export const getProductPassRateRank = (prodLine) => {
  return request({
    url: '/quality/passRanking',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

//每日责任类目排行
export const getResponsityRank = (prodLine) => {
  return request({
    url: '/quality/topDayCategory',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

//每日责任部门排行
export const getResponsityDepartmentRank = (prodLine) => {
  return request({
    url: '/quality/topDayDept',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}

// 每月责任部门类目排行
export const getResponsityDepartmentCategoryRank = (prodLine) => {
  return request({
    url: '/quality/topMonthDept',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}
//每月责任类目排行
export const getResponsityCategoryRank = (prodLine) => {
  return request({
    url: '/quality/topMonthCategory',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}
