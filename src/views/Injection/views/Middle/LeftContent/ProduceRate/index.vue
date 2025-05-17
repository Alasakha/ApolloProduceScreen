<template>
  <!-- 产品合格率 -->
  <div class="machine-list h-full w-full flex justify-around items-center ">
    <!-- 遍历数据并展示每台机器的生产进度 -->
    <MachineProgress
      v-for="machine in machineData"
      :key="machine.ty009"
      :machineName="machine.ty009"
      :spc="machine.spc"
      :completed="machine.ty004"
      :rate="machine.rate"
      danwei="合格率"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { getProductPassRate } from '@/api/getInjection';
import { eventBus } from '@/utils/eventbus.ts';
import MachineProgress from '@/components/injection/PassRateCard.vue';  // 引入MachineProgress组件

// 存储获取到的数据
const machineData = ref([]);  // 存储每台机器的数据

// 数据加载和处理状态
const isLoading = ref(true);
const isDataEmpty = ref(false);

// 获取数据函数
const fetchData = async () => {
  try {
    const res = await getProductPassRate();
    if (res.code === 200) {
      // 将接口返回的机器数据存入 `machineData`
      machineData.value = res.data.map(item => ({
  ty009: item.macNo?.trim() || '',         // 去除多余空格
  spc: Number(item.total_count),                   // 转为数字
  ty004: Math.floor(Number(item.ok_count)),   // 已完成数转整数
  rate: typeof item.rate === 'string' && item.rate.includes('%')
  ? Number(item.rate.replace('%', '')).toFixed(1)
  : null
}));
      isLoading.value = false;
    } else {
      isLoading.value = false;
      isDataEmpty.value = true;
      console.error('接口返回错误:', res.message);
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
  }
};

// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
  eventBus.on('refreshData', fetchData);  // 监听全局刷新事件
});

// 清理事件监听器
onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
.machine-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
