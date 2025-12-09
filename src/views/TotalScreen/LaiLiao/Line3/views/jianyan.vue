<template>
    <div class="content  w-[20%] h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="新品来料合格率" />
                <TooltipInfo
                    class="ml-2"
                    tooltip-content="展示各产线新品来料合格率"
                    :detail-content="tooltipDetailContent"
                    dialog-title="指标说明"
                    placement="right"
                >
                    <template #detail>
                        <div class="detail-content">
                            <h3 class="text-lg  font-bold mb-4">数据说明</h3>
                            <ul class="list-disc pl-4 space-y-2">
                                <li>统计周期：实时更新</li>
                                <li>数据来源：质检部门检验系统</li>
                                <li>指标：合格率（合格数/总数）</li>
                                <li>用途：呈现各产线新品来料合格率</li>
                            </ul>
                        </div>
                    </template>
                </TooltipInfo>
            </div>

        <!-- 图表容器 -->
        <div class="chartsbox w-full h-[90%] mt-4">
            <div v-if="!isDataEmpty" ref="chartRef" class="w-full h-full"></div>
            <div v-else class="w-full h-full flex items-center justify-center text-white text-2xl">暂无数据</div>
            <transition name="fade">
                <div v-if="isLoading" class="loading-mask">
                    <dv-loading>
                        <div class="loading-text">数据加载中...</div>
                    </dv-loading>
                </div>
            </transition>
        </div>  
        </dv-border-box8>
        <DetailDialog
            v-model="dialogVisible"
            :title="dialogTitle"
            :loading="tableLoading"
            :data="detailData"
            :columns="tableColumns"
            max-width="95%"
            max-height="70vh"
        />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getNewProdOkRate, getNewProdOkRateDetail } from '@/api/getQuiltyinfo';
import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './charts2';
import { ElMessage } from 'element-plus';
import { useEcharts } from '@/utils/useEcharts';
import TooltipInfo from '@/components/SCM/TooltipInfo/index.vue';
import DetailDialog from '@/components/SCM/DetailDialog/index.vue';

const isDataEmpty = ref(false);
const isLoading = ref(false);
const chartRef = ref<HTMLElement | null>(null);

const { initChart, setOption, resizeChart, onClick, offClick } = useEcharts(chartRef);
const processedData = ref<any[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref('异常详情');
const tableLoading = ref(false);
const detailData = ref<any[]>([]);
const selectedCx = ref('');
const detailRequestId = ref(0);

const tableColumns = [
    { prop: '送检人', label: '送检人', width: 120 },
    { prop: '检验日期', label: '检验日期', width: 140 },
    { prop: '检验单号', label: '检验单号', width: 180 },
    { prop: '客户等级', label: '客户等级', width: 150 },
    { prop: '品号', label: '品号', width: 180 },
    { prop: '品名', label: '品名', width: 250 },
    { prop: '规格', label: '规格', width: 400 }
];

const drawWeeklyChart = (formattedData: any[]) => {
    nextTick(() => {
        const option = createChartOption(formattedData);
        initChart();
        setOption(option);
        offClick(handleBarClick);
        onClick(handleBarClick);
    });
};

const processData = (dataList: any[] = []) => {
    const formatted = dataList.map((item: any) => {
        const cx = item?.cx || '未知';
        const okCount = item?.okCount ?? 0;
        const total = item?.total ?? 0;
        const rate = total > 0 ? (okCount / total) * 100 : 0;
        return {
            label: cx,
            rate: Number(rate.toFixed(2))
        };
    });

    processedData.value = formatted;
    isDataEmpty.value = formatted.length === 0;
    drawWeeklyChart(formatted);
};

const transformDetailData = (list: any[] = []) =>
    list.map((item) => ({
        '送检人': item?.['送检人'] || '--',
        '检验日期': item?.['检验日期'] || '--',
        '检验单号': item?.['检验单号'] || '--',
        '客户等级': item?.['客户等级'] || '--',
        '品号': item?.['品号'] || '--',
        '品名': item?.['品名'] || '--',
        '规格': item?.['规格'] || '--'
    }));

const handleBarClick = async (params: any) => {
    if (!params?.name) return;
    selectedCx.value = params.name;
    dialogTitle.value = `${params.name} 新品来料合格率详情`;
    dialogVisible.value = true;
    const requestId = ++detailRequestId.value;
    tableLoading.value = true;
    try {
        const res = await getNewProdOkRateDetail(params.name);
        if (requestId !== detailRequestId.value) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        detailData.value = transformDetailData(list);
        if (detailData.value.length === 0) {
            ElMessage.info('暂无相关数据');
        }
    } catch (error) {
        if (requestId === detailRequestId.value) {
            detailData.value = [];
            ElMessage.error('获取详情失败');
        }
        console.error('获取详情失败：', error);
    } finally {
        if (requestId === detailRequestId.value) {
            tableLoading.value = false;
        }
    }
};

const fetchData = async () => {
    isLoading.value = true;
    try {
        const res = await getNewProdOkRate();
        const list = Array.isArray(res?.data) ? res.data : [];
        processData(list);
    } catch (error) {
        console.error('获取新品来料合格率数据失败：', error);
        isDataEmpty.value = true;
        processedData.value = [];
        ElMessage.error('获取新品来料合格率数据失败');
        drawWeeklyChart([]);
    } finally {
        isLoading.value = false;
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
    offClick(handleBarClick);
});

const tooltipDetailContent = `
新品来料合格率说明：
1. 统计周期：实时更新
2. 计算公式：合格率 = 合格数 / 总数 × 100%
3. 指标：各产线新品来料合格率（百分比）
4. 用途：监控各产线新品来料合格率情况
`;
</script>

<style scoped>
.chartsbox {
    position: relative;
}

.loading-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(9, 22, 47, 0.8);
    z-index: 10;
}

.loading-text {
    margin-top: 8px;
    font-size: 14px;
    color: #fff;
    letter-spacing: 2px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>