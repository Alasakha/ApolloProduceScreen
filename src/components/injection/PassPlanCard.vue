<template>
    <div class="machine-progress flex flex-col justify-start">
      <div class="header">
        <h3 class="text-sky-200">机器型号：<p class="title text-cyan-300">{{ machineName }}</p> </h3>
      </div>
      <div class="progress-info">
        <div class="progress-item">
          <!-- 取消+ '个' -->
          <strong>当日排产数：</strong> <span>{{ spc!== null && spc!== undefined ? spc  : '暂无数据' }} </span>
        </div>
        <div class="progress-item">
         <strong>达成数：</strong><span>{{ completed !== null && completed !== undefined ? completed  : '暂无数据' }}</span>
        </div>
        <div class="progress-item">
          <strong>达成率：</strong> 
          <span>{{ rate !== null ? `${rate}%` : '暂无数据' }}</span>
        </div>
      </div>
      <div class="progress-bar-container">
  <div 
    class="progress-bar" 
    :style="{ width: isValidRate ? rate + '%' : '0%' }"
  ></div>
</div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    machineName: String,
    spc: Number,
    completed: String,
    rate: {
      type: [Number, null],
      default: null
    }
  });

  const isValidRate = props.rate !== null && props.rate !== undefined && !isNaN(props.rate);
  </script>
  
  <style scoped>
  .machine-progress {
  padding: 0.5vh 1vw;
  background: #2575fc ;
  border-radius: 1vw;
  box-shadow: 0 0.2vw 0.4vw rgba(0, 0, 0, 0.2);
  width: 10vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff; /* 白色字体 */
}

h3 {
  font-size: 0.8vw;
  font-weight: 600;
  margin: 0;
}

.progress-item {
  font-size: 0.8vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

strong {
  font-weight: 600;
  color: #fff;
  font-size: 0.6vw;
}

.progress-bar-container {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1vh;
  height: 0.8vh;
  width: 100%;
  margin-top: 0.5vh;
}

.progress-bar {
  height: 100%;
  border-radius: 1vh;
  background: goldenrod
}
span{
    font-size: 0.6vw;
}

  </style>
  