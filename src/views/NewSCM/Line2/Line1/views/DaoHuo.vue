<template>
    <div class="content w-full h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="到货不及时各采购员占比(A类,常规类)" :size="1"/>
                A
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

            <div class="charts-container w-full h-[17vh] mt-4 flex gap-4">
                <!-- A类订单图表 -->
                <div class="chart-wrapper flex-1">
                    <!-- <div class="chart-title text-white text-sm mb-2 text-center">A类订单统计</div> -->
                    <div class="chart-box w-full h-full">
                        <div v-if="!isDataEmpty" ref="aChartRef" class="w-full h-full"></div>
                        <div v-else class="w-full h-full flex items-center justify-center text-white text-lg">暂无数据</div>
                    </div>
                </div>
                
                <!-- 常规订单图表 -->
                <div class="chart-wrapper flex-1">
                    <!-- <div class="chart-title text-white text-sm mb-2 text-center">常规订单统计</div> -->
                    <div class="chart-box w-full h-full">
                        <div v-if="!isDataEmpty" ref="bChartRef" class="w-full h-full"></div>
                        <div v-else class="w-full h-full flex items-center justify-center text-white text-lg">暂无数据</div>
                    </div>
                </div>
            </div>  
        </dv-border-box8>
    </div>

    <!-- 使用通用详情弹窗组件 -->
    <DetailDialog
        v-model="dialogVisible"
        :title="`${selectedPurchaser}的异常订单详情`"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
    />
</template>

<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getPmcKpi, getPmcKpiList } from '@/api/getScmInfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { useEcharts } from '@/utils/useEcharts';
import { ElMessage } from 'element-plus';
import DetailDialog from '@/components/SCM/DetailDialog/index.vue';
import { createChartOption } from './leftcharts';
import TooltipInfo from '@/components/SCM/TooltipInfo/index.vue'

const isLoading = ref(true);
const isDataEmpty = ref(false);
const aChartRef = ref(null);
const bChartRef = ref(null);

// 使用 useEcharts 为两个图表
const { initChart: initAChart, setOption: setAOption, onClick: onAClick, offClick: offAClick } = useEcharts(aChartRef);
const { initChart: initBChart, setOption: setBOption, onClick: onBClick, offClick: offBClick } = useEcharts(bChartRef);

// 详情弹窗相关
const dialogVisible = ref(false);
const tableLoading = ref(false);
const detailData = ref([]);
const selectedPurchaser = ref('');
const currentRequestId = ref(0); // 添加请求标识符

// 表格列配置
const tableColumns = [
    { label: '品号', prop: 'order_no' },
    { label: '产品型号', prop: 'cx' },
    { label: '不及时日期', prop: 'yc_date' },
    { label: '不及时原因', prop: 'yc_reason' },
    { label: '采购员', prop: 'zrr' },
    { label: '工单号', prop: 'gd' },
    { label: '', prop: 'cust' },
    { label: '创建时间', prop: 'create_time' },
];

// 处理饼图点击事件
const handleChartClick = async (params) => {
    if (params && params.name) {
        const requestId = ++currentRequestId.value; // 生成新的请求ID
        selectedPurchaser.value = params.name;
        tableLoading.value = true;
        dialogVisible.value = true;
        
        try {
            // 根据点击的图表类型确定产品类别
            const cust = params.seriesName === 'A类订单' ? 'A类' : '常规类';
            const res = await getPmcKpiList(params.name, cust);
            
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

// 渲染A类订单图表的函数
const drawAChart = (formattedData) => {
    nextTick(() => {
        const option = createChartOption(formattedData, 'A类订单');
        initAChart(); // 初始化图表实例
        setAOption(option); // 设置配置
        offAClick(handleChartClick); // 先移除之前的事件监听
        onAClick(handleChartClick); // 添加新的事件监听
    });
};

// 渲染B类订单图表的函数
const drawBChart = (formattedData) => {
    nextTick(() => {
        const option = createChartOption(formattedData, '常规订单');
        initBChart(); // 初始化图表实例
        setBOption(option); // 设置配置
        offBClick(handleChartClick); // 先移除之前的事件监听
        onBClick(handleChartClick); // 添加新的事件监听
    });
};

// 处理数据
const processData = (data) => {
    // 根据新的数据结构处理：按采购员分组，分别计算A类和B类订单
    const purchaserMap = new Map();
    
    data.forEach(item => {
        const purchaser = item.purchaserName;
        if (!purchaserMap.has(purchaser)) {
            purchaserMap.set(purchaser, {
                name: purchaser,
                aCount: 0,
                bCount: 0
            });
        }
        const purchaserData = purchaserMap.get(purchaser);
        purchaserData.aCount += item.a_count || 0;
        purchaserData.bCount += item.b_count || 0;
    });
    
    // 处理A类数据
    const aFormattedData = Array.from(purchaserMap.values())
        .filter(item => item.aCount > 0)
        .map(item => ({
            name: item.name,
            value: item.aCount
        }))
        .sort((a, b) => b.value - a.value);

    // 处理B类数据
    const bFormattedData = Array.from(purchaserMap.values())
        .filter(item => item.bCount > 0)
        .map(item => ({
            name: item.name,
            value: item.bCount
        }))
        .sort((a, b) => b.value - a.value);

    if (aFormattedData.length === 0 && bFormattedData.length === 0) {
        isDataEmpty.value = true;
    } else {
        isDataEmpty.value = false;
        drawAChart(aFormattedData);
        drawBChart(bFormattedData);
    }
};

// 请求数据
const fetchData = () => {
    getPmcKpi().then(res => {
        isLoading.value = false;
        if (res.code === 200) {
            processData(res.data);
        } else {
            isDataEmpty.value = true;
        }
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
  
  
  