<template>
  <dv-full-screen-container class="box">
  <body>
    <dv-border-box13 class="dv-border-box13">
        <Header></Header>
        <Line2></Line2>
        <Line3></Line3>
    </dv-border-box13>
  </body>
</dv-full-screen-container>
</template>

<script setup >  
import Header from './views/Header/index.vue'
import Line2 from './views/Line2/index.vue'
import Line3 from './views/Line3/index.vue'
</script>


<style scoped>
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
  z-index: 1; /* 设置 z-index，确保在最底层 */
}
.dv-border-box13 {
  position: relative;
  z-index: 2; /* 确保边框在 body 之上 */
}
/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
} 

.content{
  width: 100%;
  height: 100%;
}

.top_box{
  display: flex;
  height: 50%;
  padding-top: 1%;
  padding-left: 0.5%;
  padding-right: 0.5%;
  padding-bottom: 0.5%;
}

.top_box_left{
  flex: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top_box_right{
  flex: 1;
  height: 100%;
}
.top_box_left_top{
  flex: 1;
  display: flex;
}
.top_box_left_top_left{
  flex: 1;
  display: flex;
}
.top_box_left_top_right{
  flex: 1;
}
.top_box_left_bottom{
  flex: 2;
}
.time_box{
  flex: 1;
  width: 100%;
  height: 100%;
}
.logo_box{
  flex: 1;
}
.box-bottom{
  display: flex;
  height: 46%;
}
.box-bottom-left{
  flex: 1;
} 
.box-bottom-middle{
  flex: 1;
}
.box-bottom-right{
  flex: 1;
}
</style>
