<template>
  <!-- <ProjectSum class="title"></ProjectSum> -->
  <!-- 顶部导航 -->
  <dv-full-screen-container class="box">
    <dv-border-box-11 title="浙江阿波罗运动科技股份有限公司" :titleWidth=350 style="letter-spacing: 0.1vw;">
      <!-- 第一行 -->
      <Header></Header>
      
      <Line2 class="pr-2 h-[40vh]"></Line2>
        <!-- <div class="work-progress-container">
          <WorkProgress />
        </div> -->

      
      <!-- //表格区域 -->
      <div class="picture h-[50vh] flex p-4">
        <Line3></Line3>
      </div>
      
    </dv-border-box-11>
  </dv-full-screen-container>
</template>

<script setup>
import CurrentTime from './CurrentTime.vue';

import WorkProgress from './WorkProgress.vue';
import Line2 from './Line2/index.vue';
import Line3 from './Charts/index.vue'
import Header from './header/index.vue';
</script>

<style scoped>
.box {
  width: 100vw;
  height: 100vh;
}




.picture{
  margin-top: 1vh;
  display: flex;
  justify-content: space-around;
}

</style>
