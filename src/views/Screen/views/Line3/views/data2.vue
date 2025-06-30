<template>
    <div class="data w-[25%]">
        <dv-border-box12>
          <div ref="qualityIndicators" class="chart-container w-full h-[80%]"></div>
          <dv-button class="w-[11vw] pl-4"  :color="'#23a7dc'" :bg="false"  @click="() => opendialog()">详细数据</dv-button>
         
        </dv-border-box12>
    </div>
    
   <!-- 弹窗 -->
   <TableDialog
    v-model="dialogTableVisible"
    :title= title
    width="800px"
    :tableData="gridData"
    :columns="gridColumns"
    @refresh="refreshDialogData"
  />
   </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, reactive, computed,watch,nextTick } from 'vue';
  import { getResponsityDepartmentRank,getAbnormalDetail } from '@/api/getQuiltyinfo';
  import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import TableDialog from '../components/dialog.vue';
import { createChartOption } from './data.ts';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装
const dialogTableVisible = ref(false);
const title = ref('今日功性能责任');
const pageTitle = ref('今日功性能责任');
const reasonType = 1;

const qualityIndicators = ref(null);
const rawData = ref([]);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const route = useRoute();
const prodLine = route.query.prodLine;
let chartInstance = null;

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
  { prop: 'ngResponPeople', label: '责任人'}
];
const opendialog = () => {
  dialogTableVisible.value = true;
  title.value = pageTitle.value; // 使用固定的页面标题
  getAbnormalDetail(prodLine,reasonType,undefined,undefined)
    .then(res => {
      gridData.value = res.data;
    });
};


  const fetchData = () => {
    getResponsityDepartmentRank(prodLine, reasonType)
    .then(res => {

      gridData.value = res.data;
      isLoading.value = false;
      processData(res.data);
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;
    });
};

  const processData = (data) => {
      const formattedData = formatPieChartData(data, 'md002', 'total');
      rawData.value = formattedData.map(item => ({
    name: item.name || '未知',
    value: item.value ? parseInt(item.value, 10) : 0
  }));
    };
  
// 点击饼图区域，弹出对应信息
const handleChartClick = (params) => {
  const clickedName = params.name;
  console.log(clickedName)
  title.value = `${clickedName}的详细数据`;
  dialogTableVisible.value = true;

  getAbnormalDetail(prodLine, reasonType, undefined,undefined,clickedName) // 假设 API 接口第三个参数是问题名
    .then(res => {
      gridData.value = res.data;
    });
};



watch(rawData, () => {
  nextTick(() => {
    initChart();
    const option = createChartOption(pageTitle.value, rawData.value); // 使用固定的页面标题
    setOption(option);
    onClick(handleChartClick); // ✅ 恢复点击事件绑定
  });
}, { deep: true, immediate: true });

  // 8. 页面挂载时获取数据
  onMounted(() => {
    fetchData();
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
  // 9. 组件卸载时移除监听事件并销毁图表
  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.dispose(); // 销毁图表实例
    }
    window.removeEventListener('resize', resizeChart); // 移除监听器
  });

  const refreshDialogData = () => {
    // 重新获取对话框数据
    if (dialogTableVisible.value) {
      getAbnormalDetail(prodLine, reasonType, undefined, undefined)
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