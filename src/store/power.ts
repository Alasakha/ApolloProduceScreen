import { defineStore } from 'pinia';

export const usePowerStore = defineStore('power', {
  state: () => ({
    totalStandardPower: 0
  }),
  actions: {
    setTotalPower(val: number) {
      this.totalStandardPower = val;
    }
  }
});