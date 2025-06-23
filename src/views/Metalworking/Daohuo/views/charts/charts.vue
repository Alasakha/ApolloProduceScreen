<template>
    <div class="content w-full h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="一课-在途信息" />
                <TooltipInfo
                    class="ml-2"
                    tooltip-content="显示各采购员的来料不合格情况统计"
                    :detail-content="tooltipDetailContent"
                    dialog-title="指标说明"
                    placement="right"
                >
                    <template #detail>
                        <div class="detail-content">
                            <h3 class="text-lg font-bold mb-4">数据说明</h3>
                            <ul class="list-disc pl-4 space-y-2">
                                <li>统计周期：每月更新</li>
                                <li>数据来源：质检部门检验记录</li>
                                <li>计算方式：xxxx</li>
                                <li>点击饼图可查看详细记录</li>
                            </ul>
                        </div>
                    </template>
                </TooltipInfo>
            </div>

            <!-- 图表容器 -->
            <div class="chartsbox w-full h-[90%] mt-4">
                <div v-if="!isDataEmpty" ref="chartRef" class="w-full h-full"></div>
                <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">今日暂无数据</div>
            </div>  
        </dv-border-box8>
    </div>
    
    <!-- 使用通用详情弹窗组件 -->
    <DetailDialog
        v-model="dialogVisible"
        :title="`${selectedPurchaser}的一课在途信息详情`"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
    />
</template>


<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { getPlanPie, getPlanInfo } from '@/api/getIncomingInfo'

import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import { createChartOption } from './charts2';
import { ElMessage } from 'element-plus';
import { useEcharts } from '@/utils/useEcharts';
import DetailDialog from '@/components/SCM/DetailDialog/index.vue';
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
const { initChart, setOption, onClick, offClick,resizeChart } = useEcharts(chartRef);

// 详情弹窗相关
const dialogVisible = ref(false);
const tableLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const detailData = ref([]);
const selectedPurchaser = ref('');
const currentRequestId = ref(0); // 添加请求标识符

// 分页数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return detailData.value.slice(start, end);
});

// 处理分页
const handleSizeChange = (val) => {
    pageSize.value = val;
    currentPage.value = 1;
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
};

// 表格列配置
const tableColumns = [
    // { prop: 'arrival_date', label: '到货审核日期', width: 120 },
    { prop: 'business_qty', label: '到货数量', width: 150 },
    { prop: 'caigou', label: '采购员', width: 100 },
    // { prop: 'cangguan', label: '仓管员', width: 80 },
    { prop: 'deliveryTime', label: '到货时间', width: 200 },
    { prop: 'doc_no', label: '工单号', width: 200 },
    // { prop: 'item_code', label: '品号', width: 200 },
    { prop: 'item_description', label: '品名', width: 200 },
    { prop: 'item_specification', label: '规格', width: 200 },
    // { prop: 'jianyan', label: '检验员', width: 200 },
    { prop: 'supplierCode', label: '供应商', width: 200 },
    { prop: 'deliveryTime', label: '预计发货日期', width: 200 },
    { prop: 'expectedArrivalDate', label: '到货日期', width: 200 }
    // { prop: 'supplier_full_name', label: '供应商名称', width: 300 },
    // { prop: 'udf021', label: '客户单号', width: 300 }
]
// 处理饼图点击事件
const handleChartClick = async (params) => {
    if (params && params.name) {
        const requestId = ++currentRequestId.value; // 生成新的请求ID
        selectedPurchaser.value = params.name;
        tableLoading.value = true;
        dialogVisible.value = true;
        
        try {
            const res = await getPlanInfo({caigou:params.name,type:1});
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

    const formattedData = formatPieChartData(data, 'caigou', 'total');

    const processedData = formattedData
        .filter(item => item.value !== 0 && item.name) // 确保name不为空
        .map(item => ({
            name: item.name || '未知',  // 如果name为空则显示"未知"
            value: item.value
        }))
        .sort((a, b) => b.value - a.value);

    if (processedData.length === 0) {
        isDataEmpty.value = true;
    } else {
        isDataEmpty.value = false;
        drawMonthlyIndicators(processedData);
    }
};

// 请求数据
// 请求数据
const fetchData = () => {
    const params = { type: 1 };
    getPlanPie(params).then(res => {
        isLoading.value = false;
        processData(res.data);
    }).catch(() => {
        isLoading.value = false;
        isDataEmpty.value = true;
    });
};


onMounted(() => {
    fetchData();
    window.addEventListener('resize', resizeChart)
    eventBus.on("refreshData", fetchData);
});
    
onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData);
    window.removeEventListener('resize', resizeChart)

});

// 提示组件的详细内容
const tooltipDetailContent = `
来料不合格统计说明：
1. 数据更新频率：每日更新
2. 统计范围：所有采购员的来料检验记录
3. 计算方式：不合格数量/总检验数量
4. 点击饼图可查看具体不合格记录
`;
</script>




<style scoped>
.detail-table {
    max-height: 60vh;
    overflow-y: auto;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 10px;
}

:deep(.el-table) {
    background-color: transparent;
    color: #333;
}

:deep(.el-table th) {
    background-color: #0d47a1;
    color: #000000;
}

:deep(.el-table tr) {
    background-color: #fff;
}

:deep(.el-pagination) {
    margin-right: 20px;
}

:deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.7);
}

/* 修改对话框标题样式 */
:deep(.el-dialog__title) {
    color: #333;
    font-weight: bold;
    font-size: 18px;
}

:deep(.el-dialog__header) {
    background-color: #f5f7fa;
    padding: 15px 20px;
    border-bottom: 1px solid #e4e7ed;
}

:deep(.el-dialog) {
    background-color: #fff;
}
</style>



