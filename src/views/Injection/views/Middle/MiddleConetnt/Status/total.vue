<template>
  <div>
    <!-- 如果正在加载，显示 loading -->
    <div v-if="isLoading" class="loading-container">
      <dv-loading>Loading...</dv-loading>
    </div>

    <!-- 如果没有数据，显示暂无数据 -->
    <div v-if="!isLoading && isDataEmpty" class="empty-container">
      暂无数据
    </div>

    <!-- 数据加载完成且非空时显示图表 -->
    <div v-if="!isLoading && !isDataEmpty" ref="stopIndicators" style="width:10vw; height: 15vh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick,watch,computed } from 'vue';
import {createChartOption} from './charts'
import { useEcharts } from '@/utils/useEcharts'; // 引入封装
import { useDeviceStatusStore } from '@/store/deviceStatus';


const stopIndicators = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const isDataEmpty = ref(false);




const { initChart, setOption, resizeChart } = useEcharts(stopIndicators); // 使用封装的逻辑
const store = useDeviceStatusStore();

const shutdown = computed(() => store.data['总数'] || 0);
const max  = computed(() => store.data['总数'] || 0);



watch(shutdown, () => {
  nextTick(() => {
    initChart();
    const option = createChartOption(shutdown.value ,max.value,'green'); // ✅ 这里要加 .value
    setOption(option);
  });
}, { immediate: true });


// 组件挂载时初始化图表
onMounted(() => {
  store.fetchDeviceStatus(); // 第一个组件请求接口，后面组件判断 isLoaded 就不会重复请求
  resizeChart()

});

// 组件卸载时清理资源
onBeforeUnmount(() => {

});
</script>

<style scoped>
.loading-container {
  text-align: center;
  padding: 20px;
}

.empty-container {
  text-align: center;
  font-size: 18px;
  color: #999;
}
</style>