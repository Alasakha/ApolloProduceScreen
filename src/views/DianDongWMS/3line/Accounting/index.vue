<template>
  <div class="accounting w-full h-[160%] pt-3 pb-3">
    <dv-border-box10>
      <div class="w-full h-full flex">
        <!-- 左侧：上面三张 + 下面三张（新加） -->
        <div class="flex-1 h-full flex flex-col gap-3 pr-3">
          <Top class="flex-1" />
          <Bottom class="flex-1" />
          <Middle class="flex-1" />
        </div>


      </div>
    </dv-border-box10>
  </div>
  
</template>

<script setup lang="ts">
import Top from './top.vue';
import Middle from './middle.vue'
import Bottom from './bottom.vue';

</script>




<style scoped lang="scss">
.accounting {
  .w-\[35%\] { min-width: 320px; }
}
</style>  