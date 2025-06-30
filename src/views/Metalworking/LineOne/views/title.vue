<script setup>
import { ref, reactive, computed, watch } from 'vue';


</script>

<template>
  <div class="flex-col flex justify-center items-center">

<div class="title title-main flex justify-center items-center">来料收货管理看板</div>
<div class="flex justify-between">
  <dv-decoration8 style="width:10vw;height:2vh;" />
  <dv-decoration8 :reverse="true" style="width:10vw;height:2vh;" />
</div>

  </div>

</template>

<style scoped>
.title {
  font-size: 1.5vw;
  color: #ffffff;
  text-shadow: 0 0 10px #15A3EF,
               0 0 20px #15A3EF,
               0 0 30px #15A3EF;
}

.title-main {
  font-size: 2vw; /* 设置标题行的字体更大 */
  font-weight: bold; /* 设置标题为加粗 */
  letter-spacing: 0.5vw ; /* 增加字间距 */
  text-shadow: 0 0 1px #4377e7,
               0 0 2px #7297e7,
               0 0 3px #6b91e2,
               0 0 4px #6596ff; /* 主标题荧光效果更强 */
}
</style>