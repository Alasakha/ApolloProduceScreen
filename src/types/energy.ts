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
    '616506210006',
    '616506210004',
    '616506210007',
    '616506210003',
    '616506210001',
    '616506210008',
    '616506210002',
    '616506210005',
    '616506210009',
    '616506210010'
  ] as string[]
};

export const ELECTRIC_METER_CONFIG: Record<string, { name: string, colors: [string, string] }> = {
  '616506210006': { name: '金工二部四楼', colors: ['#00eeff', '#0066ff'] },
  '616506210004': { name: '金工二部一楼', colors: ['#00ff9f', '#00eeff'] },
  '616506210007': { name: '金工一部冲压', colors: ['#ff9f00', '#ff0000'] },
  '616506210003': { name: '金工一部焊接', colors: ['#00eeff', '#0066ff'] },
  '616506210001': { name: '空压机', colors: ['#00ff9f', '#00eeff'] },
  '616506210008': { name: '宿舍', colors: ['#ff9f00', '#ff0000'] },
  '616506210002': { name: '注塑', colors: ['#00eeff', '#0066ff'] },
  '616506210005': { name: '总装二课', colors: ['#00ff9f', '#00eeff'] },
  '616506210009': { name: '总装一课包装', colors: ['#ff9f00', '#ff0000'] },
  '616506210010': { name: '总装一课装配', colors: ['#00eeff', '#0066ff'] }
};