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


// 每日责任类别
export const getResponsityRank = (prodLine, reasonType) => {
  return request({
    url: '/quality/topDayCategory',
    method: 'get',
    params: { prodLine, reasonType } // 传递 prodLine 和 reasonType 参数
  })
}

//每日责任部门排行
export const getResponsityDepartmentRank = (prodLine,reasonType) => {
  return request({
    url: '/quality/topDayDept',
    method: 'get', 
    params: { prodLine,reasonType } // 传递 prodLine 参数
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

//近五日合格率
export const getFivedayRate = (prodLine) => {
  return request({
    url: '/quality/passRateByCx',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}  

// 详细功性能详细内容
export const getAbnormalDetail = (prodLine,reasonType, ngName, peopleName,admin_unit_name) => {
  const params = { reasonType };
  if (prodLine) params.prodLine = prodLine;
  if (ngName) params.ngName = ngName;
  if (peopleName) params.peopleName = peopleName;
   if (admin_unit_name) params.admin_unit_name = admin_unit_name;
  return request({  
    url: '/quality/abnormalDetail',
    method: 'get',
    params
  });
};

// 今日功性能不良
export const getAtopDayInspector = (prodLine,reasonType ) => {
  return request({
    url: '/quality/topDayInspector',
    method: 'get',
    params: { prodLine,reasonType } // 传递 prodLine 参数
  })
}  

// 来料检验及时率
export const getIncomingInspection = (prodLine ) => {
  return request({
    url: '/quality/incomingInspection',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}  

export const getIncomingInspection2 = (prodLine ) => {
  return request({
    url: '/quality/incomingInspection2',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}  

//错漏检累计次数
export const getMistakesAndOmissions = (prodLine ) => {
  return request({
    url: '/quality/mistakesAndOmissions',
    method: 'get',
    params: { prodLine } // 传递 prodLine 参数
  })
}  
