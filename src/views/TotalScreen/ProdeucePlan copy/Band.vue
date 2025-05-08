<template>
  <ProjectSum class="title"></ProjectSum>
  <!-- 顶部导航 -->
  <dv-full-screen-container class="box">
    <dv-border-box-11 title="浙江阿波罗运动科技股份有限公司" :titleWidth=350 style="letter-spacing: 0.1vw;">
      <!-- 第一行 -->
      <div class="line1">
        <!-- 第一行左边框框 -->
        <div class="flex-item-left">
          <!-- 当前时间 -->
          <CurrentTime></CurrentTime>
          <!-- 基本信息 -->
            <BasicData></BasicData>
        </div>
        <div class="work-progress-container">
          <WorkProgress />
        </div>
      </div>
      
      <!-- //表格区域 -->
      <div class="picture">
        <CapacityBarchart></CapacityBarchart>
        <DailyAbnormalPiecharts></DailyAbnormalPiecharts>
        <MonthAbnormalBarchart></MonthAbnormalBarchart>
      </div>
      
    </dv-border-box-11>
  </dv-full-screen-container>
</template>

<script setup>
import CurrentTime from './CurrentTime.vue';

import WorkProgress from './WorkProgress.vue';
import BasicData from './BasicData.vue';
import CapacityBarchart from './Charts/CapacityBarchart.vue'
import DailyAbnormalPiecharts from './Charts/DailyAbnormal.vue'
import MonthAbnormalBarchart from './Charts/MonthAbnormal.vue'
</script>

<style scoped>
.box {
  width: 100vw;
  height: 100vh;
}
.line1 {
  display: flex;
  justify-content: space-between; /* 让两边内容合理分布 */
  align-items: flex-start;
  height: 45vh;
}

.flex-item-left {
  flex: 2.5; /* 让左边部分自动撑开 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 42vh;
  margin: 3vh 0.5vw;
}

.work-progress-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%; /* 确保占满父容器 */
  margin-top: 4vh;
  margin-right: 1vw;
  height: 40vh;   
}

.chart-container {
  margin-top: 20px; /* 设置图表与其他元素的间距 */
  padding: 10px;
}
.picture{
  height: 50vh;
  margin-top: 1vh;
  display: flex;
  justify-content: space-around;
}

</style>
