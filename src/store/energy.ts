import { defineStore } from 'pinia';
import { getElectricPower,getElectricPowerYear,getGasPower, getElectricStandard } from '@/api/enery';
import type { EnergyData } from '@/types/energy';
import { EnergyType, MACHINE_CODES, ELECTRIC_METER_CONFIG } from '@/types/energy';

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    rawData: [] as EnergyData[], // 保持兼容性，主要用于当前数据
    dailyData: [] as EnergyData[], // 当日数据
    monthlyData: [] as EnergyData[], // 当月数据
    yearlyData: [] as EnergyData[], // 当年数据
    lastDailyFetch: '', // 最后获取当日数据的日期
    lastMonthlyFetch: '', // 最后获取当月数据的日期
    isRetrying: false, // 是否正在重试
    retryCount: 0, // 当前重试次数
    averageMonGasPower: 0, // 平均每台月气量
    averageDaGasPower: 0, // 平均每台日气量
    // 新增：产量数据
    dailyProduction: 0, // 当日产量
    monthlyProduction: 0, // 当月产量
    lastProductionFetch: '', // 最后获取产量数据的日期
    // 新增：月标准用电量数据
    monthlyStandardData: [] as EnergyData[], // 月标准用电量数据
    lastStandardFetch: '', // 最后获取标准数据的日期
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
    },

    // 获取当日气表数据
    dailyGasData(): EnergyData[] {
      return this.dailyData.filter(item => MACHINE_CODES.GAS.includes(item.machCode));
    },

    // 获取当月气表数据
    monthlyGasData(): EnergyData[] {
      return this.monthlyData.filter(item => MACHINE_CODES.GAS.includes(item.machCode));
    },

    // 获取平均每台日气量
    getAverageDailyGasPower(): number {
      return this.averageDaGasPower;
    },

    // 获取平均每台月气量
    getAverageMonthlyGasPower(): number {
      return this.averageMonGasPower;
    },

    // 获取当日产量
    getDailyProduction(): number {
      return this.dailyProduction;
    },

    // 获取当月产量
    getMonthlyProduction(): number {
      return this.monthlyProduction;
    },

    // 获取当年数据
    getYearlyData(): EnergyData[] {
      return this.yearlyData;
    },

    // 获取月标准用电量数据
    getMonthlyStandardData(): EnergyData[] {
      return this.monthlyStandardData;
    },

    // 获取最后获取标准数据的日期
    getLastStandardFetch(): string {
      return this.lastStandardFetch;
    }
  },

  actions: {
    // 延时函数
    async delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // 获取产量数据（从getGasPower接口）
    async fetchProductionData(date: string) {
      // 如果已经有相同日期的产量数据，直接返回
      if (this.lastProductionFetch === date && (this.dailyProduction > 0 || this.monthlyProduction > 0)) {
        console.log('📦 使用缓存的产量数据:', date);
        return true;
      }

      try {
        const res = await this.callApiWithRetry(
          () => getGasPower(date),
          5,
          `获取产量数据(${date})`
        );
        
        if (res.code === 200 && res.data) {
          // 根据日期判断是当日还是当月数据
          const isToday = date === new Date().toISOString().split('T')[0];
          
          if (isToday) {
            this.dailyProduction = Number(res.data.doneDay) || 0;
            this.monthlyProduction = Number(res.data.doneMonth) || 0;
            console.log('✅ 当日产量数据获取成功:', this.dailyProduction);
          } else {
           
          }
          
          this.lastProductionFetch = date;
          return true;
        } else {
          console.warn('获取产量数据失败：', res.message);
          return false;
        }
      } catch (err) {
        console.error('获取产量数据异常（重试后仍失败）：', err);
        return false;
      }
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

    // 计算平均每台日气量（气量来自getElectricPower，产量来自getGasPower）
    calculateDailyGasAverage() {
      try {
        console.log('🔥 计算当日气表平均值...');
        
        // 从当日数据中查找气表数据（气量）
        const gasData = this.dailyData.find(item => MACHINE_CODES.GAS.includes(item.machCode));
        
        if (gasData && this.dailyProduction > 0) {
          this.averageDaGasPower = Number(gasData.numberPower) / this.dailyProduction;
          console.log(`📊 平均每台日气量: ${this.averageDaGasPower.toFixed(2)} (气量: ${gasData.numberPower}, 日产量: ${this.dailyProduction})`);
          return true;
        } else {
          console.warn('⚠️ 当日气表数据或产量数据无效，无法计算平均每台日气量');
          this.averageDaGasPower = 0;
          return false;
        }
      } catch (err) {
        console.error('计算当日气表平均值异常：', err);
        this.averageDaGasPower = 0;
        return false;
      }
    },

    // 计算平均每台月气量（气量来自getElectricPower，产量来自getGasPower）
    calculateMonthlyGasAverage() {
      try {
        console.log('🔥 计算当月气表平均值...');
        
        // 从当月数据中查找气表数据（气量）
        const gasData = this.monthlyData.find(item => MACHINE_CODES.GAS.includes(item.machCode));
        
        if (gasData && this.monthlyProduction > 0) {
          this.averageMonGasPower = Number(gasData.numberPower) / this.monthlyProduction;
          console.log(`📊 平均每台月气量: ${this.averageMonGasPower.toFixed(2)} (气量: ${gasData.numberPower}, 月产量: ${this.monthlyProduction})`);
          return true;
        } else {
          console.warn('⚠️ 当月气表数据或产量数据无效，无法计算平均每台月气量');
          this.averageMonGasPower = 0;
          return false;
        }
      } catch (err) {
        console.error('计算当月气表平均值异常：', err);
        this.averageMonGasPower = 0;
        return false;
      }
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

    // 获取月标准用电量数据（智能缓存 + 重试机制）
    async fetchMonthlyStandardData() {
      // 如果已经有标准数据，直接返回
      if (this.monthlyStandardData.length > 0) {
        console.log('📦 使用缓存的月标准用电量数据');
        return true;
      }

      try {
        const res = await this.callApiWithRetry(
          () => getElectricStandard(),
          5,
          '获取月标准用电量数据'
        );
        
        if (res.code === 200 && Array.isArray(res.data)) {
          this.monthlyStandardData = res.data;
          this.lastStandardFetch = new Date().toISOString().split('T')[0];
          console.log('✅ 月标准用电量数据获取成功，共', res.data.length, '条记录');
          return true;
        } else {
          console.warn('获取月标准用电量数据失败：', res.message);
          return false;
        }
      } catch (err) {
        console.error('获取月标准用电量数据异常（重试后仍失败）：', err);
        return false;
      }
    },

    // 初始化所有数据 - 在主组件中调用
    async initializeData() {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
     
      // 并行获取当日和当月数据
      const [dailyResult, monthlyResult] = await Promise.all([
        this.fetchDailyData(todayStr),
        this.fetchMonthlyData(firstDayOfMonth)
      ]);
      
      // 获取产量数据
      const productionResult = await this.fetchProductionData(todayStr);
      
             // 获取月标准用电量数据
       const standardResult = await this.fetchMonthlyStandardData();
      
      // 计算气表平均值
      if (dailyResult && productionResult) {
        this.calculateDailyGasAverage();
      }
      if (monthlyResult && productionResult) {
        this.calculateMonthlyGasAverage();
      }
      
      console.log('✅ 数据初始化完成 - 当日:', dailyResult, '当月:', monthlyResult, '产量:', productionResult, '标准:', standardResult);
      return dailyResult && monthlyResult && productionResult && standardResult;
    },

    // 测试气表数据计算（用于调试）
    testGasCalculation() {

      
      // 查找气表数据
      const dailyGasData = this.dailyData.find(item => MACHINE_CODES.GAS.includes(item.machCode));
      const monthlyGasData = this.monthlyData.find(item => MACHINE_CODES.GAS.includes(item.machCode));
      
      if (dailyGasData) {
        console.log('  - 当日气表数据:', dailyGasData);
        if (this.dailyProduction > 0) {
          const avgDaily = Number(dailyGasData.numberPower) / this.dailyProduction;
          console.log(`  - 计算平均每台日气量: ${dailyGasData.numberPower} ÷ ${this.dailyProduction} = ${avgDaily.toFixed(2)}`);
        }
      }
      
      if (monthlyGasData) {
        console.log('  - 当月气表数据:', monthlyGasData);
        if (this.monthlyProduction > 0) {
          const avgMonthly = Number(monthlyGasData.numberPower) / this.monthlyProduction;
          console.log(`  - 计算平均每台月气量: ${monthlyGasData.numberPower} ÷ ${this.monthlyProduction} = ${avgMonthly.toFixed(2)}`);
        }
      }
      
      // 手动触发计算
      console.log('🔄 手动触发计算...');
      this.calculateDailyGasAverage();
      this.calculateMonthlyGasAverage();
    },
    

    async fetchYearlyData(){
      const res = await getElectricPowerYear();
      if (res.code === 200 && Array.isArray(res.data)) {
        this.yearlyData = res.data;
      }
    }
  }
});