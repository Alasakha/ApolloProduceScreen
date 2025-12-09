<template>
  <dv-border-box10>
      <div class="box1"> 
          <div class="w-full h-full">
              <div ref="qualityIndicators" class="chart-container w-full h-[85%]"></div>
            <dv-button class=" w-[6vw] pl-4" :color="'#23a7dc'"  :bg="false" @click="() => opendialog()">详细数据</dv-button>
          </div>
      </div>
  </dv-border-box10>

   <!-- 弹窗 -->
  <TableDialog
  v-model="dialogTableVisible"
  :title="title"
  width="60vw"
  :tableData="gridData"
  :columns="gridColumns"
  :loading="tableLoading"
/>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { getQualityCheckPie, getQualityCheck } from '@/api/getQuiltyinfo';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import TableDialog from '../components/dialog.vue';
import { createChartOption } from './data';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装

const dialogTableVisible = ref(false);
const title = ref('检验信息超时'); // 对话框标题
const pageTitle = ref('检验信息超时'); // 新增：固定的页面标题
const type = 1;
const qualityIndicators = ref(null);
const rawData = ref([]);
const isLoading = ref(true);
const isDataEmpty = ref(false); 
const tableLoading = ref(false);

const { initChart, setOption, resizeChart,onClick } = useEcharts(qualityIndicators); // 使用封装的逻辑

const gridData = ref([]);
const gridColumns = [
{ prop: 'arrival_date', label: '扫码送检时间', width: 120 },
{ prop: 'plan_complete_date', label: '检验应完成时间', width: 200 },
{ prop: 'business_qty', label: '到货数量', width: 150 },
{ prop: 'caigou', label: '采购员', width: 100 },
{ prop: 'cangguan', label: '仓管员', width: 80 },
{ prop: 'item_code', label: '品号', width: 200 },
{ prop: 'item_description', label: '品名', width: 200 },
{ prop: 'item_specification', label: '规格', width: 200 },
{ prop: 'jianyan', label: '检验员', width: 200 },
{ prop: 'supplierCode', label: '供应商', width: 200 },
{ prop: 'supplier_full_name', label: '供应商名称', width: 300 },
{ prop: 'udf021', label: '客户单号', width: 300 }
]



const opendialog = () => {
dialogTableVisible.value = true;
tableLoading.value = true; // 开始加载
title.value = pageTitle.value; // 使用固定的页面标题
getQualityCheck({ type })
  .then(res => {
    gridData.value = Array.isArray(res.data) ? res.data : [];
  })
  .finally(() => {
    tableLoading.value = false; // 加载结束
  });
};


const fetchData = () => {
  getQualityCheckPie({ type })
  .then(res => {
    isLoading.value = false;
    processData(res.data);
  })
  .catch(() => {
    isLoading.value = false;
    isDataEmpty.value = true;
  });     
};

// 点击饼图区域，弹出对应信息
const handleChartClick = (params) => {
const clickedName = params.name;
title.value = `${clickedName}的检验信息`; // 对话框标题根据点击内容变化
dialogTableVisible.value = true;
tableLoading.value = true;

getQualityCheck({ jianyan: clickedName, type })
  .then(res => {
    gridData.value = Array.isArray(res.data) ? res.data : [];
  })
  .finally(() => {
    tableLoading.value = false;
  });
};

const processData = (data) => {
const formatted = formatPieChartData(data, 'jianyan', 'total');
rawData.value = formatted.map(item => ({
  name: item.name || '未知',
  value: item.value ? parseInt(item.value, 10) : 0
}));
isDataEmpty.value = rawData.value.length === 0;
};

watch(rawData, () => {
nextTick(() => {
  initChart();
  const option = createChartOption(pageTitle.value, rawData.value); // 使用固定的页面标题
  setOption(option);
  onClick(handleChartClick); // ✅ 恢复点击事件绑定
});
}, { deep: true, immediate: true });

onMounted(() => {
fetchData();
resizeChart()
eventBus.on("refreshData", fetchData);
});

onBeforeUnmount(() => {
eventBus.off("refreshData", fetchData); // 避免内存泄漏
});
</script>


<style scoped>
.box1{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: start;
  color:aliceblue;

}
h1{
  font-size: 1.5vw;
  color:aliceblue;
  letter-spacing: 0.5vw;
}
:deep(.inside-column) {
height: 2vh !important; /* 这里改成你想要的宽度 */
}
</style>


