<script setup>
import { ref, reactive, computed, watch } from 'vue';
import CompactDateSelector from '@/components/GlobalDateSelector/CompactDateSelector.vue';
</script>

<template>
<div class="title-container flex justify-between items-center w-full">
  <div class="title title-main absolute">制造绩效管理看板</div>
  <!-- 全局日期选择器 -->
  <div class="global-date-control relative right-0">
    <CompactDateSelector />
  </div>
</div>
</template>

<style scoped>
.title-container {
  width: 100%;
  padding: 0 20px;
}

.title {
  font-size: 1.5vw;
  color: white;
}

.title-main {
  font-size: 2vw; /* 设置标题行的字体更大 */
  font-weight: bold; /* 设置标题为加粗 */
  letter-spacing: 0.5vw ; /* 增加字间距 */
}

.global-date-control {
  /* 确保日期选择器在右侧显示 */
  margin-left: auto;
}
</style>