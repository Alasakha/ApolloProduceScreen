<template>
  <div class="weather-widget">
    <span class="weather-icon">{{ icon }}</span>
    <span class="weather-info">{{ weatherData.condition }} {{ temperature }}°C</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getWeather } from '@/api/getScmInfo.js'

const weatherData = ref<any>({})
const icon = ref('')
const temperature = ref('')
let intervalId: NodeJS.Timeout | null = null

// 图标映射
const weatherIcons: Record<string, string> = {
  '晴': '🌞',
  '阴': '☁️',
  '雨': '🌧️',
  '雪': '❄️',
  '雷': '⚡',
  '多云': '⛅'
}

const fetchData = () => {
  getWeather().then((res: any) => {
    if (res.code === 200) {
      weatherData.value = res.data
      const condition = res.data.condition || ''
      temperature.value = res.data.temperature || ''
      icon.value = weatherIcons[condition] || '🌍'
    } else {
      console.error('Error fetching weather data:', res.statusText)
    }
  }).catch((error) => {
    console.error('Error fetching weather data:', error)
  })
}

onMounted(() => {
  fetchData()
  // 每半小时请求一次更新
  intervalId = setInterval(fetchData, 30 * 60 * 1000)
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.weather-widget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #00d4ff;
  font-size: 1.2vw;
}

.weather-icon {
  font-size: 1.5vw;
}
</style>
