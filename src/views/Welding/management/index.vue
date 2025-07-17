<template>
    <body>

            <div class="w-full h-full flex flex-col pl-4 pr-4">
                <!-- <div class="w-full h-[3vh] " ></div> -->
                <Header></Header>
                <Line1></Line1>
                <Line2></Line2>
                <Line3></Line3>
            </div>

    </body>
</template>
    
<script lang="ts" setup>
import Header from './Header/index.vue'
import Line1 from './Line1/index.vue'
import Line2 from './Line2/index.vue'
import Line3 from './line3.vue'
import { onMounted, onUnmounted } from 'vue'
import { eventBus } from '@/utils/eventbus'

onMounted(() => {
  // 每分钟刷新一次数据
  const timer = setInterval(() => {
    eventBus.emit('refreshData')
  }, 180000)

  onUnmounted(() => {
    clearInterval(timer)
  })
})
</script>
    
<style scoped>
body{
    width: 100vw;
    height: 100vh;
    background: 
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
    url('@/assets/background.jpg') no-repeat center center;
    background-size: cover;
    transform-origin: center center;
    position: relative;
    transition: transform 0.3s ease-in-out;
}


</style>