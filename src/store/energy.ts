import { defineStore } from 'pinia';
import { getElectricPower } from '@/api/enery';
import type { EnergyData } from '@/types/energy';
import { EnergyType, MACHINE_CODES, ELECTRIC_METER_CONFIG } from '@/types/energy';

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    rawData: [] as EnergyData[], // 保持兼容性，主要用于当前数据
    dailyData: [] as EnergyData[], // 当日数据
    monthlyData: [] as EnergyData[], // 当月数据
    lastDailyFetch: '', // 最后获取当日数据的日期
    lastMonthlyFetch: '', // 最后获取当月数据的日期
    isRetrying: false, // 是否正在重试
    retryCount: 0, // 当前重试次数
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

    // 获取所有已配置的电表数据（包括未返回的）- 兼容性保持
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
    },

    // 获取当日电表数据
    dailyElectricData(): EnergyData[] {
      const existingData = this.dailyData.filter(item => MACHINE_CODES.ELECTRIC.includes(item.machCode));
      const dataMap = new Map(existingData.map(item => [item.machCode, item]));
      
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
    },

    // 获取当月电表数据
    monthlyElectricData(): EnergyData[] {
      const existingData = this.monthlyData.filter(item => MACHINE_CODES.ELECTRIC.includes(item.machCode));
      const dataMap = new Map(existingData.map(item => [item.machCode, item]));
      
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
    },

    // 获取当日水表数据
    dailyWaterData(): EnergyData[] {
      return this.dailyData.filter(item => MACHINE_CODES.WATER.includes(item.machCode));
    },

    // 获取当月水表数据
    monthlyWaterData(): EnergyData[] {
      return this.monthlyData.filter(item => MACHINE_CODES.WATER.includes(item.machCode));
    }
  },

  actions: {
    // 延时函数
    async delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // 带重试机制的API调用核心方法
    async callApiWithRetry(
      apiCall: () => Promise<any>,
      maxRetries: number = 5,
      operation: string = 'API调用'
    ): Promise<any> {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          this.retryCount = attempt;
          this.isRetrying = attempt > 1;
          
          if (attempt > 1) {
            // 指数退避：第2次等1秒，第3次等2秒，第4次等4秒，第5次等8秒
            const delayMs = Math.pow(2, attempt - 2) * 1000;
            console.log(`🔄 ${operation} 第${attempt}次尝试，等待${delayMs}ms后重试...`);
            await this.delay(delayMs);
          } else {
            console.log(`🚀 ${operation} 第${attempt}次尝试...`);
          }

          const result = await apiCall();
          
          // 成功后重置状态
          this.isRetrying = false;
          this.retryCount = 0;
          
          if (attempt > 1) {
            console.log(`✅ ${operation} 在第${attempt}次尝试后成功！`);
          }
          
          return result;
          
        } catch (error: any) {
          lastError = error;
          const isServerError = error?.response?.status >= 500 || error?.code === 'NETWORK_ERROR';
          
          console.warn(`❌ ${operation} 第${attempt}次尝试失败:`, {
            attempt,
            error: error?.message || error,
            status: error?.response?.status,
            isServerError
          });
          
          // 如果不是服务器错误（非5xx），不进行重试
          if (!isServerError && attempt === 1) {
            console.error(`🚫 ${operation} 遇到非服务器错误，停止重试:`, error);
            break;
          }
          
          // 如果是最后一次尝试，不再重试
          if (attempt === maxRetries) {
            console.error(`🔥 ${operation} 在${maxRetries}次尝试后最终失败:`, lastError);
            break;
          }
        }
      }
      
      // 重置状态
      this.isRetrying = false;
      this.retryCount = 0;
      
      throw lastError || new Error(`${operation}在${maxRetries}次尝试后失败`);
    },

    // 获取能源数据 - 保持向后兼容（已添加重试机制）
    async fetchEnergyData(date: string) {
      try {
        console.log('⚠️  使用已弃用的fetchEnergyData方法，建议使用fetchDailyData或fetchMonthlyData');
        
        const res = await this.callApiWithRetry(
          () => getElectricPower(date),
          5,
          `获取能源数据(${date})`
        );
        
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
        console.error('接口异常（重试后仍失败）：', err);
        return false;
      }
    },

    // 获取当日数据（智能缓存 + 重试机制）
    async fetchDailyData(date: string) {
      // 如果已经有相同日期的数据，直接返回
      if (this.lastDailyFetch === date && this.dailyData.length > 0) {
        console.log('📦 使用缓存的当日数据:', date);
        return true;
      }

      try {
        const res = await this.callApiWithRetry(
          () => getElectricPower(date),
          5,
          `获取当日数据(${date})`
        );
        
        if (res.code === 200 && Array.isArray(res.data)) {
          this.dailyData = res.data;
          this.lastDailyFetch = date;
          this.rawData = res.data; // 保持兼容性
          console.log('✅ 当日数据获取成功，共', res.data.length, '条记录');
          return true;
        } else {
          console.warn('获取当日数据失败：', res.message);
          return false;
        }
      } catch (err) {
        console.error('获取当日数据异常（重试后仍失败）：', err);
        return false;
      }
    },

    // 获取当月数据（智能缓存 + 重试机制）
    async fetchMonthlyData(date: string) {
      // 如果已经有相同日期的数据，直接返回
      if (this.lastMonthlyFetch === date && this.monthlyData.length > 0) {
        console.log('📦 使用缓存的当月数据:', date);
        return true;
      }

      try {
        const res = await this.callApiWithRetry(
          () => getElectricPower(date),
          5,
          `获取当月数据(${date})`
        );
        
        if (res.code === 200 && Array.isArray(res.data)) {
          this.monthlyData = res.data;
          this.lastMonthlyFetch = date;
          console.log('✅ 当月数据获取成功，共', res.data.length, '条记录');
          return true;
        } else {
          console.warn('获取当月数据失败：', res.message);
          return false;
        }
      } catch (err) {
        console.error('获取当月数据异常（重试后仍失败）：', err);
        return false;
      }
    },

    // 初始化所有数据 - 在主组件中调用
    async initializeData() {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      
      console.log('🚀 初始化能源数据...');
      console.log('📅 当日日期:', todayStr);
      console.log('📅 当月第一天:', firstDayOfMonth);
      
      // 并行获取当日和当月数据
      const [dailyResult, monthlyResult] = await Promise.all([
        this.fetchDailyData(todayStr),
        this.fetchMonthlyData(firstDayOfMonth)
      ]);
      
      console.log('✅ 数据初始化完成 - 当日:', dailyResult, '当月:', monthlyResult);
      return dailyResult && monthlyResult;
    }
  }
});