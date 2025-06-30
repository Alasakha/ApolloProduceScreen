<script setup>
import { ref, onMounted ,onBeforeUnmount} from 'vue';
</script>

<template>
  <div class="container flex flex-col items-center">
    <div class="title title-main">
      <!-- {{handleTitle(prodLine)}}{{handleTitle2(prodLine)}} -->
      质量管理看板</div>
  </div>
</template>

<style scoped>
.title {
  font-size: 1vw;
  color: white;
}

.title-main {
  font-size: 2vw; /* 设置标题行的字体更大 */
  font-weight: bold; /* 设置标题为加粗 */
  letter-spacing: 0.5vw ; /* 增加字间距 */
}
</style>