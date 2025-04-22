<template>
  <div class="left-content h-full w-[65%]">
    <dv-border-box10>
      <div class="flex flex-wrap gap-1 p-4 h-full justify-center items-center">
        <div v-if="store.loading" class="text-white">
          <dv-loading>
        Loading...
    </dv-loading>
    </div> <!-- 显示加载中 -->
        
        <!-- 数据加载完成后渲染 -->

          <div
          v-else
            v-for="warehouse in warehouseList"
            :key="warehouse"
            class="bg-[#071A3F] border border-blue-500 rounded-xl p-1 w-[30%] min-w-[20VW]"
          >
            <div class="text-white text-xl font-bold text-center mb-1">
              {{ warehouse }}
            </div>

            <div class="grid grid-cols-3 gap-4">
              <MetricCard label="库存金额" :value="warehouseData[warehouse]?.amt" />
              <MetricCard label="库存数量" :value="warehouseData[warehouse]?.kc" />
              <MetricCard label="库存周转天数" :value="warehouseData[warehouse]?.turnoverDays" />
              <MetricCard label="总库位" :value="warehouseData[warehouse]?.cwNum" />
              <MetricCard label="已用库位" :value="warehouseData[warehouse]?.usedNum" />
              <MetricCard label="库位利用率" :value="warehouseData[warehouse]?.percent" />
            </div>
          </div>
        </div>
      
    </dv-border-box10>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, onMounted ,onBeforeUnmount} from 'vue'
import MetricCard from '@/components/WMS/MetricCard.vue'
import { useDataStore } from '@/store/getStoreData';
import { eventBus } from '@/utils/eventbus';


const store = useDataStore()

interface WarehouseInfo {
  amt: number | null;  // 库存金额
  kc: number | null; // 库存数量
  turnoverDays: number | null; // 库存周转天数
  cwNum: number | null; // 总库位
  usedNum: number | null; // 已用库位
  percent: string | null; // 库位利用率
}

const warehouseList = ref<string[]>([])
const warehouseData = reactive<Record<string, WarehouseInfo>>({})

const fetchData = async () => {
  await store.fetchData() // 等待数据加载

  // 获取合并数据
  const res = store.combinedData
  
  // 提取仓库名称列表
  warehouseList.value = res.map((item: any) => item.cw)

  // 构建 warehouseData
  res.forEach((item: any) => {
  warehouseData[item.cw] = {
    amt: item.amt ? parseFloat(parseFloat(item.amt).toFixed(1)) : null, // 转换为数字
    kc: item.kc ? parseFloat(parseFloat(item.kc).toFixed(0)) : null,    // 格式化库存为整数
    turnoverDays: item.turnoverDays ? parseFloat(item.turnoverDays) : null,  // 转换为数字
    cwNum: item.cwNum ? parseFloat(item.cwNum) : null,      // 总库位数
    usedNum: item.usedNum ? parseFloat(item.usedNum) : null,  // 已用库位数
    percent: item.cwNum && item.usedNum ? ((item.usedNum / item.cwNum) * 100).toFixed(0)+'%' : null,  // 库位利用率，避免除零错误
  };
})


  console.log('仓库数据:', warehouseData)
}

// 8. 页面挂载时获取数据
onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听

})
</script>

<style scoped>

</style>
