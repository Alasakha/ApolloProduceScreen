<template>
    <dv-border-box13 class="w-full h-full">
      <div class="flex  w-full h-full p-2 box-border text-white">
        <div
  class="flex-1 flex justify-center items-center w-full text-lg font-bold text-cyan-300 tracking-wide drop-shadow-lg py-2"
  style="letter-spacing: 2px;"
>
  {{ props.title1 }}
</div>
        <div class="flex-1">
          <div ref="Indicators1" class="w-full h-full "></div>
        </div>
        <div
  class="flex-1 flex justify-center items-center text-lg font-bold text-cyan-300 tracking-wide drop-shadow-lg py-2"
  style="letter-spacing: 2px;"
>
  {{ props.title1 }}
</div>
        <div class="flex-1">
          <div ref="Indicators2" class="w-full h-full"></div>
        </div>
      </div>
    </dv-border-box13>
  </template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { createGaugeOption } from './charts';
import { useEcharts } from '@/utils/useEcharts';

const props = defineProps({
    title1: {
        type: String,
        required: true
    },
    title2: {
        type: String,
        required: true
    }
})
const Indicators1 = ref(null);
const Indicators2 = ref(null);
const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);

// 存储清理函数
const cleanupFunctions = ref<{
    chart1: (() => void) | null;
    chart2: (() => void) | null;
}>({
    chart1: null,
    chart2: null
});

const drawChart = () => {
    const { option: option1, startAnimation } = createGaugeOption({
        text: "图表1",
        data: 75,
        max: 100
    });
    const { option: option2, startAnimation: startAnimation2 } = createGaugeOption({
        text: "图表2",
        data: 85,
        max: 100
    });

    // 使用nextTick确保DOM已更新
    nextTick(() => {
        chart1.setOption(option1);
        chart2.setOption(option2);

        // 启动动画
        requestAnimationFrame(() => {
            cleanupFunctions.value.chart1 = startAnimation(chart1);
            cleanupFunctions.value.chart2 = startAnimation2(chart2);
        });
    });
};

const fetchData = async () => {
    try {
        // 初始化图表
        await Promise.all([
            chart1.initChart(),
            chart2.initChart()
        ]);
        drawChart();
    } catch (error) {
        console.error('初始化图表失败:', error);
    }
};

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

</style>