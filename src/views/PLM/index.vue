<template>
<body>
        <dv-border-box11 title="浙江阿波罗科技运动有限公司" :title-width="400" >
            <div class="w-full h-full flex flex-col pl-4 pr-4">
                <!-- <div class="w-full h-[3vh] " ></div> -->
                <Header></Header>
                <Line2></Line2>
                <Line3></Line3>
            </div>
        </dv-border-box11>
 </body>

</template>

<script lang="ts" setup>
import Header from './Header/index.vue'
import Line2 from './Line2/index.vue'
import Line3 from './Line3/index.vue'
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