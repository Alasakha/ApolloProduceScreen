<template>
  <div class="header flex justify-center items-center text-white h-[10%]"> 
    <h1>到货不及时供应商 - 总装一课</h1>
  </div>

  <!-- 外层容器明确高度 -->
  <div class="marquee-wrapper h-[90%] p-2 pr-5">
    <!-- Marquee 自身也设置高度 -->
    <Vue3Marquee
      :speed="60"
      pauseOnHover
      gradient
      gradient-length="10%"
      class="h-full"
    >
      <!-- el-card 设置 min-h，flex 布局撐满 -->
      <el-card
        v-for="data in rawData"
        :key="data.id || data.supplierName"
         class="marquee-card h-full flex flex-col justify-center 
         items-start mr-4 p-4 border-none rounded-lg shadow-xl bg-gradient-to-r "
        shadow="hover"
      >
        <p class="text-base font-semibold">{{ data.supplierName }}</p>
        <p class="text-sm">工单号：{{ data.gdh }}</p>
        <p class="text-sm">总数：{{ data.total || 'N/A' }}</p>
        <p class="text-sm">不及时数：{{ data.bjsNum || 'N/A' }}</p>
      </el-card>
    </Vue3Marquee>
  </div>

</template>


<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getTop5SuppliersDelayedDelivery } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';
// 1. 响应式数据
const rawData = ref([]);






// 4. 获取 API 数据
const fetchData = () => {
  getTop5SuppliersDelayedDelivery()
    .then(res => {
      rawData.value = res.data.zzyk;
      console.log(' rawData.value ', rawData.value )
    })
    .catch(() => {
      console.log('数据获取失败');
    });
};



// 8. 页面挂载时获取数据
onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件并销毁图表
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听


});
</script>


<style scoped>
/* dv-bg 作为父容器，确保它有大小 */
.dv-bg {
  width: 100%;
  height: 100%; /* 可调整 */

}

/* ECharts 图表容器 */
.chart-container {
  width: 100%;
  height: 100%;
}


/* 强制覆盖 vue3-marquee 的内部容器高度 */
:deep(.vue3-marquee.horizontal) {
  height: 100% !important;
}
.marquee-card{
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); /* 渐变背景 */
  color: aliceblue;
}
</style> 