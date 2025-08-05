import { defineStore } from 'pinia';

export const useInjectionPowerStore = defineStore('injectionPower', {
  state: () => ({
    totalPower: 0,
    totalStandardPower: 0
  }),

  getters: {
    getTotalPower: (state) => state.totalPower,
    getTotalStandardPower: (state) => state.totalStandardPower
  },

  actions: {
    setTotalPower(value: number) {
      this.totalPower = value;
    },
    setTotalStandardPower(value: number) {
      this.totalStandardPower = value;
    }
  }
});