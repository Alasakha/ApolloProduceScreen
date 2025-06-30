// / src/stores/useDataStore.ts
import { defineStore } from 'pinia'
import { getwarehouseLocation, getstore } from '@/api/getWMSinfo'
import { gettimelyAccountingRate ,getdeliveryTimelinessRat} from '@/api/getWMSinfo';

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


export const useAccountDataStore = defineStore('accountDataStore', {
  state: () => ({
    combinedData: [] as any[], // 组合数据
    Inboundloading: false, // 加载状态
    Outboundloading: false, // 加载状态
    InboundData: [] as any[], // 入库数据
    OutboundData: [] as any[], // 出库数据
    GoodArriveData: [] as any[]
  }),
  actions: {
    async fetchInboundData() {
      this.Inboundloading = true
     const res1 = await gettimelyAccountingRate()
      console.log('入库数据:', res1)
      if (res1.code === 200) {
        this.InboundData = res1.data
        
    
      //  this.combinedData =  this.mergeData(到货处理及时率, 入库处理及时率)
        this.Inboundloading = false
      }
    },
    async fetchOutboundData() {
      this.Outboundloading = true
     const res = await getdeliveryTimelinessRat()
      if (res.code === 200) {
        this.OutboundData = res.data
        
    
      //  this.combinedData =  this.mergeData(到货处理及时率, 入库处理及时率)
        this.Outboundloading = false
      }
    },
// mergeData(deliveryData: any[], storageData: any[]) {
//   const mergedMap = new Map();

//   // 遍历到货数据
//   deliveryData.forEach(item => {
//     const key = item.warehouseKeeper;
//     if (!key) return;
//     mergedMap.set(key, {
//       warehouseKeeper: key,
//       delivery: item,
//       storage: null
//     });
//   });

//   // 遍历入库数据并合并
//   storageData.forEach(item => {
//     const key = item.warehouseKeeper;
//     if (!key) return;
//     if (mergedMap.has(key)) {
//       mergedMap.get(key).storage = item;
//     } else {
//       mergedMap.set(key, {
//         warehouseKeeper: key,
//         delivery: null,
//         storage: item
//       });
//     }
//   });

//   return Array.from(mergedMap.values());
// }

  },
})