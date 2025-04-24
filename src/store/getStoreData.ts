// / src/stores/useDataStore.ts
import { defineStore } from 'pinia'
import { getwarehouseLocation, getstore } from '@/api/getWMSinfo'

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    combinedData: [] as any[], // 组合数据
    loading: false, // 加载状态
  }),
  actions: {
    async fetchData() {
      this.loading = true
      try {
        const [warehouseLocationData, storeData] = await Promise.all([
          getwarehouseLocation(),
          getstore(),
        ])
    
        // 不再按仓库分，只返回一个合并的对象
        this.combinedData = this.mergeData(warehouseLocationData.data, storeData.data)
        console.log('合并后的数据:', this.combinedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.loading = false
      }
    },

    // 合并两个接口的数据
    mergeData(warehouseLocationData: any, storeData: any) {
      // warehouseLocationData 和 storeData 都是对象，直接整合字段
      return [{
        total: warehouseLocationData.total,
        usedTotal: warehouseLocationData.usedTotal,
        percent: warehouseLocationData.percent,
        amt: storeData.amt,
        kc: storeData.kc,
        turnoverDays: storeData.turnoverDays,
      }]
    }
  },
})
