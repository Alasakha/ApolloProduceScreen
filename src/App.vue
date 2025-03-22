<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import { eventBus } from './utils/eventbus'
let intervalId:any = null;


onMounted(async () => {
  await nextTick(); // 确保 `#app` 已经挂载

  // 避免 `intervalId` 被多次创建
  if (!intervalId) {
    intervalId = setInterval(() => {
      console.log("🔄 触发全局更新事件");
      eventBus.emit("refreshData");
    }, 180000);
  }
});

onUnmounted(() => {
  

  // 清除定时器
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>

<template>
    <router-view />
</template>

<style >
/* 让整个 App.vue 充满屏幕并居中 */
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂he直居中 */
}
/* 全屏基础样式 */
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

</style>
