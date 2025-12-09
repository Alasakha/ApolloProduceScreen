<template>
  <div class="content w-full h-full">
    <dv-border-box8 :dur="5">
      <!-- 标题和提示 -->
      <div class="flex items-center">
        <!-- <GlobalTitle title="检验信息(超时)" /> -->
        <!-- <TooltipInfo
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
        </TooltipInfo> -->
      </div>
      <!-- 图表容器 -->
      <div class="chartsbox w-full h-[90%]">
        <div  ref="chartRef" class="w-full h-full"></div>
      
      </div>
      <!-- <dv-button :color="'#23a7dc'" class=" w-[6vw] pl-4"  size="small" @click="openDetailDialog">详细数据</dv-button> -->
    </dv-border-box8>
    <!-- 详情弹窗 -->
    <DetailDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :loading="tableLoading"
      :data="detailData"
      :columns="tableColumns"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getCsyjbCompletePie, getCsyjbComplete } from '@/api/getQuiltyinfo';
import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './data';
import { useEcharts } from '@/utils/useEcharts';
import DetailDialog from '@/components/SCM/DetailDialog/index.vue';

const chartRef = ref(null);
const { initChart, setOption, onClick, offClick, resizeChart } = useEcharts(chartRef);

const CHART_TITLE = '月度测试计划达成率';
const DETAIL_TITLE = '月度测试清单';

const isDataEmpty = ref(false);
const dialogVisible = ref(false);
const tableLoading = ref(false);
const detailData = ref([]);
const dialogTitle = ref(DETAIL_TITLE);
const selectedStatus = ref('');
const currentRequestId = ref(0);

const tableColumns = [
  { prop: 'department', label: '所属部门', width: 160 },
  { prop: 'status', label: '状态', width: 120 },
  { prop: 'projectCode', label: '项目编号', width: 180 },
  { prop: 'projectName', label: '项目名称', width: 240 },
  { prop: 'planCode', label: '计划编号', width: 220 },
  { prop: 'action', label: '行动举措', width: 280 },
  { prop: 'plannedFinish', label: '计划完成时间', width: 160 },
  { prop: 'actualFinish', label: '实际完成时间', width: 160 },
  { prop: 'owner', label: '负责人', width: 120 },
  { prop: 'checker', label: '核查人', width: 120 },
  { prop: 'checkResult', label: '核查结果', width: 140 }
];

const rawData = ref([]);

const sanitizeString = (value: any) => {
  if (typeof value === 'string') return value.trim();
  return value ?? '-';
};

const mapDetailData = (list: any[]) =>
  list.map(item => ({
    department: sanitizeString(item?.['所属部门']),
    status: sanitizeString(item?.['状态描述']),
    projectCode: sanitizeString(item?.['所属项目编号']),
    projectName: sanitizeString(item?.['所属项目名称']),
    planCode: sanitizeString(item?.['计划编号']),
    action: sanitizeString(item?.['行动举措']),
    plannedFinish: sanitizeString(item?.['计划完成时间']),
    actualFinish: sanitizeString(item?.['实际完成时间']),
    owner: sanitizeString(item?.['负责人名称']),
    checker: sanitizeString(item?.['核查人名称']),
    checkResult: sanitizeString(item?.['核查结果'])
  }));


// 饼图数据加载
const fetchData = () => {
  getCsyjbCompletePie()
    .then(res => {
      const formatted = Array.isArray(res.data)
        ? res.data
            .map(item => ({
              name: item?.['状态描述']?.trim() || '未知状态',
              value: Number(item?.total ?? 0)
            }))
            .filter(item => item.value !== 0)
            .sort((a, b) => b.value - a.value)
        : [];
      rawData.value = formatted;
      isDataEmpty.value = rawData.value.length === 0;
      nextTick(() => {
        initChart();
        const option = createChartOption(CHART_TITLE, rawData.value);
        setOption(option);
        offClick(handleChartClick);
        onClick(handleChartClick);
      });
    })
    .catch(() => {
      isDataEmpty.value = true;
    });
};

// 饼图点击事件
const handleChartClick = async (params: any) => {
  if (params && params.name) {
    const requestId = ++currentRequestId.value;
    selectedStatus.value = params.name;
    dialogTitle.value = `${DETAIL_TITLE} - ${params.name}`;
    dialogVisible.value = true;
    tableLoading.value = true;
    try {
      const res = await getCsyjbComplete(params.name);
      if (requestId === currentRequestId.value) {
        const list = Array.isArray(res.data) ? res.data : [];
        detailData.value = mapDetailData(list);
      }
    } catch {
      if (requestId === currentRequestId.value) detailData.value = [];
    } finally {
      if (requestId === currentRequestId.value) tableLoading.value = false;
    }
  }
};

// 详细数据按钮
// const openDetailDialog = async () => {
//   selectedStatus.value = '';
//   dialogTitle.value = DETAIL_TITLE;
//   dialogVisible.value = true;
//   tableLoading.value = true;
//   try {
//     const res = await getCsyjbComplete('完成');
//     detailData.value = Array.isArray(res.data) ? res.data : [];
//   } catch {
//     detailData.value = [];
//   } finally {
//     tableLoading.value = false;
//   }
// };

onMounted(() => {
  fetchData();
  window.addEventListener('resize', resizeChart);
  eventBus.on('refreshData', fetchData);
});
onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
  window.removeEventListener('resize', resizeChart);
});
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
}
.chartsbox {
  width: 100%;
  height: 90%;
}
.detail-content {
  color: #fff;
}
</style>


