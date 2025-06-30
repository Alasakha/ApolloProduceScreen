<template>
  <div class="data-card">
    <div class="title h-[20%] text-white" :style="{ fontSize: titleFontSize + 'vw' }">{{ title }}</div>
    <div class="square-box" :style="{ height: squareHeight+'%'  }">
      <dv-decoration-9 class="w-full h-full"
      :color="[backgroundcolor1, backgroundcolor2]">
      <div class="content" :style="{ color: color, fontSize: valueFontSize + 'vw' }">
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
  titleFontSize: { type: Number, default: 0.7 },  // 标题字体大小，单位vw
  valueFontSize: { type: Number, default: 1.2 },  // 数值字体大小，单位vw
  squareHeight: { type: Number, default: 80 },  // 方形框高度，单位%
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
  background: rgba(255, 255, 255, 0.1);
}

.title {
  font-weight: bold;
}

.square-box {
  height: 70%;
  aspect-ratio: 1;
}

.content {
  text-shadow: 0 0 3px #7acaec;
  z-index: 10000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
