<template>
    <div class="data w-[25%]">
        <dv-border-box12>
            <div class="box1"> 
          <div class="w-full h-full">
              <div ref="qualityIndicators" class="chart-container w-full h-[80%]"></div>
              <div class="showData">
                异常总数：{{ rawData.length }} 已填写数量：{{ rawData.length }}
              </div>
              <dv-button class=" w-[11vw] pl-4" :color="'#23a7dc'"  :bg="false" @click="() => opendialog(prodLine)">详细数据</dv-button>
            </div>
        </div>
        </dv-border-box12>
    </div>
    
<!-- 弹窗 -->
    <TableDialog
    v-model="dialogTableVisible"
    :title= title
    width="60vw"
    :tableData="gridData"
    :columns="gridColumns"
    @refresh="refreshDialogData"
  />
  </template>
  
  <script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { getResponsityRank,getAbnormalDetail } from '@/api/getQuiltyinfo';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import TableDialog from '../components/dialog.vue';
import { createChartOption } from './data.ts';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装

const dialogTableVisible = ref(false);
const title = ref('今日功性能不良'); // 对话框标题
const pageTitle = ref('今日功性能不良'); // 新增：固定的页面标题

const reasonType = 1;

const qualityIndicators = ref(null);
const rawData = ref([]);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const route = useRoute();
const prodLine = route.query.prodLine;

const { initChart, setOption, resizeChart,onClick } = useEcharts(qualityIndicators); // 使用封装的逻辑

const gridData = ref([]);
const gridColumns = [
  { prop: 'ngName', label: '不良问题' },
  { prop: 'createDate', label: '发现时间' },
  { prop: 'ta002', label: '工单单号' },
  { prop: 'ta006', label: '品号' },
  { prop: 'mb002', label: '车型' },
  { prop: 'peopleName', label: '发现人' },
  { prop: 'admin_UNIT_NAME', label: '责任部门'},
  { prop: 'ngResponPeople', label: '责任人'},
  { prop: 'ngReason', label: '异常原因'},
  { prop: 'ngHandle', label: '异常处理方式'},
  { prop: 'uid', label: 'uid' }
];


const getDetail = () => {
  getAbnormalDetail(prodLine, reasonType)
    .then(res => {
      gridData.value = res.data;
    });
}
const opendialog = () => {
  dialogTableVisible.value = true;
  title.value = pageTitle.value; // 使用固定的页面标题
  getDetail()
};


const fetchData = () => {
  getResponsityRank(prodLine, reasonType)
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
  title.value = `${clickedName} 的详细数据`; // 对话框标题根据点击内容变化
  dialogTableVisible.value = true;

  getAbnormalDetail(prodLine, reasonType, clickedName) // 假设 API 接口第三个参数是问题名
    .then(res => {
      gridData.value = res.data;
    });
};

const processData = (data) => {
  const formatted = formatPieChartData(data, 'ngName', 'total');
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
  getDetail()
  eventBus.on("refreshData", fetchData);
  eventBus.on("refreshDetail", getDetail);
});

onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 避免内存泄漏
});

const refreshDialogData = () => {
  // 重新获取对话框数据
  if (dialogTableVisible.value) {
    getAbnormalDetail(prodLine, reasonType)
      .then(res => {
        gridData.value = res.data;
      });
  }
  // 同时刷新图表数据
  fetchData();
};
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