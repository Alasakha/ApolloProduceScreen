

<template>
<body>
  <Band></Band>
</body>

</template> 


<script>
import { defineComponent } from 'vue'
 import Band from './Band.vue'
export default defineComponent({
  name: 'Demo',
  components: {
    Band,
  }
})
</script>

<style scoped>
/* 缩放适配 */
body {
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

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

</style>


