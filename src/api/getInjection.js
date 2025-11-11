
import request from '../utils/request'

//注塑
export const getProductPlanCompleteRate = () => {
  return request({
    url: '/injection/planAchievementRate',
    method: 'get',
  })
}

export const getProductPassRate = () => {
  return request({
    url: '/injection/FTQ',
    method: 'get',
  })
}

export const getBadCategory = () => {
  return request({
    url: '/injection/failure',
    method: 'get',
  })
}

export const getDeviceStatus = () => {
  return request({
    url: '/injection/deviceStatus',
    method: 'get',
  })
}

export const getabnormalInfo = () => {
  return request({
    url: '/injection/abnormal',
    method: 'get',
  })
}

export const getMaintanceInfo = () => {
  return request({
    url: '/injection/maintenance',
    method: 'get',
  })
}


// /planAchievementRateToday
// 生产计划达成率
// 改为:每台机，当日排产数、已完成数、达成率
export const getplanAchievementRateToday = () => {
  return request({
    url: '/injection/planAchievementRateToday',
    method: 'get',
  })
}

export const getInvokeDeviceList = () => {
  return request({
    url: '/injection/invokeDeviceList',
    method: 'get',
  })
}

export const getrawMaterialMonitoring = () => {
  return request({
    url: '/injection/rawMaterialMonitoring',
    method: 'get',
  })
}

// /injection/rawMaterialMonitoringAdd
export const getRawMaterialMonitoringAdd =(zhsCode,reason ) =>{
  return request({
    url: '/injection/rawMaterialMonitoringAdd',
    method: 'get',
    params:{zhsCode,reason}
  })
}



export const getElectricToday =() =>{
  return request({
    url: '/injection/electricToday',
    method: 'get',
  })
}

export const getElectricStandard =() =>{
  return request({
    url: '/injection/electricStandard',
    method: 'get',
  })
}

// injection/planDetail 注塑详细
export const getplanDetail =(zhsCode ) =>{
  return request({
    url: '/injection/planDetail',
    method: 'get',
    params:{zhsCode}
  })
}
// {
//   "ty009": "102050101002        ",
//   "ty001": "5103",
//   "ty002": "250718005",
//   "ty004": 100,
//   "item_no": "304075002001",
//   "item_name": "链条罩_黑色",
//   "qty": 100
// },
// ty009：品号 ty001+ty002：客户单号 ty004:总数 qty: 完成数  item_name:品名

// /injection/doneDetail
export const getDoneDetail = (zhsCode) => {
  return request({
    url: '/injection/doneDetail',
    method: 'get',
    params: { zhsCode },
  })
}

// 注塑产品自检质量
export const getSelfCheck = () => {
  return request({
    url: '/injection/selfCheck',
    method: 'get',
  })
}


// /rawMaterialMonitoring2
export const getRawMaterialMonitoring2 = () => {
  return request({  
    url: '/injection/rawMaterialMonitoring2',
    method: 'get',
  })
}


// curl -X 'GET' \
//   'http://192.168.1.197:10999/apollo/injection/ngGdDetail?startDay=2025-11-01&endDay=2025-11-11' \
//   -H 'accept: */*'
// {
//   "code": 200,
//   "message": "操作成功",
//   "data": [
//     {
//       "ta001": "5103",
//       "ta002": "251018009   ",
//       "uid": "202511110824",
//       "mb002": "前保险杠装饰板_磨砂黑色",
//       "mb003": "AGA-18/250_共丙339g",
//       "ta015": 100,
//       "cjbhgNum": 1,
//       "plan_qty": 400,
//       "ngName": "毛刺",
//       "ngResponPeople": "测试",
//       "ngDutyType": "厂内"
//     }
//   ]
// }
export const getNgGdDetail = (startDay,endDay) => {
  return request({
    url: '/injection/ngGdDetail',
    method: 'get',
    params: { startDay,endDay }
  })
}

// curl -X 'GET' \
//   'http://192.168.1.197:10999/apollo/injection/monthCompleteGd' \
//   -H 'accept: */*'月入库工单,准时工单,今日计划工单数,已完结工单
// ·{
//   "code": 200,
//   "message": "操作成功",
//   "data": {
//     "totalGd": 239,
//     "jsGd": 224,
//     "todayTotalGd": 39,
//     "todayJsGd": 24
//   }
// }
export const getMonthCompleteGd = () => {
  return request({
    url: '/injection/monthCompleteGd',
    method: 'get',
  })
}


// curl -X 'GET' \
//   'http://192.168.1.197:10999/apollo/injection/todayPlanComplete' \
//   -H 'accept: */*'今日计划量,已完成量
// {
//   "code": 200,
//   "message": "操作成功",
//   "data": {
//     "complete": 1610,
//     "plan": 6070
//   }
// }
export const getTodayPlanComplete = () => {
  return request({
    url: '/injection/todayPlanComplete',
    method: 'get',
  })
}


// curl -X 'GET' \
//   'http://192.168.1.197:10999/apollo/injection/zhsProductMonitoring' \
//   -H 'accept: */*'今日检验工单数,合格工单数
// {
//   "code": 200,
//   "message": "操作成功",
//   "data": {
//     "inspectionDate": "2025-11-11",
//     "total": 18,
//     "hg": 17,
//     "ng": 1,
//     "rate": 94.4
//   }
// }
export const getZhsProductMonitoring = () => {
  return request({
    url: '/injection/zhsProductMonitoring',
    method: 'get',
  })
}