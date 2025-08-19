<template>
  
    <dv-border-box-9 class="box1 w-full h-full">
      <div class="wrapper flex  h-full">
       <h2 class="title-vertical flex items-center justify-center m-1">设备异常</h2>
            
       <!-- 如果没有数据，显示暂无数据 -->
       <div v-if="!isLoading && isDataEmpty" class="empty-container">
         暂无数据
       </div>
       
       <!-- 数据加载完成且非空时显示图表 -->
        <div class="tablebox w-full h-[90%]">
           <!-- 如果正在加载，显示 loading -->
         <dv-loading v-if="isLoading">Loading...</dv-loading>
  
          <ScrollBoard v-if="!isLoading && !isDataEmpty" :config="config" @click="clickHandler" />
        </div>
      </div>
    </dv-border-box-9>
  
    <!-- 弹窗部分 -->
  <el-dialog v-model="dialogVisible" title="详细信息" width="50%">
    <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
      <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
    </div>
  </el-dialog>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick ,onBeforeUnmount,reactive} from 'vue';
  import * as echarts from 'echarts';
  import { getStampingAbnormal } from '@/api/getStampWeldinfo';
  import { useRoute } from 'vue-router';
  import { eventBus } from '@/utils/eventbus';
  import ScrollBoard from '@/components/datav/ScrollBoard.vue'
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
  const config = reactive({
    header: ['故障类型', '故障描述', '呼叫时间','故障原因','责任人','故障解除人','品号'],
    data: [
      ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']
    ],
    index: true,
    columnWidth: [50],
    align: [],
    rowNum:7,
    // showTooltip: true,
    showTooltip: true,
  })
  
  
  const fetchData = () => {
    getStampingAbnormal().then(res => {
    isLoading.value = false;
      console.log('获取到的数据:', res.data.length);
    if (res.data.length !== 0) {
      const list = res.data;
  
      config.data = list.map(item => [
        item.guZhangTypeName ?? '无',
        item.startRemark ?? '无',
          item.startTime ? item.startTime.slice(5, 16) : '无',
          item.startRemark ?? '无',
          // item.endTime ? item.endTime.slice(5, 16) : '无',
        // item.guZhangTypeDuration,
        item.dutyPeopleName ?? '无',
        item.ta033 ?? '无'
      ]);
      console.log('config.data:', config.data)
    }
  });}
  
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
    font-weight: bold;
  }
  .title-vertical {
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 10px;
    line-height: 1;
  }
  
  
  
  </style>
   