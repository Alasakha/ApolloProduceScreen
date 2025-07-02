<template>
    <div class="content w-full h-full">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
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
            <div class="chartsbox w-full h-[90%] ">
                <div v-if="!isDataEmpty" ref="chartRef" class="w-full h-full"></div>
                <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">暂无异常数据</div>
            </div>  
        </dv-border-box8>
    </div>
    
    <!-- 使用通用详情弹窗组件 -->
    <DetailDialog
        v-model="dialogVisible"
        :title="`${selectedPurchaser}的来料不合格详情`"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
    />
</template>


<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue';
import { gettimelyAccountingRateDetail,getdeliveryTimelinessRateDetail} from '@/api/getWMSinfo.js'

import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './charts';
import { ElMessage } from 'element-plus';
import { useEcharts } from '@/utils/useEcharts';
import DetailDialog from '@/components/SCM/DetailDialog/index.vue';
import TooltipInfo from '@/components/SCM/TooltipInfo/index.vue'

// 定义 props
const props = defineProps({
    piedata: {
        type: Array,
        default: () => []
    },
    showPurchaseTotal: {
       type: Boolean,
       default: false
     },
     isrukuorchuku: {
        type: Boolean,
        default: true
     }
});

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
const piedata = ref([]);

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

// 入库表头
const rukuColumns = [
    { prop: 'warehouse_name', label: '仓库名称' },
    { prop: 'warehouseKeeper', label: '仓管员' },
    { prop: 'approveDate', label: '到货日期' },
    { prop: 'docNo', label: '单据号' },
    { prop: 'purchase_doc_no', label: '采购单号' },
    { prop: 'item_code', label: '物料编码' },
    { prop: 'itemDescription', label: '物料描述' },
    { prop: 'itemSpecification', label: '规格' }
]

// 出库表头
const chukuColumns = [
    { prop:'udf021',label:'客户单号'},
    { prop: 'ty003', label: '出库日期' },
    { prop: 'warehouse_name', label: '仓库名称' },
    { prop: 'warehouseKeeper', label: '仓管员' },
    { prop: 'required_qty', label: '需求数量' },
    { prop: 'issued_qty', label: '实发数量' },
    { prop: 'itemDescription', label: '物料描述' },
    { prop: 'itemSpecification', label: '规格' },
    { prop: 'docNo', label: '单据号' },
    { prop: 'item_code', label: '物料编码' },
]

// 动态表头
const tableColumns = computed(() => {
    return props.isrukuorchuku ? rukuColumns : chukuColumns
})

// 处理饼图点击事件
const handleChartClick = async (params) => {
    if (params && params.name) {
        const requestId = ++currentRequestId.value; // 生成新的请求ID
        selectedPurchaser.value = params.name;
        tableLoading.value = true;
        dialogVisible.value = true;
        console.log(selectedPurchaser.value)
        try {
            if (props.isrukuorchuku) {
                // 入库相关接口
                const res = await gettimelyAccountingRateDetail(selectedPurchaser.value);
                // 检查这个请求是否是最新的
                if (requestId === currentRequestId.value) {
                    if (res.data && Array.isArray(res.data)) {
                        const formatDetailData = (data) => {
                            return data.map(item => ({
                                ...item,
   
                            }));
                        };
                        detailData.value = formatDetailData(res.data);
                    } else {
                        detailData.value = [];
                        ElMessage.warning('暂无详细数据');
                    }
                }
            } else {
                // 出库相关接口
                const res = await getdeliveryTimelinessRateDetail(selectedPurchaser.value);
                // 检查这个请求是否是最新的
                if (requestId === currentRequestId.value) {
                    if (res.data && Array.isArray(res.data)) {
                        const formatDetailData = (data) => {
                            return data.map(item => ({
                                ...item,
                                required_qty: item.required_qty != null && item.required_qty !== ''
                                  ? Number(item.required_qty).toFixed(0)
                                  : '',
                                issued_qty: item.issued_qty != null && item.issued_qty !== ''
                                  ? Number(item.issued_qty).toFixed(0)
                                  : '',
   
                            }));
                        };
                        detailData.value = formatDetailData(res.data);
                    } else {
                        detailData.value = [];
                        ElMessage.warning('暂无详细数据');
                    }
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
const drawMonthlyIndicators = (piedata) => {
    nextTick(() => {
        const option = createChartOption(piedata, props.showPurchaseTotal === true || props.showPurchaseTotal === 'true');
        initChart(); // 初始化图表实例
        setOption(option); // 设置配置
        offClick(handleChartClick); // 先移除之前的事件监听
        onClick(handleChartClick); // 添加新的事件监听
    });
};

// 监听 piedata 的变化
watch(() => props.piedata, (newData) => {
    console.log('newData',newData)
    if (newData && newData.length > 0) {
        isDataEmpty.value = false;
        drawMonthlyIndicators(newData);
    } else {
        isDataEmpty.value = true;
    }
}, { immediate: true });

onMounted(() => {
    window.addEventListener('resize', resizeChart)
});
    
onBeforeUnmount(() => {
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



