<template>
<div class="w-screen h-[25vh] pl-[2vw] pr-[0vw] flex pt-[0.5vh]">
  <div class="left_part flex-1">
    <dv-border-box12>
      <div dv-bg>
        <LeftContent/>
      </div>
    </dv-border-box12>
  </div>
  <div class="right_part flex-1">
    <dv-border-box12>
      <div dv-bg>
        <RightContent/>
      </div>
    </dv-border-box12>
  </div>
</div>
</template>


<script lang="ts" setup>
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import RightContent from './RightContent/index.vue'
import LeftContent from './LeftContent/index.vue'
</script>



<style scoped>

</style>