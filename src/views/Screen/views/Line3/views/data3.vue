<template>
    <div class="efficency w-[25%]">
      <dv-border-box12>
        <div class="w-full h-full">
          <div ref="qualityIndicators" class="chart-container w-full  h-[90%]"></div>
          <dv-button class="w-30 pl-4"  :bg="false" @click="dialogTableVisible = true">详细数据</dv-button>
        </div>
        </dv-border-box12>
    </div>

    <!-- 弹窗 -->
    <TableDialog
    v-model="dialogTableVisible"
    :title= title
    width="800px"
    :tableData="gridData"
    :columns="gridColumns"
  />
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, reactive, computed,watch,nextTick } from 'vue';
  import { getResponsityRank } from '@/api/getQuiltyinfo';
  import { useRoute } from 'vue-router';
  import { eventBus } from '@/utils/eventbus';
  import { formatPieChartData } from '@/utils/map';
  import TableDialog from '../components/dialog.vue'
  import * as echarts from 'echarts';
  import { createChartOption } from './data.ts';
import { useEcharts } from '@/utils/useEcharts'; // 引入封装
  const reasonType = 2
  const dialogTableVisible = ref(false)
  const title = '今日其他功性能不良'
    const route = useRoute();
  const prodLine = route.query.prodLine;
  // Loading 和 数据为空的状态
  const isLoading = ref(true);
  const isDataEmpty = ref(false);
  let chartInstance = null;
  const qualityIndicators = ref(null);
  const rawData = ref([]);
  
  const { initChart, setOption, resizeChart } = useEcharts(qualityIndicators); // 使用封装的逻辑

  const gridData = ref([]);

  const gridColumns = [
    { prop: 'ngName', label: '不良问题',  },
    { prop: 'total', label: '数量',  },
  ]
  const fetchData = () => {
    getResponsityRank(prodLine, reasonType)
    .then(res => {
      gridData.value = res.data;
      isLoading.value = false;
      processData(res.data);
    })
    .catch(() => {
      isLoading.value = false;
    });
};
  
  const processData = (data) => {
    const formattedData = formatPieChartData(data, 'ngName', 'total');
    rawData.value = formattedData.map(item => ({
    name: item.name || '未知',
    value: item.value ? parseInt(item.value, 10) : 0
  }));
}

  


  watch(rawData, () => {
  nextTick(() => {
    initChart();
    const option = createChartOption(title, rawData.value);
    setOption(option);
  });
}, { deep: true, immediate: true });

  
  

  
  // 8. 页面挂载时获取数据
  onMounted(() => {
    fetchData()
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
  // 9. 组件卸载时移除监听事件并销毁图表
  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.dispose(); // 销毁图表实例
    }
    window.removeEventListener('resize', resizeChart); // 移除监听器
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