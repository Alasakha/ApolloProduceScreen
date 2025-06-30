<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getWeather } from '@/api/getScmInfo.js';

const weatherData = ref('');
const icon = ref('');
const temperature = ref('');
let intervalId = null; // 用于存储定时器 ID

// 图标映射
const weatherIcons = {
  "晴": "🌞",
  "阴": "☁️",
  "雨": "🌧️",
  "雪": "❄️",
  "雷": "⚡"
};

const fetchData = () => {
  getWeather().then((res) => {
    if (res.code === 200) {
      weatherData.value = res.data;

      // 获取当前天气状况
      const condition = weatherData.value.condition;
      temperature.value = weatherData.value.temperature;

      // 显示相应的图标
      icon.value = weatherIcons[condition] || "🌍"; // 默认图标

    } else {
      console.error('Error fetching weather data:', res.statusText);
    }
  }).catch((error) => {
    console.error('Error fetching weather data:', error);
  });
};

onMounted(() => {
  fetchData(); // 初次加载时获取数据

  // 每半小时请求一次更新
  intervalId = setInterval(() => {
    fetchData();
  }, 30 * 60 * 1000); // 30 分钟 = 30 * 60 * 1000 毫秒
});

onBeforeUnmount(() => {
  // 清除定时器，避免组件销毁后仍然运行
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="text-white text-5xl flex flex-row items-center items-center w-[40%] h-[90%] pr-4">
  <dv-border-box-3 >
    <div class="flex justify-center items-center w-full h-full">
          {{ icon }}{{ weatherData.condition }} {{ temperature }}°C

    </div>

  </dv-border-box-3>
  </div>
</template>

<style scoped>
/* 自定义样式，如果需要的话 */
</style>