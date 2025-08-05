import { defineStore } from 'pinia';
import { getElectricPower } from '@/api/enery';

export const usePowerStore = defineStore('power', {
  state: () => ({
    allData: [] as any[],
    electricList: [] as any[],
    waterList: [] as any[],
    gasList: [] as any[],
  }),

  getters: {
    totalStandardPower(): number {
      return this.electricList.reduce((sum, item) => sum + Number(item.standardPower || 0), 0);
    }
  },

  actions: {
    async fetchPowerData() {
      try {
        const today = new Date().toISOString().split('T')[0]; // 生成今日日期 YYYY-MM-DD
        const res = await getElectricPower(today);
        if (res.code === 200 && Array.isArray(res.data)) {
          this.setPowerData(res.data);
        } else {
          console.warn('获取能耗数据失败：', res.message);
        }
      } catch (err) {
        console.error('接口异常：', err);
      }
    },

    setPowerData(data: any[]) {
      this.allData = data;

      // 分类初始化
      this.electricList = [];
      this.waterList = [];
      this.gasList = [];

      data.forEach(item => {
        const code = item.machCode;
        if (code === '000025061899') {
          this.gasList.push(item);
        } else if (code === '82522504270042' || code === '82522505130023') {
          this.waterList.push(item);
        } else {
          this.electricList.push(item);
        }
      });
    }
  }
});