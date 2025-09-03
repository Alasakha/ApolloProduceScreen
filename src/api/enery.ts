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