export interface EnergyData {
  monthDay: string;
  number: string;
  machCode: string;
  machName: string;
  tipNumber: string;
  peakNumber: string;
  flatNumber: string;
  valleyNumber: string;
  numberPower: number;
  doneMonth?: number; // 月产量
  doneDay?: number;   // 日产量
  cl?: number;        // 台数参数
  workshopName?: string; // 车间名称
  reason?: string;    // 超过原因
  standardConsumption?: number; // 标准用电量
  actualConsumption?: number;   // 实际用电量
  airCompressorAllocation?: string; // 空压机月度分摊值
}

export enum EnergyType {
  ELECTRIC = 'electric',
  WATER = 'water',
  GAS = 'gas'
}

export enum DateType {
  TODAY = 'today',
  MONTH = 'month'
}

// Remove 'as const' and use string arrays
export const MACHINE_CODES = {
  GAS: ['000025061899'] as string[],
  WATER: ['82522504270042'] as string[],
  ELECTRIC: [
    '616506210001',  // 序号1: 空压机
    '616506210002',  // 序号2: 注塑
    '616506210007',  // 序号3: 冲压
    '616506210003',  // 序号4: 焊接
    '616506210010',  // 序号5: 总装一课装配
    '616506210009',  // 序号6: 总装一课包装
    '616506210005',  // 序号7: 总装二课
    '616506210004',  // 序号8: 金工二部一楼
    '616506210006',  // 序号9: 金工二部四楼
    // '616506210008'   // 序号10: 宿舍
  ] as string[]
};


export const ELECTRIC_METER_CONFIG: Record<string, { name: string, colors: [string, string] }> = {
  '616506210001': { name: '空压机', colors: ['#00ff9f', '#00eeff'] },          // 序号1
  '616506210002': { name: '注塑', colors: ['#00eeff', '#0066ff'] },            // 序号2
  '616506210007': { name: '冲压', colors: ['#ff9f00', '#ff0000'] },            // 序号3
  '616506210003': { name: '焊接', colors: ['#00eeff', '#0066ff'] },            // 序号4
  '616506210010': { name: '总装一课装配', colors: ['#00eeff', '#0066ff'] },     // 序号5
  '616506210009': { name: '总装一课包装', colors: ['#ff9f00', '#ff0000'] },     // 序号6
  '616506210005': { name: '总装二课', colors: ['#00ff9f', '#00eeff'] },        // 序号7
  '616506210004': { name: '金工二部一楼', colors: ['#00ff9f', '#00eeff'] },     // 序号8
  '616506210006': { name: '金工二部四楼', colors: ['#00eeff', '#0066ff'] },     // 序号9
  '616506210008': { name: '宿舍', colors: ['#ff9f00', '#ff0000'] }             // 序号10
};