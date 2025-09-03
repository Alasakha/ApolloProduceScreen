import request from '../utils/request'

// 设备管理
export const getElectricPower = () => {
    return request({
        url: '/central/equipment',
        method: 'post',
      })
}
export type Equipment = {
    workcenter: string; //部门/单位
    equipment: number; //关健工序设备数量
    cnc: number; //关键数控设备数量
}
export type EquipmentResponse = {
    code: number;
    message: string;
    data: Equipment[];
}



// /central/sales
export const getSales = () => {
    return request({
        url: '/central/sales',
        method: 'post',
      })
}
export type Sales = {
    exportingCountry: string; //出口国家
    ysChallengeYear: number; //年度出口目标
    bgCountYear: number; //年度出口数量
    bgCountMonth: number; //月度出口数量
}
export type SalesResponse = {
    code: number;
    message: string;
    data: Sales;  // 改为单个对象，不是数组
}



// /central/energy
export const getEnergy = () => {
    return request({
        url: '/central/energy',
        method: 'post',
      })
}
export type Energy = {
    gas: number; //耗气量
    water: number; //耗水量
    electricity: number; //耗电量
}



// /central/rd 研发模块
export const getRd = () => {
    return request({
        url: '/central/rd',
        method: 'post',
      })
}
export type Rd = {
    total: string; //专利总数
    jw: string; //境外专利
    fm: string; //发明专利
    wg: string; //外观专利
    sy: string; //实用新型专利
    yf: string; //研发
}