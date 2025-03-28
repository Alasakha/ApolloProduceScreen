<template>
<div class="w-screen h-[25vh] pl-[2vw] pr-[2vw] flex pt-[0.5vh]">
  <div class="left_part flex-1">
    <dv-border-box12>
      <div dv-bg>
        dv-border-box-12
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
</script>



<style scoped>

</style>