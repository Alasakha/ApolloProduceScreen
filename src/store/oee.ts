import { defineStore } from 'pinia'
import { getMachineOee, type OeeItem } from '@/api/equipment'

const toPercent = (value: number) => Number((value * 100).toFixed(1))

export const useOeeStore = defineStore('oee', {
  state: () => ({
    raw: [] as OeeItem[],
    loading: false,
    error: ''
  }),

  getters: {
    // 稼动率列表（operation 字段，0/NaN 显示 NAN）
    operationList: (state) =>
      state.raw.map(item => ({
        name: item.mac_name || item.mac_no,
        rate: item.operation > 0 ? toPercent(item.operation) : 'NAN'
      })),

    // OEE 滚动列表（oee 字段，0/NaN 显示 NAN）
    oeeList: (state) =>
      state.raw.map(item => ({
        name: item.mac_name || item.mac_no,
        oee: item.oee > 0 ? toPercent(item.oee) : 'NAN'
      })),

    // OEE 平均值（仅统计 oee>0）
    avgOee: (state) => {
      const valid = state.raw.filter(item => item.oee > 0)
      if (!valid.length) return 0
      const avg = valid.reduce((sum, item) => sum + item.oee, 0) / valid.length
      return toPercent(avg)
    }
  },

  actions: {
    async fetchOee() {
      this.loading = true
      this.error = ''
      try {
        const res = await getMachineOee()
        if (res.code === 200 && Array.isArray(res.data)) {
          this.raw = res.data
        } else {
          this.raw = []
          this.error = res.message || '获取 OEE 数据失败'
        }
      } catch (err: any) {
        this.raw = []
        this.error = err?.message || '获取 OEE 数据异常'
      } finally {
        this.loading = false
      }
    }
  }
})

