<template>
  <dv-border-box1 class="time">
    <div class="dateTime">
      <div class="date">{{dateStr}}</div>
      <div class="time-text">{{timeStr}}</div>
    </div>
  </dv-border-box1>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const dateStr = ref('');
const timeStr = ref('');
let timeTrim = null;

// 获取当前日期、时间的函数
const getNowFormatDate = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // 补零处理
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }

  // 获取星期
  const weekArray = ["日", "一", "二", "三", "四", "五", "六"];
  const week = date.getDay();
  const weekDay = "星期" + weekArray[week];

  // 分别设置日期和时间
  dateStr.value = `${date.getFullYear()}年${month}月${strDate}日 ${weekDay}`;
  timeStr.value = `${hours}:${minutes}`;
};

// 初始化时间
getNowFormatDate();

onMounted(() => {
  timeTrim = setInterval(() => {
    getNowFormatDate();
  }, 5000);
});

onBeforeUnmount(() => {
  if (timeTrim) {
    clearInterval(timeTrim);
  }
});
</script>

<style scoped>
.time {
  width: 100%;  /* 使用固定宽度替代vw */
  height: 100%; /* 使用固定高度替代vh */
  position: relative;
}

.dateTime {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: 'LedFont';
  letter-spacing: 3px;
  color: #FEFEFE;
  width: 90%;  /* 确保内容不会超出边框 */
}

.date {
  font-size: 1vw;
  white-space: nowrap;  /* 防止文字换行 */
}

.time-text {
  font-size: 2vw;
  font-weight: bold;
  color: #40a9ff;
}

</style>