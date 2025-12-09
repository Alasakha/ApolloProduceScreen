<template>
    <div class="content  w-[20%] h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="月度技术交底完成率" />
                <TooltipInfo
                    class="ml-2"
                    tooltip-content="展示月度技术交底计划按状态的完成情况"
                    :detail-content="tooltipDetailContent"
                    dialog-title="指标说明"
                    placement="right"
                >
                    <template #detail>
                        <div class="detail-content">
                            <h3 class="text-lg  font-bold mb-4">数据说明</h3>
                            <ul class="list-disc pl-4 space-y-2">
                                <li>统计周期：按月统计（截止当前月末）</li>
                                <li>数据来源：技术交底系统</li>
                                <li>指标：按状态统计完成率（完成/延期等）</li>
                                <li>点击饼图可查看对应任务明细</li>
                            </ul>
                        </div>
                    </template>
                </TooltipInfo>
            </div>

            <!-- 图表容器 -->
            <div class="chartsbox relative w-full h-[90%] mt-4">
                <div ref="chartRef" class="w-full h-full"></div>
                <div
                    v-if="isLoading"
                    class="absolute inset-0 flex items-center justify-center text-white text-2xl bg-black/20"
                >
                    加载中...
                </div>
                <div
                    v-else-if="isDataEmpty"
                    class="absolute inset-0 flex items-center justify-center text-white text-2xl bg-black/20"
                >
                    暂无数据
                </div>
            </div>  
        </dv-border-box8>
        <TableDialog
            v-model="dialogVisible"
            :title="dialogTitle"
            :tableData="detailData"
            :columns="detailColumns"
        />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getJsjdCompletePie, getJsjdComplete } from '@/api/getQuiltyinfo';
import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './data';
import { ElMessage } from 'element-plus';
import { useEcharts } from '@/utils/useEcharts';
import TooltipInfo from '@/components/SCM/TooltipInfo/index.vue';
import TableDialog from '../components/dialog.vue';

const chartRef = ref<HTMLElement | null>(null);

const { initChart, setOption, onClick, offClick, resizeChart } = useEcharts(chartRef);
const isLoading = ref(false);
const isDataEmpty = ref(false);
const pieData = ref<any[]>([]);

const dialogVisible = ref(false);
const dialogTitle = ref('月度技术交底计划明细');
const detailData = ref<any[]>([]);
const currentDetailRequestId = ref(0);

const detailColumns = [
    { prop: 'pno', label: '任务编号', width: 180 },
    { prop: 'projName', label: '项目名称', width: 260 },
    { prop: 'taskName', label: '任务名称', width: 220 },
    { prop: 'executant', label: '执行人', width: 120 },
    { prop: 'expectTime', label: '计划完成时间', width: 180 },
    { prop: 'completeTime', label: '实际完成时间', width: 180 },
    { prop: 'sts', label: '状态', width: 100 },
];

const STATUS_LABEL_MAP: Record<string, string> = {
    C: '已完成',
    E: '进行中',
    N: '未完成',
};

const formatPieData = (dataList: any[] = []) => {
    return dataList
        .map(item => {
            const rawSts = item?.sts ?? '';
            const value = Number(item?.total ?? 0);
            return {
                name: STATUS_LABEL_MAP[rawSts] || rawSts || '未知',
                value,
                rawSts,
            };
        })
        .filter(item => item.value > 0);
};

const drawPieChart = (formattedData: any[]) => {
    nextTick(() => {
        initChart();
        const option = createChartOption('', formattedData);
        setOption(option);
        offClick(handleChartClick);
        onClick(handleChartClick);
    });
};

const fetchData = async () => {
    isLoading.value = true;
    try {
        const res = await getJsjdCompletePie();
        const list = Array.isArray(res?.data) ? res.data : [];
        const formatted = formatPieData(list);
        pieData.value = formatted;
        isDataEmpty.value = formatted.length === 0;
    } catch (error) {
        console.error('获取月度技术交底完成率数据失败：', error);
        isDataEmpty.value = true;
        pieData.value = [];
        ElMessage.error('获取月度技术交底完成率数据失败');
    } finally {
        isLoading.value = false;
        drawPieChart(pieData.value);
    }
};

const handleChartClick = async (params: any) => {
    const sts = params?.data?.rawSts;
    if (!sts) return;
    const requestId = ++currentDetailRequestId.value;
    dialogVisible.value = true;
    dialogTitle.value = `${STATUS_LABEL_MAP[sts] || sts} - 月度技术交底计划明细`;
    detailData.value = [];
    try {
        const res = await getJsjdComplete(sts);
        if (requestId !== currentDetailRequestId.value) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        detailData.value = list.map(item => ({
            ...item,
            sts: STATUS_LABEL_MAP[item?.sts] || item?.sts || '--',
        }));
    } catch (error) {
        if (requestId !== currentDetailRequestId.value) return;
        console.error('获取月度技术交底计划明细失败：', error);
        detailData.value = [];
        ElMessage.error('获取月度技术交底计划明细失败');
    }
};

onMounted(() => {
    fetchData();
    window.addEventListener('resize', resizeChart);
    eventBus.on('refreshData', fetchData);
});

onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchData);
    window.removeEventListener('resize', resizeChart);
    offClick(handleChartClick);
});

const tooltipDetailContent = `
月度技术交底完成率说明：
1. 统计周期：按月汇总（截至当前月末）
2. 指标：按状态统计（已完成/延期等）
3. 点击饼图可查看对应任务明细
4. 数据来源：交底计划系统
`;
</script>



