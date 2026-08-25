<template>
  <div class="line3-container w-full flex gap-4 px-4">
    <!-- 第一列：管件组 -->
    <div class="column flex-1">
      <PipeFittingGroup />
    </div>

    <!-- 中间列：板金组 -->
    <!-- <div class="column flex-1">
      <SheetMetalGroup />
    </div> -->

    <!-- 第三列：监控数据 -->
    <div class="column flex-1">
      <RightColumn />
    </div>
  </div>
</template>

<script setup lang="ts">
import PipeFittingGroup from './components/PipeFittingGroup.vue'
// import SheetMetalGroup from './components/SheetMetalGroup.vue'
import RightColumn from './components/RightColumn.vue'
</script>

<style scoped>
.line3-container {
  height: calc(100vh - 19vh);
  min-height: 600px;
}

.column {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}
</style>

