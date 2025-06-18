<template>
  

      <div class="wrapper flex flex-col h-full">

            
       <!-- 如果没有数据，显示暂无数据 -->
       <div v-if="!isLoading && isDataEmpty" class="empty-container">
         暂无数据
       </div>
       
       <!-- 数据加载完成且非空时显示图表 -->
        <div class="tablebox w-full h-[90%]">
           <!-- 如果正在加载，显示 loading -->
         <dv-loading v-if="isLoading" class="text-white">Loading...</dv-loading>
  
          <ScrollBoard v-if="!isLoading && !isDataEmpty" :config="config" @click="clickHandler" />
        </div>
      </div>

  
    <!-- 弹窗部分 -->
  <el-dialog v-model="dialogVisible" title="详细信息" width="50%">
    <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
      <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
    </div>
  </el-dialog>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick ,onBeforeUnmount,reactive} from 'vue';
  import ScrollBoard from '@/components/datav/ScrollBoard.vue'
  import * as echarts from 'echarts';
  import { fetchClosingRateData } from './fetchMesData';
  import { useRoute } from 'vue-router';
  import { eventBus } from '@/utils/eventbus';
  
  const dialogVisible = ref(false);//弹窗控制
  const selectedItem = ref({});
  const route = useRoute();
  const prodLine = route.query.prodLine;
  const monthlyIndicators = ref(null);
  const isLoading = ref(true);
  const isDataEmpty = ref(false);
  const categories = ref([]); // X 轴数据
  const values = ref([]); // Y 轴数据
  let chartInstance = null;
  const scrollBoardRef = ref(null);
  const config = reactive({
    header: ['状态', '客户单号', '工单号','车型名称','工单数量','应完成时间','欠数','处理时长'],
    data: [
      ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']
    ],
    index: true,
  columnWidth: [50,50],
    align: [],
    rowNum:6,
      // showTooltip: true,
      showTooltip: true,
  })


  const fetchData = () => {
    fetchClosingRateData((prodLine))
      .then((res) => {
        if (res && res.length > 0) {
          config.data = res.map(item => [
            '未完工',
            item.number ?? '无',
            item.workNo ?? '无',
            item.specifications ?? '无',
            Number(item.productionQuantity) ?? '无',
            item.dateTime  ?? '无',
            Number(item.productionQuantity)-Number(item.inboundQuantity),
            item.daysBetween+'天' ??'无'
          ])
          isDataEmpty.value = false;
        } 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);  // 错误回调
        isDataEmpty.value = true; // 如果发生错误，显示暂无数据
      })
      .finally(() => {
        isLoading.value = false;  // 无论成功失败，都结束加载
      });
  };
  
  // 在组件挂载时启动定时获取数据
  onMounted(() => {
    fetchData(); // 组件挂载时先请求一次
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
    // 清理定时器，避免组件卸载后定时器继续执行
    onBeforeUnmount(() => {
      eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
    });
  
  
    const clickHandler = (row) => {
    selectedItem.value = row.row; // 直接保存整行
    dialogVisible.value = true;
  };
  </script>
  
  
  <style scoped>
  .box1 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: aliceblue;
    padding: 20px;
  }
  
  h2 {
    top: 0.5vh;
    left: 1vw;
    margin: 0;
    font-size: 1vw;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  
  
  </style>
   