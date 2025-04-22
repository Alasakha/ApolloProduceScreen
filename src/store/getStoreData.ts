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
      this.loading = true // 设置加载状态为 true
      try {
        // 使用 Promise.all 并发请求数据
        const [warehouseLocationData, storeData] = await Promise.all([
          getwarehouseLocation(), // 获取仓库位置数据
          getstore(), // 获取仓库数据
        ])

        // 将两个接口的数据合并
        this.combinedData = this.mergeData(warehouseLocationData.data, storeData.data)
        console.log('合并后的数据:', this.combinedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.loading = false // 不管成功还是失败，都需要设置 loading 为 false
      }
    },

    // 合并两个接口的数据
    mergeData(warehouseLocationData: any[], storeData: any[]) {
      // 创建一个以仓库名称为 key 的映射
      const mergedData = warehouseLocationData.map((warehouse) => {
        const matchingStore = storeData.find((store) => store.cw === warehouse.cw)

        // 合并仓库的各个数据字段
        return {
          cw: warehouse.cw,
          usedNum: warehouse.usedNum,
          cwNum: warehouse.cwNum,
          percent: warehouse.percent,
          amt: matchingStore?.amt ?? null, // 如果没有找到对应的仓库，给出 null
          kc: matchingStore?.kc ?? null,
          turnoverDays: matchingStore?.turnoverDays ?? null,
        }
      })

      return mergedData
    },
  },
})
