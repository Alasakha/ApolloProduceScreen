import { defineStore } from 'pinia'
import { getMachineOee, type WorkCenterOee, type MachineOeeItem } from '@/api/equipment'

const toPercent = (value: number | null | undefined) => {
  if (value == null || isNaN(value)) return 'NA'
  return Number((value * 100).toFixed(1))
}

export const useOeeStore = defineStore('oee', {
  state: () => ({
    // 新格式：车间数组
    workCenters: [] as WorkCenterOee[],
    // 兼容：展平后的单台设备列表
    raw: [] as MachineOeeItem[],
    loading: false,
    error: ''
  }),

  getters: {
    // 所有车间数据（原始结构）
    allWorkCenters: (state) => state.workCenters,

    // 展平后的单台设备列表（兼容旧逻辑）
    flatMachineList: (state) => state.raw,

    // 车间名称 → 设备列表 的映射（供 OEEScroll 使用）
    workshopMachineMap: (state) => {
      const map: Record<string, MachineOeeItem[]> = {}
      for (const wc of state.workCenters) {
        map[wc.work_center] = wc.machineOeeList
      }
      return map
    },

    // 车间下拉列表选项
    workshopOptions: (state) => state.workCenters.map(wc => wc.work_center),

    // OEE 滚动列表（单个车间的机器，百分比显示，0/null 显示 NA）
    oeeList: (state) => (workCenterName?: string) => {
      let list: MachineOeeItem[] = state.raw
      if (workCenterName) {
        const wc = state.workCenters.find(w => w.work_center === workCenterName)
        if (wc) list = wc.machineOeeList
      }
      return list.map(item => ({
        name: item.mac_name || item.mac_no,
        oee: item.oee != null && item.oee > 0 ? toPercent(item.oee) : 'NA'
      }))
    },

    // OEE 平均值（仅统计 oee > 0）
    avgOee: (state) => {
      const valid = state.raw.filter(item => item.oee != null && item.oee > 0)
      if (!valid.length) return 0
      const avg = valid.reduce((sum, item) => sum + (item.oee ?? 0), 0) / valid.length
      return toPercent(avg)
    },

    // 车间统计数据（供 OEEMonitor 直接使用）
    workshopStats: (state) =>
      state.workCenters.map(wc => ({
        name: wc.work_center,
        total: wc.total_count,
        meet: wc.complete_count,
        rate: Math.round(wc.complete_count_rate * 100),
        operationRate: Math.round(wc.operation_rate * 100),
        allOperation: wc.all_operation,
        targetOperation: wc.target_operation,
        machineOeeList: wc.machineOeeList
      }))
  },

  actions: {
    async fetchOee(workshop?: string) {
      this.loading = true
      this.error = ''
      try {
        const res = await getMachineOee(workshop)
        if (res.code === 200) {
          if (Array.isArray(res.data)) {
            this.workCenters = res.data
            // 展平所有车间的机器列表
            this.raw = res.data.flatMap(wc => wc.machineOeeList)
          } else {
            this.workCenters = []
            this.raw = []
          }
        } else {
          this.workCenters = []
          this.raw = []
          this.error = res.message || '获取 OEE 数据失败'
        }
      } catch (err: any) {
        this.workCenters = []
        this.raw = []
        this.error = err?.message || '获取 OEE 数据异常'
      } finally {
        this.loading = false
      }
    },

    // 获取指定车间的机器列表
    getMachinesByWorkshop(workCenterName: string): MachineOeeItem[] {
      const wc = this.workCenters.find(w => w.work_center === workCenterName)
      return wc ? wc.machineOeeList : []
    }
  }
})
