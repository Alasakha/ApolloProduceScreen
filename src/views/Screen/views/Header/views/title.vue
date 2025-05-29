


<script setup>
import { ref, onMounted ,onBeforeUnmount} from 'vue';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { getMonthTotalInfo   } from '@/api/getProduceinfo';

const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数

const cumulativePassRate = ref({})
const prodLineName = ref('')
const zoomClass = ref('');

const fetchData = () => {
  getMonthTotalInfo(prodLine).then(res => {
    cumulativePassRate.value = res.data;
    console.log('cumulativePassRate', cumulativePassRate.value);
  }).catch(() => {});
};

// 根据生产线决定名称
const decideName = (prodLine) => {
  if (prodLine === '1004A') {
    return '装配A';
  } else if (prodLine === '1004B') {
    return '装配B';
  } else if (prodLine === '1004C') {
    return '装配C';
  } else if (prodLine === '1005A') {
    return '包装A';
  } else if (prodLine === '1005B') {
    return '包装B';
  }
};

// 判断缩放比并更新 zoomClass
const updateZoomClass = () => {
  const bodyClass = document.body.classList;
  
  if (bodyClass.contains('zoom-75')) {
    zoomClass.value = 'zoom-75';
  } else if (bodyClass.contains('zoom-100')) {
    zoomClass.value = 'zoom-100';
  } else if (bodyClass.contains('zoom-125')) {
    zoomClass.value = 'zoom-125';
  } else if (bodyClass.contains('zoom-150')) {
    zoomClass.value = 'zoom-150';
  } else if (bodyClass.contains('zoom-200')) {
    zoomClass.value = 'zoom-200';
  }
};

onMounted(() => {
  updateZoomClass(); // 页面加载时先设置一次缩放类
  fetchData()
  window.addEventListener('resize', updateZoomClass); // 监听窗口缩放变化
});

// 组件卸载时清除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateZoomClass);
});
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <div :class="zoomClass">
      <div
        class="text-white font-bold tracking-wider flex "
        :class="{
          'text-[3.1vw]': zoomClass === 'zoom-75',
          'text-[2.41vw]': zoomClass === 'zoom-100',
          'text-[2.9vw]': zoomClass === 'zoom-125',
          'text-[2.7vw]': zoomClass === 'zoom-150',
          'text-[3vw]': zoomClass === 'zoom-200'
        }"
      >
        {{ decideName(prodLine) }}线管理看板
      </div>

      <div
        class="text-white tracking-wide mt-2"
        :class="{
          'text-[3vw]': zoomClass === 'zoom-75',
          'text-[1.5vw]': zoomClass === 'zoom-100',
          'text-[1.8vw]': zoomClass === 'zoom-125',
          'text-[1.7vw]': zoomClass === 'zoom-150',
          'text-[2vw]': zoomClass === 'zoom-200'
        }"
      >

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以根据需要进一步调整样式 */
</style>
