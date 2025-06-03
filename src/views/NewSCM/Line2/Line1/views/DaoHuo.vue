<template>
    <div class="content w-full h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="到货不及时各采购员占比" :size="1"/>
                <TooltipInfo
                    class="ml-2"
                    tooltip-content="显示各采购员的到货不及时情况统计"
                    :detail-content="tooltipDetailContent"
                    dialog-title="指标说明"
                    placement="right"
                >
                    <template #detail>
                        <div class="detail-content">
                            <h3 class="text-lg font-bold mb-4">数据说明</h3>
                            <ul class="list-disc pl-4 space-y-2">
                                <li>统计周期：每日更新</li>
                                <li>数据来源：系统到货记录</li>
                                <li>计算方式：延迟到货数/总到货数</li>
                                <li>点击饼图可查看详细记录</li>
                            </ul>
                        </div>
                    </template>
                </TooltipInfo>
            </div>

            <div class="chartsbox w-full h-[17vh] mt-4">
                <div v-if="!isDataEmpty" ref="chartRef" class="w-full h-full"></div>
                <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">今日暂无数据</div>
            </div>  
        </dv-border-box8>
    </div>

    <!-- 使用通用详情弹窗组件 -->
    <DetailDialog
        v-model="dialogVisible"
        :title="`${selectedPurchaser}的到货不及时详情`"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
    />
</template>

<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getDeliveryRat } from '@/api/getnewInjection';
import { getPurchaseDeliveryRateDetail } from '@/api/getScmInfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import { useEcharts } from '@/utils/useEcharts';
import { ElMessage } from 'element-plus';
import DetailDialog from '@/components/SCM/DetailDialog/index.vue';
import { createChartOption } from './leftcharts';
import TooltipInfo from '@/components/SCM/TooltipInfo/index.vue'

const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const queryDate = getYesterday();
const isLoading = ref(true);
const isDataEmpty = ref(false);
const chartRef = ref(null);

// 使用 useEcharts
const { initChart, setOption, onClick, offClick } = useEcharts(chartRef);

// 详情弹窗相关
const dialogVisible = ref(false);
const tableLoading = ref(false);
const detailData = ref([]);
const selectedPurchaser = ref('');
const currentRequestId = ref(0); // 添加请求标识符

// 表格列配置
const tableColumns = [
    { label: '客户单号', prop: 'udf021' },
    { label: '供应商', prop: 'supplier_full_name' },
    { label: '采购员', prop: 'employee_name' },
    { label: '采购单号', prop: 'doc_no' },
    { label: '品号', prop: 'item_code' },
    { label: '品名', prop: 'item_description' },
    { label: '规格', prop: 'item_specification' },
    { label: '预到货日', prop: 'plan_arrival_date' },
];

// 处理饼图点击事件
const handleChartClick = async (params) => {
    if (params && params.name) {
        const requestId = ++currentRequestId.value; // 生成新的请求ID
        selectedPurchaser.value = params.name;
        tableLoading.value = true;
        dialogVisible.value = true;
        
        try {
            const res = await getPurchaseDeliveryRateDetail(queryDate, params.name);
            // 检查这个请求是否是最新的
            if (requestId === currentRequestId.value) {
                if (res.data && Array.isArray(res.data)) {
                    detailData.value = res.data;
                } else {
                    detailData.value = [];
                    ElMessage.warning('暂无详细数据');
                }
            }
        } catch (error) {
            if (requestId === currentRequestId.value) {
                ElMessage.error('获取详情失败，请重试');
                detailData.value = [];
            }
        } finally {
            if (requestId === currentRequestId.value) {
                tableLoading.value = false;
            }
        }
    }
};

// 渲染图表的函数
const drawMonthlyIndicators = (formattedData) => {
    nextTick(() => {
        const option = createChartOption(formattedData);
        initChart(); // 初始化图表实例
        setOption(option); // 设置配置
        offClick(handleChartClick); // 先移除之前的事件监听
        onClick(handleChartClick); // 添加新的事件监听
    });
};

// 处理数据
const processData = (data) => {
    const formattedData = formatPieChartData(data, 'purchaserName', 'bjsNum');
    const processedData = formattedData
        .filter(item => item.value !== 0)
        .sort((a, b) => b.value - a.value);

    if (processedData.length === 0) {
        isDataEmpty.value = true;
    } else {
        isDataEmpty.value = false;
        drawMonthlyIndicators(processedData);
    }
};

// 请求数据
const fetchData = () => {
    getDeliveryRat(queryDate).then(res => {
        isLoading.value = false;
        processData(res.data);
    }).catch(() => {
        isLoading.value = false;
        isDataEmpty.value = true;
    });
};

onMounted(() => {
    fetchData();
    eventBus.on("refreshData", fetchData);
});

onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData);
});

// 提示组件的详细内容
const tooltipDetailContent = `
到货不及时统计说明：
1. 数据更新频率：每日更新
2. 统计范围：所有采购员的到货记录
3. 计算方式：延迟到货数/总到货数
4. 点击饼图可查看具体延迟记录
`;
</script>

<style scoped>
</style>
  
  
  