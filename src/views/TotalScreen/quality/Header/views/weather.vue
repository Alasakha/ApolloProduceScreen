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
  <div
    class="weather-bar flex items-center px-2 w-[50%] py-2 rounded-xl justify-center  "
    style="
      background: linear-gradient(90deg, rgba(79,142,247,0.7) 0%, rgba(30,60,114,0.7) 100%);
      min-width: 320px;
      box-shadow: 0 0 16px 2px rgba(79,142,247,0.4);
      border: 1.5px solid rgba(79,142,247,0.3);
      backdrop-filter: blur(2px);
      color: #fff;
    "
  >
    <span class="text-5xl mr-4 drop-shadow">{{ icon }}</span>
    <div class="flex flex-col mr-6">
      <span class="text-3xl font-bold leading-tight flex items-center">
        {{ temperature }}°C
        <span class="ml-3 text-lg font-normal">{{ weatherData.condition }}</span>
      </span>
      <span class="text-sm opacity-80 mt-1 flex items-center">
        <span>{{ weatherData.city || '未知城市' }}</span>
        <span v-if="weatherData.time" class="ml-4">{{ weatherData.time }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.weather-bar {
  font-family: 'Source Han Sans', 'Microsoft YaHei', Arial, sans-serif;
  letter-spacing: 1px;
  transition: box-shadow 0.3s;
}
.weather-bar:hover {
  box-shadow: 0 0 24px 4px rgba(79,142,247,0.6);
}
</style>