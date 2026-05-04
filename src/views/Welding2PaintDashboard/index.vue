<template>
  <body>
    <Header></Header>
    
    <div class="dashboard-container">
      <div class="section-top">
        <Line1></Line1>
      </div>
      
      <div class="section-bottom">
        <Line2></Line2>
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Header from './Header copy/index.vue'
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'
import { eventBus } from '@/utils/eventbus'

onMounted(() => {
  const timer = setInterval(() => {
    eventBus.emit('refreshData')
  }, 30000)

  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #1a2f4e 100%);
  overflow: hidden;
}

.dashboard-container {
  width: 100%;
  height: calc(100vh - 60px);
  padding: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-top {
  /* flex: 1; */
  height: 30%;
  /* min-height: 0; */
  min-height: 0;
  overflow: hidden;
}

.section-bottom {
  height: 65%;
  overflow: hidden;
}
</style>
