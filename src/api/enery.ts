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