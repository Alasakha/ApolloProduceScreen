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
export const getAbnormalDetail = (prodLine, reasonType, ngName, peopleName, admin_unit_name, ngNo, dayType) => {
  const params = { reasonType };
  if (prodLine) params.prodLine = prodLine;
  if (ngName) params.ngName = ngName;
  if (peopleName) params.peopleName = peopleName;
  if (admin_unit_name) params.admin_unit_name = admin_unit_name;
  if (ngNo) params.ngNo = ngNo;
  if (dayType !== undefined) params.dayType = dayType;
  return request({
    url: '/quality/abnormalDetail',
    method: 'get',
    params
  });
};

// 今日功性能不良
export const getAtopDayInspector = (reasonType,dayType ) => {
  return request({
    url: '/quality/topDayInspector',
    method: 'get',
    params: { reasonType,dayType } // 传递 prodLine 参数
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
// export const getMistakesAndOmissions = (prodLine ) => {
//   return request({
//     url: '/quality/mistakesAndOmissions',
//     method: 'get',
//     params: { prodLine } // 传递 prodLine 参数
//   })
// }  

// /quality/abnormalHandleAdd
export const getAbnormalHandleAdd = (uid,ngHandle,ngReason ) => {
  return request({
    url: '/quality/abnormalHandleAdd',
    method: 'get',
    params: { uid,ngHandle,ngReason  } // 传递 prodLine 参数
  })
}  

// /production/complaintPie
export const getComplaintPie = () => {
  return request({
    url: '/production/complaintPie',
    method: 'get',
  })
}
// /production/complaint
export const getComplaint = (documentName ,close) => {
  return request({
    url: '/production/complaint',
    method: 'get',
    params: { documentName,close }
  })
}

// /production/complaintPie2
export const getComplaintPie2 = () => {
  return request({
    url: '/production/complaintPie2',
    method: 'get',
  })
}


// /quality/checkOutTimePie
export const getCheckOutTimePie = (type ) => {
  return request({
    url: '/quality/checkOutTimePie',
    method: 'get',
    params: { type }
  })
}
// /quality/checkOutTime
export const getCheckOutTime = (type,peopleName  ) => {
  return request({
    url: '/quality/checkOutTime',
    method: 'get',
    params: { type,peopleName }
  })
}
// /apollo/quality/mistakesAnd0missionsPie
export const getMistakesAnd0missionsPie = (type ) => {
  return request({
    url: '/quality/mistakesAndOmissionsPie',
    method: 'get',
    params: { type }
  })
}
// /quality/mistakesAndOmissions
export const getMistakesAndOmissions = (udf04 ) => {
  return request({
    url: '/quality/mistakesAndOmissions',
    method: 'get',
    params: { udf04 }
  })
}

// /quality/qualityCheck
export const getQualityCheck = (params ) => {
  return request({
    url: '/quality/qualityCheck',
    method: 'post',
    params: params,
    data: ''
  })
}
// /quality/qualityCheckPie
export const getQualityCheckPie = (params ) => {
  return request({
    url: '/quality/qualityCheckPie',
    method: 'post',
    params: params,
    data: ''
  })
}

export const getServiceRequest = (documentName,hasAccessory,isCrossBorder, customer_name) =>{
  return request({
    url: '/quality/serviceRequest',
    method: 'get',
    params: { documentName,hasAccessory,isCrossBorder, customer_name }
  })
}

// /quality/serviceRequestDetail
export const getServiceRequestDetail = (documentName,hasAccessory,isCrossBorder, customer_name ) => {
  return request({
    url: '/quality/serviceRequestDetail',
    method: 'get',
    params: { documentName,hasAccessory,isCrossBorder, customer_name }
  })
}

// /quality/serviceRequestReasonAdd
export const getServiceRequestReasonAdd = (type ,reason ,solve ) => {
  return request({
    url: '/quality/serviceRequestReasonAdd',
    method: 'get',
    params: { type ,reason ,solve }
  })
}
// d j i c

// /quality/serviceRequestReason
export const getServiceRequestReason = (type ) => {
  return request({
    url: '/quality/serviceRequestReason',
    method: 'get',
    params: { type }
  })
}

// /apollo/quality/afterServicePie
export const getAfterServicePie = ( ) => {
  return request({
    url: '/quality/afterServicePie',
    method: 'get',
  })
}

// /quality/afterService
export const getAfterService = (breakdown_id,customer_code,feature_d_id  ) => {
  return request({
    url: '/quality/afterService',
    method: 'get',
    params:{breakdown_id,customer_code,feature_d_id}
  })
}

// /quality/afterServiceCustomerPie
export const getAfterServiceCustomerPie = ( ) => {
  return request({
    url: '/quality/afterServiceCustomerPie',
    method: 'get',
  })
}

// /quality/afterServiceCxPie
export const getAfterServiceCxPie = ( ) => {
  return request({
    url: '/quality/afterServiceCxPie',
    method: 'get',
  })
}