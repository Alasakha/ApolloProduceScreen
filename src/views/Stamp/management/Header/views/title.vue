<template>
  <div
    class="flex justify-center items-center
           text-white font-bold tracking-[0.5vw]
           text-[4.5vw] hd:text-[2.8vw] fullhd:text-[3vw] 2k:text-[2.4vw] 2k-plus:text-[3vw] 4k:text-[2vw]"
  >
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';

const route = useRoute();
const prodLine = computed(() => route.query.prodLine as string);

const title = computed(() => {
  if (prodLine.value === 'HJ') {
    return '焊接生产管理看板';
  } else if (prodLine.value === 'CY') {
    return '冲压生成管理系统';
  }
  return '生产管理系统';
});



onMounted(() => {
  console.log(prodLine.value);
});
</script>

