<template>
    <dv-border-box10>
        <div class="box1"> 
            <div class="w-full h-full">
                <div ref="qualityIndicators" class="chart-container w-full h-[85%]"></div>
              <dv-button class=" w-[6vw] pl-4" :color="'#23a7dc'"  :bg="false" @click="() => opendialog()">详细数据</dv-button>
            </div>
        </div>
    </dv-border-box10>
    <!-- getAtopDayInspector -->

     <!-- 弹窗 -->
    <TableDialog
    v-model="dialogTableVisible"
    :title= title
    width="60vw"
    :tableData="gridData"
    :columns="gridColumns"
  />
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { getAtopDayInspector,getAbnormalDetail } from '@/api/getQuiltyinfo';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import TableDialog from '../components/dialog.vue';
import { createChartOption } from './data';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装

const dialogTableVisible = ref(false);
const title = ref('今日功性能不良'); // 对话框标题
const pageTitle = ref('今日功性能不良'); // 新增：固定的页面标题
const reasonType = 1;
const dayType = 1
const qualityIndicators = ref(null);
const rawData = ref([]);
const isLoading = ref(true);
const isDataEmpty = ref(false); 


const { initChart, setOption, resizeChart,onClick } = useEcharts(qualityIndicators); // 使用封装的逻辑

const gridData = ref([]);
const gridColumns = [
  { prop: 'guZhangTypeName', label: '故障类型' },
  { prop: 'startRemark', label: '故障描述' },
  { prop: 'startPeopleName', label: '申报人' },
  { prop: 'startTime', label: '申报时间' },
  { prop: 'endTime', label: '故障结束时间' },
  { prop: 'dutyPeopleName', label: '故障责任人' },
  { prop: 'endPeopleName', label: '故障解除人' },
  { prop: 'ta001', label: '工单号1' },
  { prop: 'ta002', label: '工单号2' },
  { prop: 'dutyDeptName', label: '故障责任部门' }
];



const opendialog = () => {
  dialogTableVisible.value = true;
  title.value = pageTitle.value; // 使用固定的页面标题
  getAbnormalDetail('', reasonType, '', '', '', '', dayType)
 
    .then(res => {
      gridData.value = res.data;
    });
};


const fetchData = () => {
    getAtopDayInspector( reasonType,dayType)
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
  title.value = `${clickedName}的详细数据`; // 对话框标题根据点击内容变化
  dialogTableVisible.value = true;

  getAbnormalDetail('', reasonType, '', clickedName, '', '', dayType) // 假设 API 接口第三个参数是问题名
    .then(res => {
      gridData.value = res.data;
    });
};

const processData = (data) => {
  const formatted = formatPieChartData(data, 'peopleName', 'total');
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


