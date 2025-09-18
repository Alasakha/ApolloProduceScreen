<template>
  
    <dv-border-box-9 class="box1 w-full h-full">
      <div class="wrapper flex  h-full">
       <h2 class="title-vertical flex items-center justify-center m-1">设备异常</h2>
            
       <!-- 如果没有数据，显示暂无数据 -->
       <!-- <div v-if="!isLoading && isDataEmpty" class="empty-container">
         暂无数据
       </div> -->
       
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
    header: ['设备名称', '故障描述', '呼叫时间','故障原因','责任人','处理时长','结束码'],
    data: [
      ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']
    ],
    index: true,
    columnWidth: [50],
    align: [],
    rowNum:5,
    // showTooltip: true,
    showTooltip: true,
  })
  
  
  const fetchData = () => {
    getStampingAbnormal().then(res => {
      isLoading.value = false;
      console.log('获取到的数据:', res.data.length);
      if (res.data && res.data.length > 0) {
        const list = res.data;
        isDataEmpty.value = false; // 有数据时设置为false
        
        config.data = list.map(item => [
          item.deviceName ?? '无',
          item.startRemark ?? '无',
          item.startTime ? item.startTime.slice(5, 16) : '无',
          item.startRemark ?? '无',
          // item.endTime ? item.endTime.slice(5, 16) : '无',
          // item.guZhangTypeDuration,
          item.dutyPeopleName ?? '无',
          handleTime(item.startTime) ?? '无', // 修复函数调用
          item.isFinish === 'X' ? '已响应' : '未结束'
        ]);
        console.log('config.data:', config.data);
      } else {
        // 没有数据时设置
        isDataEmpty.value = false; // 改为false，让轮播图显示
        config.data = [
          ['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
        ];
      }
    }).catch(error => {
      console.error('获取数据失败:', error);
      isLoading.value = false;
      isDataEmpty.value = false; // 改为false，让轮播图显示
      config.data = [
        ['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
      ];
    });
  }
  
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




  const handleTime = (startTime) =>{
  if (!startTime) return '无';
  const start = new Date(startTime.replace(/-/g, '/'));
  const now = new Date();
  let diff = Math.floor((now - start) / 1000); // 秒

  if (diff < 0) return '无';

  const days = Math.floor(diff / (24 * 3600));
  diff = diff % (24 * 3600);
  const hours = Math.floor(diff / 3600);
  diff = diff % 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  let result = '';
  if (days > 0) result += `${days}天`;
  if (hours > 0) result += `${hours}小时`;
  if (minutes > 0) result += `${minutes}分`;
  if (seconds > 0 || result === '') result += `${seconds}秒`;

  return result;
  }
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
  
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 24px;
    color: #909399;
  }
  
  /* 暂无数据行的样式 */
  :deep(.dv-scroll-board .header) {
    background-color: #0d47a1;
    color: #fff;
  }
  
  :deep(.dv-scroll-board .rows .row-item) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  :deep(.dv-scroll-board .rows .row-item:nth-child(odd)) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  </style>
   