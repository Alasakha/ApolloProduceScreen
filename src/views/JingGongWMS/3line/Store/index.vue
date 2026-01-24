<template>
  <div class="accounting w-full h-full pt-3 pb-3">
    <dv-border-box10 class="h-full w-full">
      <div class="w-full h-full flex flex-col">
        <!-- 上半部分 -->
        <div class="h-1/2 flex flex-col">
          <div class="flex-1 overflow-hidden">
            <Top />
          </div>
        </div>

        <!-- 下半部分 -->
        <div class="h-1/2 flex flex-col">
          <div class="flex-1 overflow-hidden">
            <Bottom />
          </div>
        </div>
      </div>
    </dv-border-box10>
  </div>
</template>


<script lang="ts" setup>  
import Top from './top.vue';
import Bottom from './bottom.vue';

</script>

<style scoped>

</style>
