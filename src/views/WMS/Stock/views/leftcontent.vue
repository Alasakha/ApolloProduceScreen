<template>
  <div class="left-content h-full w-[65%]">
    <dv-border-box10>
      <div class="production-data text-white w-full h-full  flex justify-around flex-col">

<div class="row flex justify-around items-centers  " >
  <DataCard title="库存金额" :value="warehouseData[0]?.amt ?? '无数据'" />
  <DataCard title="库存数量" :value="warehouseData[0]?.kc ?? '无数据'" />
<DataCard title="库存周转天数" :value="warehouseData[0]?.turnoverDays ?? '无数据'" />
</div>
<div class="row flex justify-around items-centers" >
  <DataCard title="总库位" :value="warehouseData[0]?.total ?? '无数据'" />
<DataCard title="已用库位" :value="warehouseData[0]?.usedTotal ?? '无数据'" />
<DataCard title="库位利用率" :value="warehouseData[0]?.percent ?? '无数据'" />

</div>
</div>
      
    </dv-border-box10>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted ,onBeforeUnmount} from 'vue'
import DataCard from '@/components/DataCard.vue';
import { useDataStore } from '@/store/getStoreData';
import { eventBus } from '@/utils/eventbus';


const store = useDataStore()

interface WarehouseInfo {
  total: number | null;  // 库存金额
  usedTotal: number | null; // 库存数量
  percent: string | null; // 库存周转天数
  amt: number | null; // 总库位
  kc: number | null; // 已用库位
  turnoverDays: number | null; // 库位利用率
}

const warehouseData = ref<WarehouseInfo[]>([])


  const fetchData = async () => {
  await store.fetchData(); // 等待数据加载

  const res = store.combinedData;
    console.log(res, '库存数据')
  warehouseData.value = res.map((item: any) => {
    return {
      amt: item.amt ? parseFloat(parseFloat(item.amt).toFixed(1)) : null,
      kc: item.kc ? parseFloat(parseFloat(item.kc).toFixed(0)) : null,
      turnoverDays: item.turnoverDays ? parseFloat(item.turnoverDays) : null,
      total: item.total ? parseFloat(item.total) : null,
      usedTotal: item.usedTotal ? parseFloat(item.usedTotal) : null,
      percent: item.percent  ?  item.percent: null,
    };
  });
  console.log(warehouseData.value, '库存数据')
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
