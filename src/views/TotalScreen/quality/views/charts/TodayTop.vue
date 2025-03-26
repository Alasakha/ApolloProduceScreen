<template>

  <div class="box1"> 
        <h1>今日不良TOP5</h1>
        <dv-scroll-ranking-board :config="config" style="width:90%;height:100%" />
  </div>
  </template>
  
  
  <script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
  import { getResponsityRank } from '../../../../../api/getQuiltyinfo';
  import { useRoute } from 'vue-router';
  import { eventBus } from '../../../../../utils/eventbus';
  import { formatPieChartData } from '@/utils/map';
  const route = useRoute();
const prodLine = route.query.prodLine;
// Loading 和 数据为空的状态
const isLoading = ref(true);
const isDataEmpty = ref(false);


  const config = reactive({
    fontSize:15,
    waitTime:5000,
    data: [],
    unit: '个',
  })

const processData = (data) => {

const formattedData = formatPieChartData(data, 'ngName', 'total');
console.log(formattedData);
if (formattedData.length === 0) {

  isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
} else {

  isDataEmpty.value = false;
  config.data = formattedData;  // 这里赋值给 config.data
}
};

  onMounted(() => {
    fetchData(); // 组件挂载时先请求一次
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
    });

 // 清理定时器，避免组件卸载后定时器继续执行
 onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });
  
  const fetchData = () => {
    getResponsityRank(prodLine).then(res => {
    isLoading.value = false;   // 加载完成，关闭 loading 状态
    processData(res.data);
  }).catch(() => {  
      isLoading.value = false;
      isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
    });
  }


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