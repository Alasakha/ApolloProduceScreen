<template>
      <dv-full-screen-container><body>
        <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
            <div class="metalworking">
                <LineOne />
                <LineTwo />
                <LineThree />
                <LineFour />
            </div>
        </dv-border-box11>

      </body></dv-full-screen-container>


</template>

<script setup>
// Add your script logic here
import LineOne from './LineOne/index.vue'
import LineTwo from './LineTwo/index.vue'
import LineThree from './LineThree/index.vue'
import LineFour from './LineFour/index.vue'
</script>

<style scoped>
.metalworking {
    /* Add your styles here */
}
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