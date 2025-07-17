<template>
<dv-border-box11 :animate="false">
    <div class="flex flex-row h-[30vh]" >
        <div ref="Indicators1" class="w-full h-[100%]"></div>
        <div ref="Indicators2" class="w-full h-[100%]"></div>
    </div>
</dv-border-box11>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { createGaugeOption } from './charts';
import { useEcharts } from '@/utils/useEcharts';

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
.flex {
    display: flex;
}
.flex-row {
    flex-direction: row;
}
.w-full {
    width: 100%;
}
.h-[30vh] {
    height: 30vh;
}
.h-[100%] {
    height: 100%;
}
</style>