import { defineStore } from 'pinia';
import { getElectricPower } from '@/api/enery';
import type { EnergyData } from '@/types/energy';
import { EnergyType, MACHINE_CODES, ELECTRIC_METER_CONFIG } from '@/types/energy';

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    rawData: [] as EnergyData[],
  }),

  getters: {
    // 获取指定类型的数据
    getDataByType: (state) => (type: EnergyType) => {
      return state.rawData.filter(item => {
        switch (type) {
          case EnergyType.GAS:
            return MACHINE_CODES.GAS.includes(item.machCode);
          case EnergyType.WATER:
            return MACHINE_CODES.WATER.includes(item.machCode);
          case EnergyType.ELECTRIC:
            return MACHINE_CODES.ELECTRIC.includes(item.machCode);
          default:
            return false;
        }
      });
    },

    // 获取电表数据
    electricData(): EnergyData[] {
      return this.getDataByType(EnergyType.ELECTRIC);
    },

    // 获取水表数据
    waterData(): EnergyData[] {
      return this.getDataByType(EnergyType.WATER);
    },

    // 获取气表数据
    gasData(): EnergyData[] {
      return this.getDataByType(EnergyType.GAS);
    },

    // 获取所有已配置的电表数据（包括未返回的）
    allConfiguredElectricMeters(): EnergyData[] {
      const existingData = this.electricData;
      
      // 创建一个映射以快速查找现有数据
      const dataMap = new Map(existingData.map(item => [item.machCode, item]));
      
      // 确保所有配置的电表都有数据
      return MACHINE_CODES.ELECTRIC.map(code => {
        return dataMap.get(code) || {
          machCode: code,
          machName: code,
          numberPower: 0,
          monthDay: '',
          number: '0',
          tipNumber: '0',
          peakNumber: '0',
          flatNumber: '0',
          valleyNumber: '0'
        };
      });
    }
  },

  actions: {
    // 获取能源数据
    async fetchEnergyData(date: string) {
      try {
        const res = await getElectricPower(date);
        if (res.code === 200 && Array.isArray(res.data)) {
          this.rawData = res.data;
          
          // 检查是否所有配置的电表都有数据
          const receivedCodes = res.data
            .filter(item => MACHINE_CODES.ELECTRIC.includes(item.machCode))
            .map(item => item.machCode);
          
          const missingCodes = MACHINE_CODES.ELECTRIC.filter(code => !receivedCodes.includes(code));
          
          if (missingCodes.length > 0) {
            console.warn('以下电表没有返回数据：', missingCodes.map(code => ({
              code,
              name: ELECTRIC_METER_CONFIG[code]?.name || code
            })));
          }
          
          return true;
        } else {
          console.warn('获取能耗数据失败：', res.message);
          return false;
        }
      } catch (err) {
        console.error('接口异常：', err);
        return false;
      }
    },
  }
});