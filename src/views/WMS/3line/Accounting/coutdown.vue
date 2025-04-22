<template>

        <div class="count">{{ countdown }}</div>

    
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  
  // 接收一个目标时间的 prop，默认为每天的 17:00
  const props = defineProps({
    targetTime: {
      type: [Date, String], // 支持 Date 和 String 类型
      default: () => {
        const now = new Date();
        const target = new Date(now);
        target.setHours(17, 0, 0, 0); // 设置为每天17:00
        return target;
      }
    }
  });
  
  const countdown = ref('');
  
  // 将 targetTime 转换为 Date 类型
  const getTargetDate = () => {
    let targetDate: Date;
    console.log(props.targetTime )
    if (props.targetTime instanceof Date) {
      targetDate = props.targetTime;
     
    } else if (typeof props.targetTime === 'string') {
      targetDate = new Date(props.targetTime); // 如果是字符串类型则转换为 Date
    } else {
      targetDate = new Date(); // 默认值为当前时间
    }
  
    if (isNaN(targetDate.getTime())) {
      console.error('Invalid targetTime:', props.targetTime);
      return new Date(); // 如果目标时间无效，返回当前时间
    }
  
    return targetDate;
  };
  
  // 更新倒计时
  const updateCountdown = () => {
    const target = getTargetDate();
    const now = new Date();
    const timeDiff = target.getTime() - now.getTime(); // 计算时间差
    if (timeDiff <= 0) {
      countdown.value = '今天已经结束';
      return;
    }
  
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
    countdown.value = `及时率生成倒计时：${hours}小时 ${minutes}分钟 ${seconds}秒`;
  };
  
  // 每秒更新倒计时
  let countdownInterval: number;
  onMounted(() => {
    countdownInterval = setInterval(updateCountdown, 1000); // 每秒更新倒计时
    updateCountdown(); // 初始化时立刻更新一次
  });
  
  // 清理倒计时定时器
  onBeforeUnmount(() => {
    clearInterval(countdownInterval); // 清除定时器
  });
  
  // 监听 targetTime 变化，及时更新倒计时
  watch(() => props.targetTime, () => {
    updateCountdown();
  });
  </script>



<style>

.count{
    font-family: 'Source Han Sans', sans-serif;
    color: #53eafd;
}
</style>
  