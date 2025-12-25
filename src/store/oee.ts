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
        rate: item.operation > 0 ? toPercent(item.operation) : 'NA'
      })),

    // OEE 滚动列表（oee 字段，0/NaN 显示 NAN）
    oeeList: (state) =>
      state.raw.map(item => ({
        name: item.mac_name || item.mac_no,
        oee: item.oee > 0 ? toPercent(item.oee) : 'NA'
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
    async fetchOee(workshop?: string) {
      this.loading = true
      this.error = ''
      try {
        const res = await getMachineOee(workshop)
        if (res.code === 200) {
          // 支持两种返回格式：1) 数组；2) 对象按车间分组
          if (Array.isArray(res.data)) {
            this.raw = res.data
          } else if (res.data && typeof res.data === 'object') {
            // 如果传了 workshop，取对应 key，否则合并所有车间为一个数组
            if (workshop && Array.isArray((res.data as any)[workshop])) {
              this.raw = (res.data as any)[workshop]
            } else {
              // 合并所有车间数组
              const merged: OeeItem[] = []
              Object.values(res.data).forEach((v: any) => {
                if (Array.isArray(v)) merged.push(...v)
              })
              this.raw = merged
            }
          } else {
            this.raw = []
            this.error = res.message || '获取 OEE 数据失败'
          }
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

