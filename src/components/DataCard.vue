<template>
  <div class="data-card">
    <div class="title h-[20%]  text-white">{{ title }}</div>
    <div class="square-box">
      <dv-decoration-9 class="w-full h-full"
      :color="[backgroundcolor1, backgroundcolor2]">
      <div class="content" :style="{ color: color }">
  {{ value }}{{ unit }}
</div>
      </dv-decoration-9>
    </div>
  </div>
</template>

<script setup>
import { onMounted ,nextTick} from 'vue';

defineProps({
  title: String,  // 标题
  value: [String, Number],  // 数值
  unit: { type: String, default: "" },  // 单位（可选）
  backgroundcolor1:{ type :String, default: '#23A7DC'},
  backgroundcolor2:{ type :String, default: '#0a8ebd'},
  color:{ type :String, default: '#00FFFF	'},
});



onMounted(() => {
  nextTick(() => {
    let count = 0;
    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
      count++;
      if (count > 5) clearInterval(interval);
    }, 200); // 每 200ms 触发一次，总共 5 次
  });
});
</script>

<style scoped>
.data-card {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  font-size: 1vw;
  background: rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 0.7vw;
  font-weight: bold;
}

.square-box {
  height: 80%;
  aspect-ratio: 1;
}

.content {
  font-size: 1.2vw;
  text-shadow: 0 0 3px #7acaec;
  z-index: 10000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
