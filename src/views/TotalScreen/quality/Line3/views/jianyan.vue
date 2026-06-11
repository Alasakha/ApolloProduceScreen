<template>
    <div class="content  w-[20%] h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="不良问题次数推移图" />
                <TooltipInfo
                    class="ml-2"
                    tooltip-content="展示最近几周功能性/他数量不良问题"
                    :detail-content="tooltipDetailContent"
                    dialog-title="指标说明"
                    placement="right"
                >
                    <template #detail>
                        <div class="detail-content">
                            <h3 class="text-lg  font-bold mb-4">数据说明</h3>
                            <ul class="list-disc pl-4 space-y-2">
                                <li>统计周期：按自然周更新</li>
                                <li>数据来源：质检部门检验系统</li>
                                <li>指标：功能性不良数量、他数量</li>
                                <li>用途：呈现周度不良问题趋势</li>
                            </ul>
                        </div>
                    </template>
                </TooltipInfo>
            </div>

            <!-- 图表容器 -->
            <div class="chartsbox w-full h-[90%] mt-4">
                <div v-if="!isDataEmpty" ref="chartRef" class="w-full h-full"></div>
                <div v-else class="w-full h-full flex items-center justify-center text-white text-2xl">暂无数据</div>
            </div>  
        </dv-border-box8>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getTopDayInspectorWeek } from '@/api/getQuiltyinfo';
// import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './charts2';
import { ElMessage } from 'element-plus';
import { useEcharts } from '@/utils/useEcharts';
import TooltipInfo from '@/components/SCM/TooltipInfo/index.vue';

const isDataEmpty = ref(false);
const chartRef = ref<HTMLElement | null>(null);

const { initChart, setOption, resizeChart } = useEcharts(chartRef);
const processedData = ref<any[]>([]);

const drawWeeklyChart = (formattedData: any[]) => {
    nextTick(() => {
        const option = createChartOption(formattedData);
        initChart();
        setOption(option);
    });
};

const formatDateLabel = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
};

const processData = (dataList: any[] = []) => {
    const formatted = dataList.map((item: any) => {
        const weekNumber = item?.weekNumber;
        const label = weekNumber ? `第${weekNumber}周` : '未知';
        const rangeStart = formatDateLabel(item?.monday);
        const rangeEnd = formatDateLabel(item?.sunday);
        const range = rangeStart || rangeEnd ? `${rangeStart}~${rangeEnd}` : '';
        const performance = item?.topInspectorList?.performanceTotal ?? 0;
        const nonPerformance = item?.topInspectorList?.nonPerformanceTotal ?? 0;
        return {
            label,
            range,
            performance,
            nonPerformance
        };
    });

    processedData.value = formatted;
    isDataEmpty.value = formatted.length === 0;
    drawWeeklyChart(formatted);
};

const fetchData = async () => {
    try {
        const res = await getTopDayInspectorWeek();
        const list = Array.isArray(res?.data) ? res.data : [];
        processData(list);
    } catch (error) {
        console.error('获取不良问题数据失败：', error);
        isDataEmpty.value = true;
        processedData.value = [];
        ElMessage.error('获取不良问题数据失败');
        drawWeeklyChart([]);
    }
};

onMounted(() => {
    fetchData();
    window.addEventListener('resize', resizeChart);
    // eventBus.on('refreshData', fetchData);
});

onBeforeUnmount(() => {
    // eventBus.off('refreshData', fetchData);
    window.removeEventListener('resize', resizeChart);
});

const tooltipDetailContent = `
不良问题次数推移说明：
1. 统计周期：按周更新（周一~周日）
2. 指标一：功性能数量（功能性不良次数）
3. 指标二：他数量（其他类型不良次数）
4. 用途：监控不良问题的周度趋势
`;
</script>



