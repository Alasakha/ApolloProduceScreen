<template>
    <div class="content">
        <dv-border-box8 :dur="5">
            <!-- 标题和提示 -->
            <div class="flex items-center">
                <GlobalTitle title="来料质量异常采购员占比" :size="1"/>
                <TooltipInfo
                    class="ml-2"
                    tooltip-content="显示各采购员的来料质量异常情况统计"
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
                <!-- 使用通用详情弹窗组件 -->
    <DetailDialog
        v-model="dialogVisible"
        :title="`${selectedPurchaser}的到货不及时详情`"
        :loading="tableLoading"
        :data="detailData"
        :columns="tableColumns"
    />
            <div class="chartsbox w-full h-[17vh] mt-4">
                <div v-if="!isDataEmpty" ref="chartRef" class="w-full h-full"></div>
                <div v-else class="w-full h-full flex items-center justify-center text-white text-3xl">今日暂无数据</div>
            </div>  
        </dv-border-box8>
    </div>


</template>

<script setup>
import BigScreenTitle from '@/components/title.vue'
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
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

const props = defineProps({
  guolvData: {
    type: Array,
    default: () => []
  }
})

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
  { label: '采购内勤', prop: 0 },
  { label: '供应商', prop: 1 },
  { label: '到货单号', prop: 2 },
  { label: '品名', prop: 3 },
  { label: '品号', prop: 4 },
  { label: '规格', prop: 5 },
  { label: '不合格数量', prop: 6 },
  { label: '检验日期', prop: 7 },
  { label: '问题点', prop: 8 },
  { label: '判断结果', prop: 9 },
  { label: '处理时长', prop: 10 },
  { label: '处理结果', prop: 11 }
]

// 处理饼图点击事件
const handleChartClick = (params) => {
    if (params && params.name) {
        selectedPurchaser.value = params.name;
        dialogVisible.value = true;
        // 这里筛选出所有属于该采购员的原始数据
        detailData.value = props.guolvData.filter(item => item[0] === params.name);
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

// 提示组件的详细内容
const tooltipDetailContent = `
到货不及时统计说明：
1. 数据更新频率：每日更新
2. 统计范围：所有采购员的到货记录
3. 计算方式：延迟到货数/总到货数
4. 点击饼图可查看具体延迟记录
`;

// 统计每个 purchaserName 的数量
const purchaserCount = computed(() => {
  const map = {}
  for (const item of props.guolvData) {
    const purchaser = item[0] || '--'
    map[purchaser] = (map[purchaser] || 0) + 1
  }
  // 转成饼图需要的格式
  return Object.entries(map).map(([name, value]) => ({ name, value }))
})

// 只保留 watch
watch(purchaserCount, (val) => {
  drawMonthlyIndicators(val)
}, { immediate: true })
</script>

<style scoped>
</style>
  
  
  