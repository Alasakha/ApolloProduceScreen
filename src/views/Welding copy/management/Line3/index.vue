<template>
    <div class="line3-container h-[30%] flex w-full">
        <div class="abnormal-wrapper w-2/3">
          <Temperature />
        </div>
        <div class="quality-wrapper w-1/3">
          <!-- <Abnormal /> -->
          <WorkOrderClosingRate :prod-line="workOrderProdLine" />
            <!-- <Quality /> -->
        </div>
    </div>  

</template>


<script setup lang="ts">
// import OneProdLine from './oneProdLine.vue';
// import TwoProdLine from './twoProdLine.vue';
// import Abnormal from './abnormal.vue';
// import Quality from './qualityQues.vue';
  // import Abnormal from '../Line2/Abnormal.vue'
  import Temperature from './temperature.vue'
  import WorkOrderClosingRate from '../components/WorkOrderClosingRate.vue'
  import { ref } from 'vue'
  const workOrderProdLine = ref('金工一部焊接')
</script>

<style scoped>
.line3-container {
  display: flex;
  width: 100%;
  height: 30%;
  gap: 8px; /* 添加间距 */
}

.abnormal-wrapper {
  flex: 2; /* 2:1 比例 */
  min-width: 0; /* 防止 flex 子项溢出 */
}

.quality-wrapper {
  flex: 1; /* 2:1 比例 */
  min-width: 0; /* 防止 flex 子项溢出 */
}

/* 确保子组件不会超出容器 */
.abnormal-wrapper :deep(.wrapper),
.quality-wrapper :deep(.quality-container) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>