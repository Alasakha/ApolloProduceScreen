<template>
  <div class="accounting w-full h-full pt-3 pb-3">
    <dv-border-box10>
       <div class="w-full h-full flex flex-col">

              <!-- 标题：固定高度（内容自然撑开） -->
                <div class="text-center text-2xl font-bold text-white">
                    账务处理及时率
                </div>

                <!-- 内容区域：用 flex-1 撑满剩余空间 -->
                <div class="flex flex-col flex-1">
                    <Top class="flex-1" />
                    <Bottom class="flex-1" />
                </div>
       </div> 
    </dv-border-box10>
  </div>
</template>

<script setup lang="ts">
import Top from './top.vue';
import Bottom from './bottom.vue';
</script>




<style scoped >
 

</style>  