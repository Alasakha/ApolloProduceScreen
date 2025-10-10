import request from '../utils/request'


// /energy/electricPower 当日当月耗电水气量
export const getElectricPower = (monthDay) => {
    return request({
        url: '/energy/electricPower',
        method: 'get',
        params: {
            monthDay
        }
      })
}

// /energy/gasPower
export const getGasPower = (monthDay) => {
    return request({
        url: '/energy/gasPower',
        method: 'get',
        params: {
            monthDay
        }
  
      })
}

//获取本年数据(暂取去年八月份) electricPowerYear 
export const getElectricPowerYear = () => {
    return request({
        url: '/energy/electricPowerYear',
        method: 'get',
      })
}


// electricStandard 每月标准用电量
export const getElectricStandard = () => {
    return request({
        url: '/energy/electricStandard',
        method: 'get',
      })
}

// /energy/electricCompare 年度电力对比数据
export const getElectricCompare = () => {
    return request({
        url: '/energy/electricCompare',
        method: 'get',
      })
}


// /energy/sixWeekGasWater 近六周能耗柱状图(气，水 82522504270042：水参数 000025061803：气参数 )
export const getSixWeekGasWater = (machCode) => {
    return request({
        url: '/energy/sixWeekGasWater',
        method: 'get',
        params: {
            machCode
        }
      })
}
// 近六周能耗柱状图（气/水）数据的 TypeScript 类型定义
export interface SixWeekGasWaterItem {
  year: string;                // 年份
  week_num: number;            // 周数
  week_start: string;          // 周开始日期
  week_end: string;            // 周结束日期
  week_start_number: number;   // 周开始数值
  week_end_number: number;     // 周结束数值
  weekly_increment: number;    // 本周增量
}

export interface SixWeekGasWaterResponse {
  code: number;
  message: string;
  data: SixWeekGasWaterItem[];
}
    
// /energy/sixWeekElectric 近六周电能耗柱状图
export const getSixWeekElectric = () => {
    return request({
        url: '/energy/sixWeekElectric',
        method: 'get',

      })
}
export interface SixWeekElectricItem {
    year: string;                // 年份
    week_num: number;            // 周数
    week_start: string;          // 周开始日期
    week_end: string;            // 周结束日期
    week_start_number: number;   // 周开始数值
    week_end_number: number;     // 周结束数值
    weekly_increment: number;    // 本周增量
  } 

  export interface SixWeekElectricResponse {
    code: number;
    message: string;
    data: SixWeekElectricItem[];
  }