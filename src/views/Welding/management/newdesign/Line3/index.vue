<template>
  <div class="flex gap-2 h-[20vh] mt-2">
    <div class="flex-1">
      <RoughYield />
    </div>
    <div class="flex-1">
      <SprayingYield />
    </div>
    <div class="flex-1">
      <QualityQues />
    </div>
  </div>
</template>

<script setup>
import RoughYield from '@/views/Welding/management/Line2/roughYield.vue'
import SprayingYield from '@/views/Welding/management/Line2/sprayingYield.vue'
import QualityQues from '@/views/Welding/management/Line3/qualityQues.vue'
</script>