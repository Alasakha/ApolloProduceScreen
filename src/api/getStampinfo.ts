import request from '@/utils/request'

// 生产异常饼图
export const getAbnormalPieChart = (prodLine: string) => {
  return request({
    url: '/stampingWelding/abnormalPieChart',
    method: 'get',
    params: { prodLine }
  })
}

// 设备信息（设备总数+已点检数+点检率）
export const getEquipmentInfo = (prodLine: string) => {
  return request({
    url: '/stampingWelding/equipment',
    method: 'get',
    params: { prodLine }
  })
}

// 本月生产数据（本月总排产+本月已生产+本月产量达成率）
export const getMonthProduction = (prodLine: string) => {
  return request({
    url: '/stampingWelding/monthProduction',
    method: 'get',
    params: { prodLine }
  })
}

// 合格率趋势
export const getQualificationRateTrend = (prodLine: string) => {
  return request({
    url: '/stampingWelding/qualificationRateTrend',
    method: 'get',
    params: { prodLine }
  })
}

// 今日不良TOP5问题
export const getTodayBadIssues = (prodLine: string) => {
  return request({
    url: '/stampingWelding/todayBadIssues',
    method: 'get',
    params: { prodLine }
  })
}

// 今日不良TOP5责任
export const getTodayBadResponsibility = (prodLine: string) => {
  return request({
    url: '/stampingWelding/todayBadResponsibility',
    method: 'get',
    params: { prodLine }
  })
}

// 今日检验数据（今日检验数+今日合格数+合格率）
export const getTodayInspection = (prodLine: string) => {
  return request({
    url: '/stampingWelding/todayInspection',
    method: 'get',
    params: { prodLine }
  })
}

// 今日生产数据（今日总排产+今日已生产+今日待生产+今日产量达成率）
export const getTodayProduction = (prodLine: string) => {
  return request({
    url: '/stampingWelding/todayProduction',
    method: 'get',
    params: { prodLine }
  })
}

// 定义接口返回数据类型
export interface AbnormalPieChartData {
  name: string
  value: number
}

export interface EquipmentInfo {
    total: number   //总设备数
    rate: number   //点检率
    checked: number  //已点检数
  }

export interface MonthProduction {
    rate: number,  //达成率
    pcTotal: number,  //本月总排产数
    done: number,  //本月已生产数
    undone: number  //本月待生产数
}


// "data": {
//     "05-29": "-67.7%",
//     "06-02": "0.00%",
//     "06-01": "100.0%",
//     "05-30": "-9.8%",
//     "05-31": "0.00%"
//   }
export interface QualificationRateTrend {
    [date: string]: string  // 键是日期字符串，值是百分比字符串 
  }

export interface BadIssue {
    ngName: string,
    total: number,
}

export interface BadResponsibility {
    md002: string
    total: number
}

export interface TodayInspection {
    checkTotal: number //今日检验
    firstHgTotal: number //今日合格
    passPercent: string //合格率
}

export interface TodayProduction {
    rate    : number //今日产量达成率
    pcTotal: number //今日总排产
    done: number //今日已生产
    undone: string  //今日待生产
}


