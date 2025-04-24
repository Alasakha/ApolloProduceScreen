<template>
  <dv-border-box8 :dur="5">
    <div class="header flex justify-center items-center text-white h-[10%] ">
      <h1 class="text-2xl font-bold">到货不及时供应商 - 总装一课</h1>
    </div>

    <div class="marquee-wrapper h-[90%] p-2 pr-5">
      <Vue3Marquee
        v-if="marqueeVisible"
        :speed="60"
        pauseOnHover
        gradient
        :gradient-color="[173, 216, 230]" 
        gradient-length="5%"
       class="h-full w-full overflow-hidden"
      >
        <!-- 内容 -->
        <el-card
          v-for="(data, index) in rawData"
          :key="data.id || data.supplierName"
          class="marquee-card h-full flex flex-col justify-center items-start mr-4"
          shadow="hover"
        >
          <!-- 添加序号 -->
          <p class="text-2xl font-bold mb-1">#{{ index + 1 }}</p>
          <p class="text-lg font-semibold">{{ data.supplierName }}</p>
          <p class="text-base">工单号：{{ data.gdh }}</p>
          <p class="text-base">总数：{{ data.total || 'N/A' }}</p>
          <p class="text-base">不及时数：{{ data.bjsNum || 'N/A' }}</p>
        </el-card>
      </Vue3Marquee>
    </div>
  </dv-border-box8>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { getTop5SuppliersDelayedDelivery } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';

const rawData = ref([]);
const marqueeVisible = ref(false);


const fetchData = async () => {
  try {
    const res = await getTop5SuppliersDelayedDelivery();
    rawData.value = res.data.zzyk || [];

    // 等 DOM 更新后再显示轮播
    nextTick(() => {
      setTimeout(() => {
        marqueeVisible.value = true;

        // ⬇️ 兜底触发一次浏览器重绘
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 200);

      }, 100); // 首个延时用于 DOM 准备
    });
  } catch (err) {
    console.log('数据获取失败');
  }
};

onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData);
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData);
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
.marquee-wrapper {
  width: 40vw;
  overflow: hidden;  /* 隐藏溢出部分 */
}
</style> 