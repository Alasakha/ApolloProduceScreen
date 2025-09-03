<template>  
  <div class="flex w-full h-full p-2 box-border text-white relative">
    <!-- 加载状态指示器 -->
    <div v-if="isLoading" class="absolute inset-0   flex items-center justify-center z-10">
      <div class="text-cyan-300 text-lg">加载中...</div>
    </div>
    
    <!-- 左侧数据组 -->
    <div class="flex-1 flex flex-col justify-center items-center space-y-2">
      <div class="text-center">
        <div class="text-base font-bold text-cyan-300 tracking-wide drop-shadow-lg mb-1"
          style="letter-spacing: 1px;">
          {{ props.title1 }}
        </div>
        <div ref="Indicators1" class="w-28 h-28 mx-auto"></div>
      </div>
    </div>
    
    <!-- 中间分隔线 -->
    <div class="w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent mx-1"></div>
    
    <!-- 右侧数据组 -->
    <div class="flex-1 flex flex-col justify-center items-center space-y-2">
      <div class="text-center">
        <div class="text-base font-bold text-cyan-300 tracking-wide drop-shadow-lg mb-1"
          style="letter-spacing: 1px;">
          {{ props.title2 }}
        </div>
        <div ref="Indicators2" class="w-28 h-28 mx-auto cursor-pointer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { createGaugeOption } from './charts';
import { useEcharts } from '@/utils/useEcharts';

const props = defineProps({
  title1: {
      type: String,
      required: true
  },
  title2:{
    type: String,
    required: true
  },
  data1: {
    type: Number,
    required: true
  },
  data2: {
    type: Object,
    required: true,
    default: () => ({
      data: 0,
      max: 100
    })
  }
});

const Indicators1 = ref(null);
const Indicators2 = ref(null);
const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);

// 加载状态
const isLoading = ref(true);

// 存储清理函数
const cleanupFunctions = ref<{
  chart1: (() => void) | null;
  chart2: (() => void) | null;
}>({
  chart1: null,
  chart2: null
});

const drawChart = () => {
  // 第一个图表
  const { option: option1, startAnimation } = createGaugeOption({
    text: props.title1,
    data: props.data1,
    max: Math.max(props.data1, 100) // 确保max至少为100
  });

  // 第二个图表
  const { option: option2, startAnimation: startAnimation2 } = createGaugeOption({
    text: props.title2,
    data: props.data2.data,
    max: Math.max(props.data2.max, 100) // 确保max至少为100
  });

  // 直接设置图表选项，减少延迟
  chart1.setOption(option1);
  chart2.setOption(option2);

  // 启动动画
  requestAnimationFrame(() => {
    cleanupFunctions.value.chart1 = startAnimation(chart1);
    cleanupFunctions.value.chart2 = startAnimation2(chart2);
  });
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    
    // 等待DOM更新
    await nextTick();
    
    // 初始化图表
    chart1.initChart();
    chart2.initChart();
    
    // 绘制图表
    drawChart();
    
    // 调整图表大小
    chart1.resizeChart();
    chart2.resizeChart();
    
    // 完成加载
    isLoading.value = false;
  } catch (error) {
    console.error('初始化图表失败:', error);
    isLoading.value = false;
  }
};

// 监听数据变化，重新绘制图表
watch([() => props.data1, () => props.data2.data], () => {
  // 移除条件判断，确保数据变化时总是重绘
  drawChart();
});

onMounted(() => {
  fetchData();
});

// 清理动画
onBeforeUnmount(() => {
  if (cleanupFunctions.value.chart1) {
    cleanupFunctions.value.chart1();
  }
  if (cleanupFunctions.value.chart2) {
    cleanupFunctions.value.chart2();
  }
});
</script>

<style scoped>
/* 图表容器样式 */
.w-28 {
  width: 7rem;
  height: 7rem;
}

/* 悬停效果 */
.w-28:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

/* 分隔线动画效果 */
.w-px {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(34, 211, 238, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.8);
  }
}

/* 标题文字阴影增强 */
.text-cyan-300 {
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
}

/* 容器悬停效果 */
.flex-1:hover {
  /* background: rgba(34, 211, 238, 0.05); */
  border-radius: 8px;
  transition: background 0.3s ease;
}
</style>